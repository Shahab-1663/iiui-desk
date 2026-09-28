import { z } from "zod";
import { getDatabase } from "@/db";
import { contactMessages } from "@/db/schema";

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email().max(254),
  topic: z.string().trim().min(2).max(80),
  message: z.string().trim().min(10).max(2500),
});

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL) return Response.json({ error: "The contact service is not configured yet." }, { status: 503 });
  try {
    const data = schema.parse(await request.json());
    await getDatabase().insert(contactMessages).values(data);
    return Response.json({ ok: true });
  } catch (error) {
    if (error instanceof z.ZodError) return Response.json({ error: error.issues[0]?.message ?? "Check your message and try again." }, { status: 400 });
    return Response.json({ error: "We could not save your message. Please try again." }, { status: 500 });
  }
}
