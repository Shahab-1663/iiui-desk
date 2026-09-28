import { asc, eq } from "drizzle-orm";
import { getDatabase } from "@/db";
import { courses, degrees, departments, faculties } from "@/db/schema";
import { faculties as seededFaculties } from "@/lib/catalog";

export type CatalogCourse = { code: string; name: string; semester: number };
export type CatalogDegree = { id: string; name: string; level: string; slug: string; courses: CatalogCourse[] };
export type CatalogDepartment = { id?: string; slug: string; name: string };
export type DirectoryFaculty = {
  id?: string; slug: string; name: string; short: string; code: string; number: string;
  official: string; description: string; field: string; glyph: string; departments: CatalogDepartment[];
};

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || "department";
}

function staticDirectory(): DirectoryFaculty[] {
  return seededFaculties.map((faculty) => ({
    ...faculty,
    departments: faculty.departments.map((name) => ({ name, slug: slugify(name) })),
  }));
}

/** Keep the official starter catalog in Postgres and merge admin-created records into it. */
export async function getFacultyDirectory(): Promise<DirectoryFaculty[]> {
  if (!process.env.DATABASE_URL) return staticDirectory();
  const db = getDatabase();
  await db.insert(faculties).values(seededFaculties.map((faculty, index) => ({
    slug: faculty.slug,
    name: faculty.name,
    description: faculty.description,
    imagePath: "/images/academic-atlas.svg",
    sortOrder: index,
  }))).onConflictDoNothing({ target: faculties.slug });
  const facultyRows = await db.select().from(faculties).orderBy(asc(faculties.sortOrder), asc(faculties.name));
  const starterBySlug = new Map<string, (typeof seededFaculties)[number]>(seededFaculties.map((faculty) => [faculty.slug, faculty]));
  const seedDepartments = facultyRows.flatMap((faculty) => (starterBySlug.get(faculty.slug)?.departments ?? []).map((name, index) => ({
    facultyId: faculty.id, slug: slugify(name), name, sortOrder: index,
  })));
  if (seedDepartments.length) await db.insert(departments).values(seedDepartments).onConflictDoNothing();
  const departmentRows = await db.select({ id: departments.id, facultyId: departments.facultyId, slug: departments.slug, name: departments.name })
    .from(departments).orderBy(asc(departments.sortOrder), asc(departments.name));
  return facultyRows.map((row, index) => {
    const starter = starterBySlug.get(row.slug);
    return {
      id: row.id,
      slug: row.slug,
      name: row.name,
      short: starter?.short ?? row.name,
      code: starter?.code ?? row.slug.split("-").map((part) => part[0]).join("").slice(0, 5).toUpperCase(),
      number: String(starter?.number ?? String(index + 1).padStart(2, "0")),
      official: starter?.official ?? "https://www.iiu.edu.pk/faculties/",
      description: row.description,
      field: starter?.field ?? "IIUI ACADEMIC COMMUNITY",
      glyph: starter?.glyph ?? "✳",
      departments: departmentRows.filter((department) => department.facultyId === row.id).map(({ id, slug, name }) => ({ id, slug, name })),
    };
  });
}

export async function getFacultyDirectoryEntry(slug: string) {
  return (await getFacultyDirectory()).find((faculty) => faculty.slug === slug);
}

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
