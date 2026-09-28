import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = { title: "Our story" };
export default function AboutPage() {
  return <>
    <section className="page-hero"><div className="eyebrow"><span className="eyebrow-line" /> OUR STORY</div><h1>Good learning<br />travels <em>together.</em></h1><p>A student-built study space for the International Islamic University Islamabad community.</p><div className="page-hero-decoration">✳</div></section>
    <section className="story-layout"><div className="story-image"><Image src="/images/about_backgroung.jpg" alt="Study life at an international Islamic university" fill sizes="(max-width: 700px) 100vw, 50vw" /><span>ONE CAMPUS · MANY JOURNEYS</span></div><div className="story-copy"><div className="eyebrow"><span className="eyebrow-line" /> WHY WE'RE HERE</div><h2>Make the next semester<br />a little <em>easier.</em></h2><p>Welcome to IIUI Student Desk, a shared resource space imagined for students of the International Islamic University Islamabad. Academic life moves quickly. Finding the right notes, a past paper or a clear explanation shouldn't add to the pressure.</p><p>We want students to find useful study material by faculty, degree and course, then pass along the resources that helped them. The idea is simple: when knowledge is easier to share, everyone gets a better chance to learn.</p><p className="story-note">An independent student project. Not an official IIUI service.</p></div></section>
    <section className="mission-panel"><div className="mission-title"><span className="strip-kicker">WHAT WE BELIEVE</span><h2>Learning is a shared <em>act.</em></h2></div><div className="mission-list"><article><span>01</span><div><h3>Find what fits</h3><p>Study material should make sense for your faculty, degree, semester and course.</p></div></article><article><span>02</span><div><h3>Give something back</h3><p>One student's clear notes can save another student hours of searching.</p></div></article><article><span>03</span><div><h3>Build it with care</h3><p>A trusted library grows through useful contributions and thoughtful review.</p></div></article></div></section>
    <section className="about-cta"><h2>Have a resource to share?</h2><p>Help another student find their footing.</p><Link className="button-green" href="/upload">Share a resource <span>↗</span></Link></section>
  </>;
}

