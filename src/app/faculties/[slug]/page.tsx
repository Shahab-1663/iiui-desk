import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowUpRight, ExternalLink, LibraryBig } from "lucide-react";
import { ResourceCard } from "@/components/resource-card";
import { getFacultyDirectoryEntry, getFacultyDegrees } from "@/lib/catalog-db";
import { findApprovedResources } from "@/lib/resources";

export const dynamic = "force-dynamic";
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params; const faculty = await getFacultyDirectoryEntry(slug);
  return { title: faculty?.name ?? "Faculty" };
}

export default async function FacultyPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<{ department?: string }> }) {
  const { slug } = await params;
  const { department: departmentSlug } = await searchParams;
  const faculty = await getFacultyDirectoryEntry(slug);
  if (!faculty) notFound();
  const selectedDepartment = faculty.departments.find((department) => department.slug === departmentSlug);
  const [degrees, resources] = await Promise.all([getFacultyDegrees(slug), findApprovedResources("", slug, 30, selectedDepartment?.slug)]);

  return <>
    <section className="page-hero faculty-detail-hero"><div className="eyebrow">ACADEMIC ATLAS / FACULTY {faculty.number}</div><h1>{faculty.name}<br /><em>Find your study circle.</em></h1><p>{faculty.description}</p><a className="official-link" href={faculty.official} target="_blank" rel="noreferrer">Official faculty information <ExternalLink size={12} /></a></section>
    <section className="section-block catalogue-section"><div className="section-heading"><div><div className="section-kicker">THE ACADEMIC MAP</div><h2>Departments &<br /><em>study areas.</em></h2><p>Department names are taken from IIUI’s official faculty pages. Browse current programmes on the faculty website.</p></div><a className="button-green" href={faculty.official} target="_blank" rel="noreferrer">Official programs <ExternalLink size={14} /></a></div>
      <div className="department-index">{faculty.departments.map((department, index) => <Link className={selectedDepartment?.slug === department.slug ? "department-card selected" : "department-card"} href={`/faculties/${faculty.slug}?department=${encodeURIComponent(department.slug)}#department-resources`} key={department.slug}><span>{String(index + 1).padStart(2,"0")}</span><strong>{department.name}</strong><span>{faculty.code} / ACADEMIC UNIT <ArrowUpRight size={12}/></span></Link>)}</div>
    </section>
    <section className="section-block catalogue-section"><div className="section-heading"><div><div className="section-kicker">THE COMMUNITY CATALOGUE</div><h2>Follow the <em>coursework.</em></h2><p>Programme and course details grow from student contributions. Find materials attached to verified course records.</p></div><Link className="button-green" href={`/upload?faculty=${faculty.slug}`}><LibraryBig size={14} /> Share a resource</Link></div>
      {degrees.length ? <div className="degree-list">{degrees.map((degree) => <article className="degree-card" key={degree.id}><div className="degree-head"><span className="degree-level">{degree.level}</span><h3>{degree.name}</h3></div><div className="course-list">{degree.courses.length ? degree.courses.map((course) => <Link key={course.code} href={`/resources?q=${encodeURIComponent(course.code)}&faculty=${faculty.slug}`}><span>{course.code}</span><strong>{course.name}</strong><small>Semester {course.semester}</small><ArrowUpRight size={13} /></Link>) : <p>Course list grows when students share their materials.</p>}</div></article>)}</div> : <div className="empty-state"><span>✳</span><h3>Help build this catalogue.</h3><p>When you share a course resource, its degree and course details become part of this faculty's library.</p><Link className="button-green" href={`/upload?faculty=${faculty.slug}`}>Add the first course resource <ArrowUpRight size={14} /></Link></div>}</section>
    <section className="section-block faculty-resources" id="department-resources"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> {selectedDepartment ? "DEPARTMENT LIBRARY" : "APPROVED RESOURCES"}</div><h2>{selectedDepartment ? <>Shared in <em>{selectedDepartment.name}.</em></> : <>Shared for this <em>faculty.</em></>}</h2><p>{selectedDepartment ? "Approved resources contributed for this department." : "Choose a department above to narrow the library to that study area."}</p></div><Link className="text-link" href={selectedDepartment ? `/faculties/${faculty.slug}#department-resources` : `/resources?faculty=${faculty.slug}`}>{selectedDepartment ? "Clear department" : "View all faculty resources"} <span>↗</span></Link></div><div className="resource-grid">{resources.length ? resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />) : <div className="empty-state"><span>✳</span><h3>{selectedDepartment ? `No reviewed materials in ${selectedDepartment.name} yet.` : "No reviewed materials here yet."}</h3><p>Share course notes or past papers for this department. A moderator reviews them before they appear.</p><Link className="button-green" href={`/upload?faculty=${faculty.slug}${selectedDepartment ? `&department=${selectedDepartment.slug}` : ""}`}>Share a department resource <ArrowUpRight size={14}/></Link></div>}</div></section>
  </>;
}
