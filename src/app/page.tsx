import Link from "next/link";
import { ArrowRight, ArrowUpRight, BookOpen, Calculator, FileUp, Orbit, Search, ShieldCheck, Sparkles } from "lucide-react";
import type { CSSProperties } from "react";
import { getFacultyDirectory } from "@/lib/catalog-db";
import { findApprovedResources, getApprovedResourceCount } from "@/lib/resources";
import { ResourceCard } from "@/components/resource-card";
import { SearchHotkey } from "@/components/search-hotkey";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [count, latest, faculties] = await Promise.all([getApprovedResourceCount(), findApprovedResources("", undefined, 3), getFacultyDirectory()]);
  return <>
    <SearchHotkey targetId="desk-search" />
    <section className="launch-hero">
      <div className="launch-grid" aria-hidden="true" />
      <div className="hero-orbit orbit-a" aria-hidden="true" /><div className="hero-orbit orbit-b" aria-hidden="true" />
      <div className="launch-main"><div className="eyebrow"><span className="pulse-dot" /> THE STUDENT-POWERED CAMPUS INDEX</div><h1>Your next<br />semester, <em>sorted.</em></h1><p className="launch-lede">Past papers, course notes and the little tools that make university life easier — mapped to your IIUI degree and shared by people who’ve been there.</p>
        <form className="launch-search" action="/resources" method="get"><Search size={19} /><input id="desk-search" name="q" aria-label="Search courses or resources" placeholder="Search a course code, topic, or resource…" /><kbd><span>⌘</span> K</kbd><button aria-label="Search"><ArrowRight size={17} /></button></form>
        <div className="launch-actions"><Link className="action-primary" href="/faculties">Explore the faculty atlas <ArrowUpRight size={15} /></Link><Link className="action-quiet" href="/upload"><FileUp size={15} /> Share what helped you</Link></div>
      </div>
      <div className="hero-console" aria-label="University at a glance">
        <div className="console-head"><span><span className="console-led" /> DESK / ISB</span><span>H-10 · PAKISTAN</span></div>
        <div className="console-art"><div className="radar-ring ring-1"/><div className="radar-ring ring-2"/><div className="radar-ring ring-3"/><Orbit className="console-orbit-icon" size={82} strokeWidth={0.8}/><span className="coord coord-nw">33°41' N</span><span className="coord coord-se">73°03' E</span><span className="console-star">✳</span><span className="console-seal">IIU<br/><small>STUDENT<br/>DESK</small></span></div>
        <div className="console-stats"><div><strong>{String(faculties.length).padStart(2,"0")}</strong><span>FACULTIES</span></div><div><strong>{String(count).padStart(2, "0")}</strong><span>REVIEWED FILES</span></div><div><strong>01</strong><span>COMMUNITY</span></div></div>
        <div className="console-foot"><span>KNOWLEDGE IS A SHARED JOURNEY</span><span className="console-live">● LIVE INDEX</span></div>
      </div>
      <div className="hero-scroll">SCROLL TO EXPLORE <span /></div>
    </section>

    <section className="welcome-rail"><span className="rail-mark">IIUI <i>✳</i> STUDENT DESK</span><p>Built around <strong>your courses</strong>, made better by <strong>your community.</strong></p><Link href="/about">OUR APPROACH <ArrowUpRight size={12} /></Link></section>

    <section className="atlas-teaser section-pad"><div className="section-heading"><div><span className="section-kicker">01 / YOUR STARTING POINT</span><h2>Pick a faculty.<br />Find your <em>people.</em></h2><p>IIUI’s official academic faculties, reimagined as a map into your study materials.</p></div><Link className="text-link" href="/faculties">Open full atlas <ArrowUpRight size={14}/></Link></div><div className="faculty-grid home-faculty-grid">{faculties.slice(0, 6).map((faculty, index) => <Link href={`/faculties/${faculty.slug}`} className="faculty-card" key={faculty.slug} style={{ "--card-index": index } as CSSProperties}><span className="faculty-card-top"><span>{faculty.code}</span><ArrowUpRight size={17}/></span><span className="faculty-glyph" aria-hidden="true">{faculty.glyph}</span><span className="faculty-card-copy"><span className="faculty-card-field">{faculty.field}</span><strong>{faculty.short}</strong><span className="faculty-count">{String(faculty.departments.length).padStart(2,"0")} STUDY AREAS <ArrowUpRight size={12}/></span></span><span className="faculty-index">{faculty.number}</span></Link>)}</div></section>

    <section className="tool-banner"><div className="tool-stamp"><Calculator size={24}/><span>STUDENT<br/>TOOLS</span></div><div><span className="section-kicker">02 / MAKE A PLAN</span><h2>Study life has a<br /><em>control room.</em></h2><p>Calculate a target CGPA, keep a focus sprint, and build a rhythm that works for you.</p></div><div className="tool-links"><Link href="/tools"><span><Calculator size={18}/><strong>CGPA planner</strong><small>Try semester scenarios</small></span><ArrowUpRight size={15}/></Link><Link href="/tools#focus"><span><Sparkles size={18}/><strong>Focus timer</strong><small>Start a study sprint</small></span><ArrowUpRight size={15}/></Link></div><div className="tool-lines" aria-hidden="true">✳</div></section>

    <section className="library-preview section-pad"><div className="section-heading"><div><span className="section-kicker">03 / THE COMMUNITY LIBRARY</span><h2>What helped<br />someone <em>click.</em></h2><p>Student-contributed resources, reviewed before they join the shared library.</p></div><Link className="text-link" href="/resources">Browse library <ArrowUpRight size={14}/></Link></div><div className="resource-grid">{latest.length ? latest.map((resource) => <ResourceCard key={resource.id} resource={resource}/>) : <div className="library-empty"><span className="empty-icon"><BookOpen size={24}/></span><div><h3>A useful library starts with one good share.</h3><p>Share your first notes, past paper or study guide. A moderator reviews the resource details before other students find it.</p><Link href="/upload" className="action-primary">Share a resource <ArrowRight size={14}/></Link></div><span className="empty-shield"><ShieldCheck size={28}/><small>REVIEWED<br/>BY PEOPLE</small></span></div>}</div></section>

    <section className="end-note"><span className="section-kicker">THE IDEA IS SIMPLE</span><p>One university.<br /><em>Better connected.</em></p><Link href="/faculties">Find your path <ArrowRight size={15}/></Link><div className="end-pattern">۞</div></section>
  </>;
}
