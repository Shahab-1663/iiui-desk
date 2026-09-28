"use client";

import { upload } from "@vercel/blob/client";
import { ArrowRight, Check, FileUp, LoaderCircle, UploadCloud } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { resourceMetadataSchema, type ResourceMetadata } from "@/lib/validators";
import type { DirectoryFaculty } from "@/lib/catalog-db";

const empty: ResourceMetadata = { facultySlug: "computing", departmentSlug: "", degreeName: "", degreeLevel: "Undergraduate", courseCode: "", courseName: "", semester: 1, kind: "notes", title: "", description: "" };

const facultyHints: Array<{ slug: string; match: RegExp }> = [
  { slug: "computing", match: /computer|program|algorithm|software|data.?structure|bscs|bs.?cs|bsit|bs.?it|cs\b|se\b|it\b/i },
  { slug: "engineering", match: /engineer|electrical|civil|mechanical|telecom|technology/i },
  { slug: "shariah-law", match: /sharia|shari'ah|law|juris|fiqh/i },
  { slug: "islamic-economics", match: /islamic.?econom|economics|finance/i },
  { slug: "management", match: /management|business|marketing|accounting|mba|bba/i },
  { slug: "arabic", match: /arabic/i },
  { slug: "languages", match: /english|linguistic|literature|translation/i },
  { slug: "education", match: /education|teaching|pedagogy|b.ed/i },
  { slug: "sciences", match: /physics|math|chem|biology|science/i },
  { slug: "social-sciences", match: /social|psych|media|politic|sociolog|history/i },
  { slug: "usuluddin", match: /usuluddin|tafsir|quran|hadith|dawah|aqeedah|seerah/i },
];

type DegreeOption = { id: string; name: string; level: string; slug: string; courses: Array<{ code: string; name: string; semester: number }> };
type DepartmentOption = { slug: string; name: string };

export function UploadForm({ initialFaculty, initialDepartment }: { initialFaculty?: string; initialDepartment?: string }) {
  const [values, setValues] = useState<ResourceMetadata>({ ...empty, ...(initialFaculty ? { facultySlug: initialFaculty } : {}) });
  const [facultyOptions, setFacultyOptions] = useState<Array<Pick<DirectoryFaculty, "slug" | "name" | "short">>>([]);
  const [departments, setDepartments] = useState<DepartmentOption[]>([]);
  const [file, setFile] = useState<File>();
  const [degrees, setDegrees] = useState<DegreeOption[]>([]);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const courseOptions = useMemo(() => degrees.find((degree) => degree.name.toLowerCase() === values.degreeName.toLowerCase())?.courses ?? [], [degrees, values.degreeName]);

  useEffect(() => {
    let live = true;
    fetch(`/api/catalog?faculty=${encodeURIComponent(values.facultySlug)}`).then((response) => response.ok ? response.json() as Promise<{ faculties: Array<Pick<DirectoryFaculty, "slug" | "name" | "short">>; departments: DepartmentOption[]; degrees: DegreeOption[] }> : { faculties: [], departments: [], degrees: [] }).then((data) => {
      if (!live) return;
      setFacultyOptions(data.faculties);
      setDepartments(data.departments);
      setDegrees(data.degrees);
      setValues((previous) => ({ ...previous, departmentSlug: data.departments.some((department) => department.slug === (initialDepartment ?? previous.departmentSlug)) ? (initialDepartment ?? previous.departmentSlug) : data.departments[0]?.slug ?? "" }));
    }).catch(() => { if (live) { setDegrees([]); setDepartments([]); setFacultyOptions([]); } });
    return () => { live = false; };
  }, [values.facultySlug, initialDepartment]);

  function set<K extends keyof ResourceMetadata>(key: K, value: ResourceMetadata[K]) {
    setValues((previous) => ({ ...previous, [key]: value }));
  }

  function chooseFile(selected?: File) {
    if (!selected) return;
    setError("");
    if (selected.size > 20 * 1024 * 1024) { setError("Choose a file smaller than 20 MB."); return; }
    const allowed = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation", "image/jpeg", "image/png", "image/webp"];
    if (!allowed.includes(selected.type)) { setError("Choose a PDF, Word file, PowerPoint or image."); return; }
    setFile(selected);
    const name = selected.name.replace(/[_-]+/g, " ").replace(/\.[^.]+$/, "");
    const hints = [...facultyHints].sort((a, b) => Number(b.match.test(name)) - Number(a.match.test(name)));
    const likelyFaculty = hints.find(({ match }) => match.test(name));
    const courseCode = name.match(/\b[A-Z]{2,5}[\s-]?\d{2,4}\b/i);
    const semester = name.match(/(?:semester|sem)[\s._-]*([1-8])\b|\bs([1-8])\b/i);
    const kind = /past[\s._-]?paper|mid[\s._-]?term|final[\s._-]?exam|quiz/i.test(name) ? "past_paper" : /assignment|lab[\s._-]?report/i.test(name) ? "assignment" : /study[\s._-]?guide/i.test(name) ? "study_guide" : /note/i.test(name) ? "notes" : values.kind;
    setValues((previous) => ({ ...previous, ...(likelyFaculty ? { facultySlug: likelyFaculty.slug } : {}), ...(courseCode ? { courseCode: courseCode[0].replace(/[ -]/g, "").toUpperCase() } : {}), ...(semester ? { semester: Number(semester[1] || semester[2]) } : {}), kind, title: previous.title || name }));
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess(false);
    if (!file) { setError("Choose a file to share."); return; }
    const parsed = resourceMetadataSchema.safeParse(values);
    if (!parsed.success) { setError(parsed.error.issues[0]?.message ?? "Check the required details."); return; }
    setBusy(true);
    try {
      const result = await upload(`student-desk/${file.name.replace(/[^a-zA-Z0-9._-]/g, "-")}`, file, {
        access: "private",
        handleUploadUrl: "/api/resources/upload",
        clientPayload: JSON.stringify(parsed.data),
        onUploadProgress: ({ percentage }) => setProgress(percentage),
      });
      if (!result.url) throw new Error("The file upload did not complete. Please try again.");
      setSuccess(true);
      setFile(undefined);
      setValues((previous) => ({ ...empty, facultySlug: previous.facultySlug }));
      if (fileRef.current) fileRef.current.value = "";
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Upload could not be completed.");
    } finally {
      setBusy(false);
      setProgress(0);
    }
  }

  return <form className="upload-form" onSubmit={submit}>
    <div className="form-title"><div><span className="strip-kicker">RESOURCE DETAILS</span><h2>Share something <em>good.</em></h2></div><span className="step-mark">01 <i>—</i> 02</span></div>
    <div className="form-two"><label>Faculty<select value={values.facultySlug} onChange={(event) => { set("facultySlug", event.target.value); set("departmentSlug", ""); }} required>{facultyOptions.map((faculty) => <option key={faculty.slug} value={faculty.slug}>{faculty.name}</option>)}</select></label><label>Department<select value={values.departmentSlug} onChange={(event) => set("departmentSlug", event.target.value)} required disabled={!departments.length}><option value="">Choose department</option>{departments.map((department) => <option key={department.slug} value={department.slug}>{department.name}</option>)}</select></label></div>
    <label>Degree level<select value={values.degreeLevel} onChange={(event) => set("degreeLevel", event.target.value as ResourceMetadata["degreeLevel"])}><option>Undergraduate</option><option>Graduate</option><option>Doctoral</option><option>Other</option></select></label>
    <label>Degree or programme<input list="degree-options" value={values.degreeName} onChange={(event) => set("degreeName", event.target.value)} placeholder="Choose or enter your programme" required /><datalist id="degree-options">{degrees.map((degree) => <option key={degree.id} value={degree.name} />)}</datalist><small className="field-hint">Start typing to match programmes students have added.</small></label>
    <div className="form-two"><label>Course code<input list="course-options" value={values.courseCode} onChange={(event) => set("courseCode", event.target.value)} placeholder="e.g. CS-220" required /><datalist id="course-options">{courseOptions.map((course) => <option key={course.code} value={course.code}>{course.name}</option>)}</datalist></label><label>Semester<select value={values.semester} onChange={(event) => set("semester", Number(event.target.value))}>{Array.from({ length: 16 }, (_, index) => <option key={index + 1} value={index + 1}>Semester {index + 1}</option>)}</select></label></div>
    <label>Course or subject<input value={values.courseName} onChange={(event) => set("courseName", event.target.value)} placeholder="e.g. Data Structures" required /></label>
    <div className="form-two"><label>Resource type<select value={values.kind} onChange={(event) => set("kind", event.target.value as ResourceMetadata["kind"])}><option value="notes">Lecture notes</option><option value="past_paper">Past paper</option><option value="assignment">Assignment</option><option value="study_guide">Study guide</option><option value="other">Other course material</option></select></label><label>Resource title<input value={values.title} onChange={(event) => set("title", event.target.value)} placeholder="Give it a helpful name" required /></label></div>
    <label>Anything else students should know? <span className="optional">OPTIONAL</span><textarea value={values.description} onChange={(event) => set("description", event.target.value)} rows={3} maxLength={1200} placeholder="Topics covered, exam year, or a quick note…" /></label>
    <div className="file-drop" onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); chooseFile(event.dataTransfer.files[0]); }} onClick={() => fileRef.current?.click()} role="button" tabIndex={0} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") fileRef.current?.click(); }}><input ref={fileRef} type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png,.webp" onChange={(event) => chooseFile(event.target.files?.[0])} onClick={(event) => event.stopPropagation()} /><span className="file-drop-icon"><UploadCloud size={23} /></span><strong>{file ? file.name : <>Drop a file here, or <u>browse</u></>}</strong><small>PDF, Word, PowerPoint or image · up to 20 MB</small>{file && <span className="file-name">{(file.size / 1024 / 1024).toFixed(1)} MB · check the suggested details above</span>}</div>
    {file && <div className="detect-preview"><span className="detect-check"><Check size={14} /></span><span className="detect-copy"><strong>Filename hints added</strong><small>Possible course details were suggested from the filename. Check each field before sending.</small></span></div>}
    {busy && <div className="upload-progress"><span style={{ width: `${progress}%` }} /></div>}
    {error && <div className="auth-error" role="alert">{error}</div>}{success && <div className="upload-success" role="status"><Check size={16} /> Resource sent to the review queue. It will appear in the library after a moderator approves it.</div>}
    <button className="button-green upload-submit" type="submit" disabled={busy}>{busy ? <><LoaderCircle size={15} className="spin" /> Uploading {Math.round(progress)}%</> : <>Send for review <ArrowRight size={15} /></>}</button>
    <p className="form-note">Files use private Vercel Blob storage. Approved materials are available to signed-in students.</p>
  </form>;
}
