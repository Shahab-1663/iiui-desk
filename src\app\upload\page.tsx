import type { Metadata } from "next";
import { UploadForm } from "@/components/upload-form";
import { getFaculty } from "@/lib/catalog";

export const metadata: Metadata = { title: "Share a resource" };
export const dynamic = "force-dynamic";

export default async function UploadPage({ searchParams }: { searchParams: Promise<{ faculty?: string }> }) {
  const { faculty: facultySlug } = await searchParams;
  const faculty = facultySlug ? getFaculty(facultySlug) : undefined;
  return <>
    <section className="page-hero upload-hero"><div className="eyebrow"><span className="eyebrow-line" /> PASS THE KNOWLEDGE ON</div><h1>Your notes could<br />make someone's <em>day.</em></h1><p>Share a past paper, clear set of notes or assignment resource with fellow IIUI students.</p><div className="page-hero-decoration">✳</div></section>
    <section className="upload-layout"><aside className="upload-aside"><span className="strip-kicker">A FEW GOOD HABITS</span><h2>Make it useful<br />for the next <em>student.</em></h2><div className="tip-list"><div><span>01</span><p>Choose your programme and course so classmates can find it.</p></div><div><span>02</span><p>Share material you have permission to distribute.</p></div><div><span>03</span><p>Check the file name and details before you send it for review.</p></div></div><div className="privacy-note"><span>✳</span><p><strong>Shared with care.</strong><br />Files stay private until a moderator approves their resource details.</p></div></aside><UploadForm initialFaculty={faculty?.slug} /></section>
  </>;
}
