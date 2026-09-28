import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getAuth } from "@/lib/auth";
import { getDatabase } from "@/db";
import { courses, degrees, faculties, resources } from "@/db/schema";
import { getFaculty } from "@/lib/catalog";
import { resourceMetadataSchema } from "@/lib/validators";

export const runtime = "nodejs";
export const maxDuration = 30;

const allowedContentTypes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "image/webp",
];

function slugify(value: string) {
  return value.toLowerCase().normalize("NFKD").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 90) || "course";
}

async function saveResource(metadata: unknown, uploaderId: string, blob: { pathname: string; url: string; contentType?: string | null; size?: number }) {
  const parsed = resourceMetadataSchema.parse(metadata);
  const faculty = getFaculty(parsed.facultySlug);
  if (!faculty) throw new Error("That faculty is no longer available.");
  const contentType = blob.contentType ?? "application/octet-stream";
  if (!allowedContentTypes.includes(contentType)) throw new Error("This file type is not supported.");
  if (blob.size !== undefined && blob.size > 20 * 1024 * 1024) throw new Error("Files must be 20 MB or smaller.");

  const db = getDatabase();
  const [facultyRow] = await db.insert(faculties).values({
    slug: faculty.slug,
    name: faculty.name,
    description: faculty.description,
    imagePath: "/images/academic-atlas.svg",
    sortOrder: 0,
  }).onConflictDoUpdate({ target: faculties.slug, set: { name: faculty.name, description: faculty.description, imagePath: "/images/academic-atlas.svg" } }).returning({ id: faculties.id });

  const degreeSlug = slugify(parsed.degreeName);
  const [degreeRow] = await db.insert(degrees).values({ facultyId: facultyRow.id, slug: degreeSlug, code: null, name: parsed.degreeName, level: parsed.degreeLevel })
    .onConflictDoUpdate({ target: [degrees.facultyId, degrees.slug], set: { name: parsed.degreeName, level: parsed.degreeLevel, updatedAt: new Date() } })
    .returning({ id: degrees.id });

  const [courseRow] = await db.insert(courses).values({ degreeId: degreeRow.id, code: parsed.courseCode.toUpperCase(), name: parsed.courseName, semester: parsed.semester })
    .onConflictDoUpdate({ target: [courses.degreeId, courses.code], set: { name: parsed.courseName, semester: parsed.semester, updatedAt: new Date() } })
    .returning({ id: courses.id });

  await db.insert(resources).values({
    courseId: courseRow.id,
    uploadedBy: uploaderId,
    kind: parsed.kind,
    title: parsed.title,
    description: parsed.description,
    originalFilename: blob.pathname.split("/").at(-1) ?? "study-resource",
    blobUrl: blob.url,
    blobPath: blob.pathname,
    contentType,
    byteSize: blob.size ?? 0,
    status: "pending",
  });
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET || !process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "Accounts and private file storage are not configured yet." }, { status: 503 });
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session) return Response.json({ error: "Sign in before sharing a resource." }, { status: 401 });

  try {
    const body = (await request.json()) as HandleUploadBody;
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        const payload = JSON.parse(clientPayload ?? "{}") as unknown;
        const metadata = resourceMetadataSchema.parse(payload);
        return {
          allowedContentTypes,
          maximumSizeInBytes: 20 * 1024 * 1024,
          addRandomSuffix: true,
          tokenPayload: JSON.stringify({ metadata, uploaderId: session.user.id }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        const payload = JSON.parse(tokenPayload ?? "{}") as { metadata: unknown; uploaderId: string };
        if (payload.uploaderId !== session.user.id) throw new Error("The upload owner could not be confirmed.");
        await saveResource(payload.metadata, payload.uploaderId, blob);
      },
    });
    return Response.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload could not be completed.";
    return Response.json({ error: message }, { status: 400 });
  }
}
