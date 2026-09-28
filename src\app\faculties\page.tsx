import type { Metadata } from "next";
import { FacultyDirectory } from "@/components/faculty-directory";
import { academicInstitutes, faculties } from "@/lib/catalog";

export const metadata: Metadata = { title: "Faculty atlas" };
export default function FacultiesPage() {
  return <><section className="page-intro atlas-intro"><span className="eyebrow">ACADEMIC ATLAS / 2026</span><h1>Eleven paths.<br /><em>One university.</em></h1><p>Explore IIUI’s faculties, browse their departments and follow a path into the shared student library.</p><div className="intro-aside">CURRENT ACADEMIC DIRECTORY <span>VERIFIED AGAINST IIUI.EDU.PK</span></div></section><FacultyDirectory faculties={faculties} institutes={academicInstitutes} /></>;
}
