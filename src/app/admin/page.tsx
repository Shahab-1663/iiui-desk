import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { asc, desc, eq, sql } from "drizzle-orm";
import { getDatabase } from "@/db";
import { contactMessages, courses, degrees, faculties, resources, users } from "@/db/schema";
import { ModerationList, type PendingResource } from "@/components/moderation-list";
import { getAuth } from "@/lib/auth";
import { AdminResourceManager, type ManagedResource } from "@/components/admin-resource-manager";
import { AdminCatalogManager } from "@/components/admin-catalog-manager";
import { getFacultyDirectory } from "@/lib/catalog-db";

export const metadata: Metadata = { title: "Resource review" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) return <section className="page-hero"><div className="eyebrow"><span className="eyebrow-line" /> MODERATION DESK</div><h1>Resource <em>review.</em></h1><p>Connect PostgreSQL and set an admin email in the environment to open the review queue.</p></section>;
  const session = await getAuth().api.getSession({ headers: await headers() });
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!session) return <section className="page-hero"><div className="eyebrow"><span className="eyebrow-line" /> MODERATION DESK</div><h1>Sign in to<br /><em>review resources.</em></h1><p><Link className="official-link" href="/auth/sign-in">Sign in to continue ↗</Link></p></section>;
  if (!admins.includes(session.user.email.toLowerCase())) return <section className="page-hero"><div className="eyebrow"><span className="eyebrow-line" /> MODERATION DESK</div><h1>This desk is<br /><em>for moderators.</em></h1><p>Your account does not have resource review access.</p></section>;

  const directory = await getFacultyDirectory();
  const [totalResources] = await getDatabase().select({ count: sql<number>`count(*)::int` }).from(resources);
  const [totalUsers] = await getDatabase().select({ count: sql<number>`count(*)::int` }).from(users);
  const [pendingTotal] = await getDatabase().select({ count: sql<number>`count(*)::int` }).from(resources).where(eq(resources.status, "pending"));
  const [approvedTotal] = await getDatabase().select({ count: sql<number>`count(*)::int` }).from(resources).where(eq(resources.status, "approved"));
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
  const allRows = await getDatabase().select({ id: resources.id, title: resources.title, kind: resources.kind, status: resources.status, createdAt: resources.createdAt, code: courses.code, name: courses.name, degree: degrees.name, faculty: faculties.name, semester: courses.semester }).from(resources).innerJoin(courses, eq(resources.courseId, courses.id)).innerJoin(degrees, eq(courses.degreeId, degrees.id)).innerJoin(faculties, eq(degrees.facultyId, faculties.id)).orderBy(desc(resources.createdAt)).limit(50);
  const managed: ManagedResource[] = allRows.map((row) => ({ ...row, createdAt: row.createdAt.toLocaleDateString("en-PK", { dateStyle: "medium" }) }));
  const [members, inbox] = await Promise.all([
    getDatabase().select({ name: users.name, email: users.email, createdAt: users.createdAt }).from(users).orderBy(desc(users.createdAt)).limit(20),
    getDatabase().select({ name: contactMessages.name, email: contactMessages.email, topic: contactMessages.topic, message: contactMessages.message, createdAt: contactMessages.createdAt }).from(contactMessages).orderBy(desc(contactMessages.createdAt)).limit(20),
  ]);
  return <><section className="page-intro admin-dashboard-intro"><span className="eyebrow">THE DESK / ADMIN CONSOLE</span><h1>Your community,<br/><em>in good hands.</em></h1><p>Review contributions, maintain the academic directory, and keep the shared library accurate.</p></section><section className="admin-dashboard section-block"><div className="admin-stat-grid"><article><span>ALL SHARED FILES</span><strong>{totalResources.count}</strong><small>Across every IIUI faculty</small></article><article><span>WAITING FOR REVIEW</span><strong>{pendingTotal.count}</strong><small>Student contributions</small></article><article><span>IN THE LIBRARY</span><strong>{approvedTotal.count}</strong><small>Approved and searchable</small></article><article><span>COMMUNITY MEMBERS</span><strong>{totalUsers.count}</strong><small>Registered accounts</small></article></div><div className="admin-section-heading"><div><span className="section-kicker">01 / COMMUNITY SAFETY</span><h2>Review <em>queue.</em></h2><p>Approve materials that are appropriate and accurately described. Reject poor or unrelated uploads.</p></div><span className="admin-count">{pending.length} OPEN</span></div><ModerationList initial={pending} /><AdminCatalogManager faculties={directory.map(({ slug, name, departments }) => ({ slug, name, departments }))}/><AdminResourceManager initial={managed}/><div className="admin-people-grid"><section className="admin-data-panel"><div className="admin-section-heading"><div><span className="section-kicker">03 / COMMUNITY</span><h2>Recent <em>members.</em></h2></div><span className="admin-count">{members.length} SHOWN</span></div>{members.map((member) => <article className="member-row" key={member.email}><span className="member-initial">{member.name.slice(0,1).toUpperCase()}</span><span><strong>{member.name}</strong><small>{member.email}</small></span><time>{member.createdAt.toLocaleDateString("en-PK", { dateStyle: "medium" })}</time></article>)}</section><section className="admin-data-panel"><div className="admin-section-heading"><div><span className="section-kicker">04 / INCOMING NOTES</span><h2>Desk <em>inbox.</em></h2></div><span className="admin-count">{inbox.length} SHOWN</span></div>{inbox.length ? inbox.map((note, index) => <article className="inbox-note" key={`${note.email}-${note.createdAt.getTime()}-${index}`}><div><strong>{note.topic}</strong><time>{note.createdAt.toLocaleDateString("en-PK", { dateStyle: "medium" })}</time></div><p>{note.message}</p><a href={`mailto:${encodeURIComponent(note.email)}?subject=${encodeURIComponent(`Student Desk: ${note.topic}`)}`}>{note.name} · {note.email}</a></article>) : <p className="no-results">Your inbox is clear.</p>}</section></div></section></>;
}
