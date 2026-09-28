import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { getDatabase } from "@/db";
import { courses, degrees, departments, faculties, resources } from "@/db/schema";

export type ResourceItem = {
  id: string;
  title: string;
  description: string;
  kind: string;
  filename: string;
  blobUrl: string;
  contentType: string;
  byteSize: number;
  createdAt: Date;
  courseCode: string;
  courseName: string;
  semester: number;
  degreeName: string;
  facultyName: string;
  facultySlug: string;
  departmentName: string | null;
};

export async function findApprovedResources(query = "", facultySlug?: string, limit = 30, departmentSlug?: string): Promise<ResourceItem[]> {
  if (!process.env.DATABASE_URL) return [];
  const db = getDatabase();
  const conditions = [eq(resources.status, "approved")];
  const search = query.trim();
  if (search) {
    const pattern = `%${search}%`;
    conditions.push(or(
      ilike(resources.title, pattern),
      ilike(resources.description, pattern),
      ilike(courses.code, pattern),
      ilike(courses.name, pattern),
      ilike(degrees.name, pattern),
      ilike(faculties.name, pattern),
    )!);
  }
  if (facultySlug) conditions.push(eq(faculties.slug, facultySlug));
  if (departmentSlug) conditions.push(eq(departments.slug, departmentSlug));

  return db.select({
    id: resources.id,
    title: resources.title,
    description: resources.description,
    kind: resources.kind,
    filename: resources.originalFilename,
    blobUrl: resources.blobUrl,
    contentType: resources.contentType,
    byteSize: resources.byteSize,
    createdAt: resources.createdAt,
    courseCode: courses.code,
    courseName: courses.name,
    semester: courses.semester,
    degreeName: degrees.name,
    facultyName: faculties.name,
    facultySlug: faculties.slug,
    departmentName: departments.name,
  })
    .from(resources)
    .innerJoin(courses, eq(resources.courseId, courses.id))
    .innerJoin(degrees, eq(courses.degreeId, degrees.id))
    .innerJoin(faculties, eq(degrees.facultyId, faculties.id))
    .leftJoin(departments, eq(resources.departmentId, departments.id))
    .where(and(...conditions))
    .orderBy(desc(resources.createdAt))
    .limit(limit);
}

export async function getApprovedResourceCount() {
  if (!process.env.DATABASE_URL) return 0;
  const [row] = await getDatabase().select({ count: sql<number>`count(*)::int` })
    .from(resources).where(eq(resources.status, "approved"));
  return row?.count ?? 0;
}
