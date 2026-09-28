import { toNextJsHandler } from "better-auth/next-js";
import { getAuth } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) {
    return Response.json({ error: "Authentication is not configured for this deployment." }, { status: 503 });
  }
  return toNextJsHandler(getAuth()).GET(request);
}

export async function POST(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) {
    return Response.json({ error: "Authentication is not configured for this deployment." }, { status: 503 });
  }
  return toNextJsHandler(getAuth()).POST(request);
}

