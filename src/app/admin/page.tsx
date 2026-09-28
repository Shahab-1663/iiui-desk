import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { asc, eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { courses, degrees, faculties, resources, users } from "@/db/schema";
import { ModerationList, type PendingResource } from "@/components/moderation-list";
import { getAuth } from "@/lib/auth";

export const metadata: Metadata = { title: "Resource review" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) return <section className="page-hero"><div className="eyebrow"><span className="eyebrow-line" /> MODERATION DESK</div><h1>Resource <em>review.</em></h1><p>Connect Neon and set an admin email in the environment to open the review queue.</p></section>;
  const session = await getAuth().api.getSession({ headers: await headers() });
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!session) return <section className="page-hero"><div className="eyebrow"><span className="eyebrow-line" /> MODERATION DESK</div><h1>Sign in to<br /><em>review resources.</em></h1><p><Link className="official-link" href="/auth/sign-in">Sign in to continue ↗</Link></p></section>;
  if (!admins.includes(session.user.email.toLowerCase())) return <section className="page-hero"><div className="eyebrow"><span className="eyebrow-line" /> MODERATION DESK</div><h1>This desk is<br /><em>for moderators.</em></h1><p>Your account does not have resource review access.</p></section>;

  const rows = await getDatabase().select({
    id: resources.id,
    title: resources.title,
    filename: resources.originalFilename,
    kind: resources.kind,
    description: resources.description,
    createdAt: resources.createdAt,
    courseCode: courses.code,
    courseName: courses.name,
    degreeName: degrees.name,
    facultyName: faculties.name,
    semester: courses.semester,
    uploaderEmail: users.email,
  }).from(resources).innerJoin(courses, eq(resources.courseId, courses.id)).innerJoin(degrees, eq(courses.degreeId, degrees.id)).innerJoin(faculties, eq(degrees.facultyId, faculties.id)).innerJoin(users, eq(resources.uploadedBy, users.id)).where(eq(resources.status, "pending")).orderBy(asc(resources.createdAt));

  const pending: PendingResource[] = rows.map((row) => ({ ...row, createdAt: row.createdAt.toLocaleDateString("en-PK", { dateStyle: "medium" }) }));
  return <><section className="faculty-page-intro admin-intro"><div className="eyebrow"><span className="eyebrow-line" /> MODERATION DESK</div><h1>Keep the library<br /><em>helpful & trustworthy.</em></h1><p>Review files and course details before they become available to signed-in students.</p></section><section className="section-block review-section"><div className="section-heading"><div><div className="eyebrow"><span className="eyebrow-line" /> WAITING FOR REVIEW</div><h2>{pending.length} {pending.length === 1 ? "resource" : "resources"}</h2></div></div><ModerationList initial={pending} /></section></>;
}

