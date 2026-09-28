import { get } from "@vercel/blob";
import { eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { getDatabase } from "@/db";
import { resources } from "@/db/schema";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET || !process.env.BLOB_READ_WRITE_TOKEN) return new Response("Resource storage is not configured.", { status: 503 });
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session) return new Response("Sign in to access course files.", { status: 401 });
  const { id } = await params;
  const [resource] = await getDatabase().select().from(resources).where(eq(resources.id, id)).limit(1);
  const admins = (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  const isAdmin = admins.includes(session.user.email.toLowerCase());
  if (!resource || (resource.status !== "approved" && resource.uploadedBy !== session.user.id && !isAdmin)) return new Response("This file is not available.", { status: 404 });
  const blob = await get(resource.blobPath, { access: "private" });
  if (!blob || blob.statusCode !== 200) return new Response("File not found.", { status: 404 });
  return new Response(blob.stream, {
    headers: {
      "Content-Type": resource.contentType,
      "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(resource.originalFilename)}`,
      "Cache-Control": "private, no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

