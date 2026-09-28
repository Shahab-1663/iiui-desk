import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { Faculty } from "@/lib/catalog";

export function FacultyCard({ faculty, index }: { faculty: Faculty; index: number }) {
  return (
    <Link href={`/faculties/${faculty.slug}`} className="faculty-card group">
      <Image src={faculty.image} alt="" fill sizes="(max-width: 700px) 50vw, (max-width: 1080px) 33vw, 25vw" className="faculty-image" />
      <span className="faculty-scrim" />
      <span className="card-index">{String(index + 1).padStart(2, "0")} / IIUI FACULTY</span>
      <span className="card-arrow"><ArrowUpRight size={17} /></span>
      <span className="card-info"><strong>{faculty.name}</strong><small>{faculty.description}</small></span>
    </Link>
  );
}

