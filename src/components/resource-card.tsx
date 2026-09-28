import Link from "next/link";
import { ArrowUpRight, BookOpen, FileText, NotebookTabs } from "lucide-react";
import type { ResourceItem } from "@/lib/resources";

const kinds = {
  notes: { label: "Lecture notes", Icon: NotebookTabs },
  past_paper: { label: "Past paper", Icon: FileText },
  assignment: { label: "Assignment", Icon: FileText },
  study_guide: { label: "Study guide", Icon: BookOpen },
  other: { label: "Course material", Icon: BookOpen },
} as const;

function sizeLabel(bytes: number) {
  return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

export function ResourceCard({ resource }: { resource: ResourceItem }) {
  const kind = kinds[resource.kind as keyof typeof kinds] ?? kinds.other;
  const Icon = kind.Icon;
  return (
    <article className="resource-card">
      <div className="resource-card-top"><span className="file-badge"><Icon size={17} /></span><span className="resource-kind">{kind.label}</span></div>
      <h3>{resource.title}</h3>
      <p>{resource.courseCode} · {resource.courseName}<br />{resource.degreeName} · Semester {resource.semester}</p>
      <div className="resource-card-foot"><span>{resource.facultyName} · {sizeLabel(resource.byteSize)}</span><Link href={`/api/resources/${resource.id}/file`} target="_blank" aria-label={`Open ${resource.title}`}>Open <ArrowUpRight size={13} /></Link></div>
    </article>
  );
}

