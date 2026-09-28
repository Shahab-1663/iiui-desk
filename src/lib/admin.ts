import { getAuth } from "@/lib/auth";

export async function isAdminRequest(request: Request) {
  if (!process.env.DATABASE_URL || !process.env.BETTER_AUTH_SECRET) return false;
  const session = await getAuth().api.getSession({ headers: request.headers });
  if (!session) return false;
  const allowlist = (process.env.ADMIN_EMAILS ?? "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean);
  return allowlist.includes(session.user.email.toLowerCase());
}

export function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || new URL(origin).host === new URL(request.url).host;
}
