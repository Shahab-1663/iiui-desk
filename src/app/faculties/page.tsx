import type { Metadata } from "next";
import { FacultyCard } from "@/components/faculty-card";
import { Reveal } from "@/components/reveal";
import { faculties } from "@/lib/catalog";

export const metadata: Metadata = { title: "Faculties" };
export default function FacultiesPage() {
  return <>
    <section className="page-hero"><div className="eyebrow"><span className="eyebrow-line" /> FIND YOUR FIELD</div><h1>A home for every<br /><em>discipline.</em></h1><p>Start with your faculty. Then explore degrees, semesters, courses and the resources your classmates have shared.</p><div className="page-hero-decoration">✳</div></section>
    <section className="section-block"><div className="faculty-grid">{faculties.map((faculty, index) => <Reveal key={faculty.slug} delay={(index % 3) * 0.06}><FacultyCard faculty={faculty} index={index} /></Reveal>)}</div><p className="catalogue-source">Faculty names follow the <a href="https://www.iiu.edu.pk/faculties/" target="_blank" rel="noreferrer">official IIUI faculty directory ↗</a>. Student Desk is an independent resource project.</p></section>
  </>;
}

