import { getFacultyDegrees } from "@/lib/catalog-db";
import { getFaculty } from "@/lib/catalog";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const faculty = url.searchParams.get("faculty") ?? "";
  if (!getFaculty(faculty)) return Response.json({ error: "Choose a valid IIUI faculty." }, { status: 400 });
  return Response.json({ degrees: await getFacultyDegrees(faculty) }, { headers: { "Cache-Control": "no-store" } });
}
