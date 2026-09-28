import type { Metadata } from "next";
import { FacultyDirectory } from "@/components/faculty-directory";
import { academicInstitutes } from "@/lib/catalog";
import { getFacultyDirectory } from "@/lib/catalog-db";

export const metadata: Metadata = { title: "Faculty atlas" };
export const dynamic = "force-dynamic";
export default async function FacultiesPage() {
  const faculties = await getFacultyDirectory();
  return <><section className="page-intro atlas-intro"><span className="eyebrow">ACADEMIC ATLAS / 2026</span><h1>{String(faculties.length).padStart(2,"0")} paths.<br /><em>One university.</em></h1><p>Explore IIUI’s faculties, browse their departments and follow a path into the shared student library.</p><div className="intro-aside">CURRENT ACADEMIC DIRECTORY <span>VERIFIED AGAINST IIUI.EDU.PK</span></div></section><FacultyDirectory faculties={faculties} institutes={academicInstitutes} /></>;
}
