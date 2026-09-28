import { isAdminRequest } from "@/lib/admin";

export async function GET(request: Request) {
  return Response.json({ isAdmin: await isAdminRequest(request) }, { headers: { "Cache-Control": "no-store" } });
}
