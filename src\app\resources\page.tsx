import type { Metadata } from "next";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
import { ResourceCard } from "@/components/resource-card";
import { faculties } from "@/lib/catalog";
import { findApprovedResources } from "@/lib/resources";

export const metadata: Metadata = { title: "Study resources" };
export const dynamic = "force-dynamic";

export default async function ResourcesPage({ searchParams }: { searchParams: Promise<{ q?: string; faculty?: string; kind?: string }> }) {
  const params = await searchParams;
  const query = params.q?.slice(0, 120) ?? "";
  const faculty = faculties.find((item) => item.slug === params.faculty);
  const resources = await findApprovedResources(query, faculty?.slug);
  const kinds = ["notes", "past_paper", "assignment", "study_guide", "other"];

  return <>
    <section className="faculty-page-intro"><div className="eyebrow"><span className="eyebrow-line" /> THE SHARED LIBRARY</div><h1>Find the thing<br />that makes it <em>click.</em></h1><p>Search student-contributed notes, past papers and course guides. Every resource is reviewed before it joins the library.</p></section>
    <section className="section-block library-section">
      <form className="library-search" action="/resources" method="get"><label className="sr-only" htmlFor="resource-search">Search resources</label><input id="resource-search" name="q" type="search" defaultValue={query} placeholder="Course code, title or subject…" /><button className="button-green" type="submit"><Search size={15} /> Search</button></form>
      <div className="resource-filters"><SlidersHorizontal size={15} /><Link className={!faculty ? "filter-chip active" : "filter-chip"} href={`/resources${query ? `?q=${encodeURIComponent(query)}` : ""}`}>All faculties</Link>{faculties.map((item) => <Link key={item.slug} className={faculty?.slug === item.slug ? "filter-chip active" : "filter-chip"} href={`/resources?${new URLSearchParams({ ...(query ? { q: query } : {}), faculty: item.slug })}`}>{item.short}</Link>)}</div>
      <div className="resource-result-label">{resources.length} {resources.length === 1 ? "resource" : "resources"}{query && <> matching “{query}”</>}{faculty && <> in {faculty.short}</>}</div>
      <div className="resource-grid">{resources.length ? resources.map((resource) => <ResourceCard key={resource.id} resource={resource} />) : <div className="empty-state"><span>✳</span><h3>{query || faculty ? "No matches yet." : "The first notes are waiting."}</h3><p>{query || faculty ? "Try a shorter search or a different faculty. If you've got the right material, share it so the next student can find it." : "There aren't any reviewed resources in this library yet. Sign in and share a resource to get things started."}</p><Link className="button-green" href="/upload">Share a resource <span>↗</span></Link></div>}</div>
      <div className="kind-note">Browse by type: {kinds.map((kind, index) => <span key={kind}>{index > 0 && " · "}{kind.replace("_", " ")}</span>)}</div>
    </section>
  </>;
}
