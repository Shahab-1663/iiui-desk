"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { DirectoryFaculty } from "@/lib/catalog-db";

type Props = { faculties: Pick<DirectoryFaculty, "slug" | "name" | "departments">[] };

export function AdminCatalogManager({ faculties }: Props) {
  const router = useRouter();
  const [mode, setMode] = useState<"faculty" | "department">("faculty");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setBusy(true);
    setMessage("");
    setError("");
    const form = new FormData(formElement);
    const body = mode === "faculty"
      ? { type: "faculty", name: String(form.get("name") ?? ""), description: String(form.get("description") ?? ""), departments: String(form.get("departments") ?? "").split("\n").map((name) => name.trim()).filter(Boolean) }
      : { type: "department", facultySlug: String(form.get("facultySlug") ?? ""), name: String(form.get("name") ?? "") };
    try {
      const response = await fetch("/api/admin/faculties", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json() as { error?: string; name?: string };
      if (!response.ok) throw new Error(result.error ?? "The catalog entry could not be saved.");
      setMessage(`${result.name} added to the academic catalog.`);
      formElement.reset();
      router.refresh();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The catalog entry could not be saved.");
    } finally {
      setBusy(false);
    }
  }

  return <section className="admin-catalog-manager">
    <div className="admin-section-heading"><div><span className="section-kicker">02 / ACADEMIC DIRECTORY</span><h2>Shape the <em>catalog.</em></h2><p>Add faculties as IIUI grows, and keep each department under the right faculty.</p></div><span className="admin-count">{faculties.length} FACULTIES</span></div>
    <div className="catalog-manager-tabs" role="tablist" aria-label="Catalog entry type">
      <button type="button" role="tab" aria-selected={mode === "faculty"} onClick={() => { setMode("faculty"); setError(""); setMessage(""); }}>New faculty</button>
      <button type="button" role="tab" aria-selected={mode === "department"} onClick={() => { setMode("department"); setError(""); setMessage(""); }}>New department</button>
    </div>
    <form className="catalog-manager-form" onSubmit={submit}>
      {mode === "faculty" ? <>
        <label>Faculty name<input name="name" required minLength={3} maxLength={180} placeholder="e.g. Faculty of Data Sciences" /></label>
        <label>Short description<textarea name="description" required minLength={10} maxLength={700} rows={3} placeholder="What students can study in this faculty" /></label>
        <label>Starting departments <span className="field-hint">Optional · one department per line</span><textarea name="departments" maxLength={5000} rows={4} placeholder={"Computer Science\nData Science"} /></label>
      </> : <>
        <label>Faculty<select name="facultySlug" required defaultValue=""><option value="" disabled>Select a faculty</option>{faculties.map((faculty) => <option key={faculty.slug} value={faculty.slug}>{faculty.name}</option>)}</select></label>
        <label>Department name<input name="name" required minLength={2} maxLength={180} placeholder="e.g. Artificial Intelligence" /></label>
      </>}
      {error && <p className="form-error" role="alert">{error}</p>}{message && <p className="form-success" role="status">{message}</p>}
      <button className="button-green catalog-submit" disabled={busy}>{busy ? "Saving…" : mode === "faculty" ? "Add faculty to directory ↗" : "Add department ↗"}</button>
    </form>
    <div className="catalog-current-list"><span className="section-kicker">CURRENT DIRECTORY</span>{faculties.map((faculty) => <article key={faculty.slug}><strong>{faculty.name}</strong><small>{faculty.departments.length} departments · {faculty.departments.map((department) => department.name).join(", ") || "No departments yet"}</small></article>)}</div>
  </section>;
}
