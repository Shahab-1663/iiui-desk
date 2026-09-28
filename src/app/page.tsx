import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, BookOpenCheck, FileUp, GraduationCap, Search, Share2, Sparkles } from "lucide-react";
import { FacultyCard } from "@/components/faculty-card";
import { Reveal } from "@/components/reveal";
import { faculties } from "@/lib/catalog";
import { findApprovedResources, getApprovedResourceCount } from "@/lib/resources";
import { ResourceCard } from "@/components/resource-card";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [count, latest] = await Promise.all([getApprovedResourceCount(), findApprovedResources("", undefined, 3)]);

  return (
    <>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-line" /> YOUR IIUI STUDY SPACE</div>
          <h1>Good notes make<br />great <em>beginnings.</em></h1>
          <p className="hero-lede">Find the notes, past papers and course materials your degree needs — gathered in one place by the people who know it best.</p>
          <form className="search-box" action="/resources" method="get">
            <Search className="search-icon" size={20} aria-hidden="true" />
            <label className="sr-only" htmlFor="home-search">Search courses and study resources</label>
            <input id="home-search" type="search" name="q" placeholder="Search a course, subject or resource…" autoComplete="off" />
            <button type="submit">Search <ArrowRight size={15} /></button>
          </form>
          <div className="hero-meta"><div className="avatar-stack" aria-hidden="true"><span>II</span><span>U</span><span>I</span><span>✳</span></div><span>Shared by IIUI students, for IIUI students</span></div>
        </div>
        <div className="hero-art" aria-label="IIUI emblem surrounded by geometric patterns">
          <div className="orbit orbit-one" /><div className="orbit orbit-two" />
          <div className="hero-seal"><span className="seal-top">SEEK KNOWLEDGE</span><Image src="/images/logo.png" alt="IIUI university seal" width={116} height={116} priority /><span className="seal-bottom">SHARE WISDOM</span></div>
          <div className="floating-note note-top"><span className="note-icon gold"><Sparkles size={15} /></span><span className="floating-note-copy"><strong>Learn together</strong><small>Every semester, every step</small></span></div>
          <div className="floating-note note-bottom"><span className="note-icon mint"><ArrowUpRight size={15} /></span><span className="floating-note-copy"><strong>Your next great find</strong><small>Could be one search away</small></span></div>
          <span className="sparkle sparkle-a">✳</span><span className="sparkle sparkle-b">✧</span>
        </div>
        <div className="hero-foot"><span>H-10, ISLAMABAD</span><span className="hero-foot-rule" /><span>KNOWLEDGE GROWS WHEN IT'S SHARED</span></div>
      </section>

      <section className="welcome-strip"><div><span className="strip-kicker">A NOTE FROM YOUR DESK</span><p>One university. Many paths. <strong>Find yours.</strong></p></div><div className="strip-stats"><div><strong>{faculties.length.toString().padStart(2, "0")}</strong><span>faculties to explore</span></div><i /><div><strong>{count}</strong><span>shared resources</span></div></div></section>

      <section className="section-block faculty-section" id="faculties">
        <Reveal><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> FIND YOUR FIELD</div><h2>A home for every <em>discipline.</em></h2><p>Explore your faculty, then find your programme, semester and courses.</p></div><Link className="text-link" href="/faculties">Browse all faculties <span>↗</span></Link></div></Reveal>
        <div className="faculty-grid">{faculties.map((faculty, index) => <Reveal key={faculty.slug} delay={(index % 3) * 0.07}><FacultyCard faculty={faculty} index={index} /></Reveal>)}</div>
      </section>

      <Reveal><section className="contribute-band"><div className="contribute-mark"><Share2 size={24} /></div><div className="contribute-copy"><span className="strip-kicker">GOOD KARMA, ACADEMIC EDITION</span><h2>Have something that helped <em>you?</em></h2><p>Pass it on. Your notes could be the thing that makes someone else's semester click.</p></div><Link href="/upload" className="button-light">Share a resource <span>↗</span></Link><div className="band-pattern" aria-hidden="true">✳ ✧ ✳ ✧ ✳</div></section></Reveal>

      <section className="section-block library-section"><Reveal><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> THE SHARED LIBRARY</div><h2>Little things that make<br />a big <em>difference.</em></h2><p>Community-contributed resources, reviewed and ready to help.</p></div><Link className="text-link" href="/resources">Open the library <span>↗</span></Link></div></Reveal>
        <div className="resource-grid">{latest.length ? latest.map((resource) => <ResourceCard key={resource.id} resource={resource} />) : <div className="empty-state"><span><BookOpenCheck size={25} /></span><h3>The library starts with us.</h3><p>There aren’t any reviewed resources here yet. Share a study guide, lecture notes or past paper to give the first student a head start.</p><Link href="/upload" className="button-green">Contribute the first resource <ArrowRight size={15} /></Link></div>}</div>
      </section>

      <section className="section-block values-section"><Reveal><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> THE STUDENT DESK PROMISE</div><h2>Study smarter, <em>together.</em></h2></div></div></Reveal><div className="value-grid"><Reveal delay={0.02}><article className="value-item"><span className="value-number">01</span><GraduationCap className="value-icon" size={20} /><h3>Find what fits</h3><p>Browse resources through your faculty, degree, semester and course.</p></article></Reveal><Reveal delay={0.09}><article className="value-item"><span className="value-number">02</span><Share2 className="value-icon" size={18} /><h3>Pass it forward</h3><p>A student's clear notes can save another student hours of searching.</p></article></Reveal><Reveal delay={0.16}><article className="value-item"><span className="value-number">03</span><FileUp className="value-icon" size={19} /><h3>Share with care</h3><p>Resources are reviewed before they join the shared library.</p></article></Reveal></div></section>
    </>
  );
}

