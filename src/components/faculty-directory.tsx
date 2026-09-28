"use client";

import { useMemo, useState } from "react";
import { Search, ArrowUpRight, Landmark } from "lucide-react";
import { FacultyCard } from "@/components/faculty-card";
import { SearchHotkey } from "@/components/search-hotkey";
import type { academicInstitutes, faculties } from "@/lib/catalog";

export function FacultyDirectory({ faculties: items, institutes }: { faculties: typeof faculties; institutes: typeof academicInstitutes }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return items.filter((faculty) => !term || `${faculty.name} ${faculty.departments.join(" ")} ${faculty.field}`.toLowerCase().includes(term));
  }, [items, query]);
  return <>
    <SearchHotkey targetId="faculty-search" />
    <section className="atlas-section">
      <div className="atlas-toolbar"><div><span className="section-kicker">THE FACULTY INDEX</span><h2>Find your corner<br />of the <em>atlas.</em></h2></div><label className="atlas-search"><Search size={17} /><input id="faculty-search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search a faculty or department" aria-label="Search faculties and departments" /><kbd>⌘ K</kbd></label></div>
      <div className="atlas-resultline"><span>{String(filtered.length).padStart(2, "0")} FACULTIES</span><span>OPEN A CARD TO EXPLORE DEPARTMENTS <ArrowUpRight size={12} /></span></div>
      <div className="faculty-grid">{filtered.map((faculty, index) => <FacultyCard key={faculty.slug} faculty={faculty} index={index} />)}</div>
      {filtered.length === 0 && <p className="no-results">No faculty or department matched. Try a broader search.</p>}
    </section>
    <section className="institutes-section"><div className="institute-heading"><span className="section-kicker">BEYOND THE FACULTIES</span><h2>Institutes, academies<br />& specialist <em>centres.</em></h2><p>More places across IIUI where research, professional learning and community work take shape.</p></div><div className="institute-list">{institutes.map((item, i) => <a key={item.name} href={item.url} target="_blank" rel="noreferrer"><span>{String(i + 1).padStart(2, "0")}</span><span className="unit-title"><strong>{item.name}</strong><small>{item.type}</small></span><ArrowUpRight size={15} /></a>)}</div><div className="source-note"><Landmark size={15} /> Directory names and listed units follow the <a href="https://www.iiu.edu.pk/faculties/" target="_blank" rel="noreferrer">official IIUI academic directory</a>. Follow each linked official page for current programme details.</div></section>
  </>;
}
