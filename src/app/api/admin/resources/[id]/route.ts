import { eq } from "drizzle-orm";
import { z } from "zod";
import { del } from "@vercel/blob";
import { getDatabase } from "@/db";
import { resources } from "@/db/schema";
import { getAuth } from "@/lib/auth";

const input = z.object({ status: z.enum(["approved", "rejected"]), note: z.string().trim().max(500).optional() });

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) return Response.json({ error: "Moderation is not configured." }, { status: 503 });
  const session = await getAuth().api.getSession({ headers: request.headers });
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!session || !admins.includes(session.user.email.toLowerCase())) return Response.json({ error: "Moderator access is required." }, { status: 403 });
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  try {
    const body = input.parse(await request.json());
    const { id } = await params;
    const [updated] = await getDatabase().update(resources).set({ status: body.status, moderationNote: body.note ?? null, updatedAt: new Date() }).where(eq(resources.id, id)).returning({ id: resources.id });
    if (!updated) return Response.json({ error: "Resource not found." }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message ?? "Invalid review action." }, { status: 400 });
    return Response.json({ error: "The review action could not be saved." }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET || !process.env.BLOB_READ_WRITE_TOKEN) return Response.json({ error: "Resource management and file storage are not configured." }, { status: 503 });
  const session = await getAuth().api.getSession({ headers: request.headers });
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  if (!session || !admins.includes(session.user.email.toLowerCase())) return Response.json({ error: "Administrator access is required." }, { status: 403 });
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return Response.json({ error: "Request origin is not allowed." }, { status: 403 });
  const { id } = await params;
  try {
    const db = getDatabase();
    const [resource] = await db.select({ id: resources.id, blobUrl: resources.blobUrl }).from(resources).where(eq(resources.id, id)).limit(1);
    if (!resource) return Response.json({ error: "Resource not found." }, { status: 404 });
    await del(resource.blobUrl, { token: process.env.BLOB_READ_WRITE_TOKEN });
    await db.delete(resources).where(eq(resources.id, id));
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "The resource could not be removed. Check file storage and try again." }, { status: 500 });
  }
}
