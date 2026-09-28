import Link from "next/link";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { CSSProperties } from "react";
import type { Faculty } from "@/lib/catalog";

export function FacultyCard({ faculty, index = Number(faculty.number) - 1 }: { faculty: Faculty; index?: number }) {
  return <Link href={`/faculties/${faculty.slug}`} className="faculty-card" style={{ "--card-index": index } as CSSProperties}>
    <span className="faculty-card-top"><span>{faculty.code}</span><ArrowUpRight size={17} /></span>
    <span className="faculty-glyph" aria-hidden="true">{faculty.glyph}</span>
    <span className="faculty-card-copy"><span className="faculty-card-field">{faculty.field}</span><strong>{faculty.short}</strong><span className="faculty-count">{String(faculty.departments.length).padStart(2, "0")} STUDY AREAS <ArrowDownRight size={12} /></span></span>
    <span className="faculty-index">{faculty.number}</span>
  </Link>;
}
