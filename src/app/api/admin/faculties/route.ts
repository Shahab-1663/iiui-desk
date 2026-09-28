import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { getDatabase } from "@/db";
import { departments, faculties } from "@/db/schema";
import { hasTrustedOrigin, isAdminRequest } from "@/lib/admin";
import { getFacultyDirectory } from "@/lib/catalog-db";

const createFaculty = z.object({
  type: z.literal("faculty"),
  name: z.string().trim().min(3).max(180),
  description: z.string().trim().min(10).max(700),
  departments: z.array(z.string().trim().min(2).max(180)).max(40).default([]),
});
const createDepartment = z.object({
  type: z.literal("department"),
  facultySlug: z.string().trim().min(2).max(80),
  name: z.string().trim().min(2).max(180),
});
const input = z.discriminatedUnion("type", [createFaculty, createDepartment]);

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 80);
}

export async function POST(request: Request) {
  if (!(await isAdminRequest(request))) return Response.json({ error: "Administrator access is required." }, { status: 403 });
  if (!hasTrustedOrigin(request)) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  try {
    const body = input.parse(await request.json());
    const db = getDatabase();
    await getFacultyDirectory();
    if (body.type === "faculty") {
      const slug = slugify(body.name);
      if (!slug) return Response.json({ error: "Use a faculty name with letters or numbers." }, { status: 400 });
      const [{ count }] = await db.select({ count: sql<number>`count(*)::int` }).from(faculties);
      const [created] = await db.insert(faculties).values({
        slug, name: body.name, description: body.description, imagePath: "/images/academic-atlas.svg", sortOrder: count,
      }).onConflictDoNothing().returning({ id: faculties.id });
      if (!created) return Response.json({ error: "A faculty with that name already exists." }, { status: 409 });
      const names = [...new Set(body.departments.map((name) => name.trim()).filter(Boolean))];
      if (names.length) await db.insert(departments).values(names.map((name, sortOrder) => ({ facultyId: created.id, slug: slugify(name), name, sortOrder }))).onConflictDoNothing();
      return Response.json({ ok: true, slug, name: body.name }, { status: 201 });
    }

    const [faculty] = await db.select({ id: faculties.id }).from(faculties).where(eq(faculties.slug, body.facultySlug)).limit(1);
    if (!faculty) return Response.json({ error: "Choose an existing faculty." }, { status: 404 });
    const [created] = await db.insert(departments).values({ facultyId: faculty.id, slug: slugify(body.name), name: body.name, sortOrder: 999 })
      .onConflictDoNothing().returning({ id: departments.id });
    if (!created) return Response.json({ error: "That department already exists in this faculty." }, { status: 409 });
    return Response.json({ ok: true, name: body.name }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message ?? "Check the faculty details." }, { status: 400 });
    return Response.json({ error: "The catalog entry could not be saved." }, { status: 500 });
  }
}
