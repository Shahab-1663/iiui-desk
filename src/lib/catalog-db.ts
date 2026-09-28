import { asc, eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { courses, degrees, faculties } from "@/db/schema";

export type CatalogCourse = { code: string; name: string; semester: number };
export type CatalogDegree = { id: string; name: string; level: string; slug: string; courses: CatalogCourse[] };

export async function getFacultyDegrees(facultySlug: string): Promise<CatalogDegree[]> {
  if (!process.env.DATABASE_URL) return [];
  const rows = await getDatabase().select({
    degreeId: degrees.id,
    degreeName: degrees.name,
    degreeLevel: degrees.level,
    degreeSlug: degrees.slug,
    courseCode: courses.code,
    courseName: courses.name,
    semester: courses.semester,
  }).from(degrees)
    .innerJoin(faculties, eq(degrees.facultyId, faculties.id))
    .leftJoin(courses, eq(courses.degreeId, degrees.id))
    .where(eq(faculties.slug, facultySlug))
    .orderBy(asc(degrees.name), asc(courses.semester), asc(courses.code));

  const grouped = new Map<string, CatalogDegree>();
  for (const row of rows) {
    let degree = grouped.get(row.degreeId);
    if (!degree) {
      degree = { id: row.degreeId, name: row.degreeName, level: row.degreeLevel, slug: row.degreeSlug, courses: [] };
      grouped.set(row.degreeId, degree);
    }
    if (row.courseCode && row.courseName && row.semester) degree.courses.push({ code: row.courseCode, name: row.courseName, semester: row.semester });
  }
  return [...grouped.values()];
}
