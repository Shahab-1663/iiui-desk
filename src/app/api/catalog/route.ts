import { getFacultyDegrees } from "@/lib/catalog-db";
import { getFacultyDirectory } from "@/lib/catalog-db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const faculty = url.searchParams.get("faculty") ?? "";
  const catalog = await getFacultyDirectory();
  const selected = catalog.find((item) => item.slug === faculty);
  if (!selected) return Response.json({ error: "Choose a valid IIUI faculty." }, { status: 400 });
  return Response.json({
    faculties: catalog.map(({ slug, name, short }) => ({ slug, name, short })),
    departments: selected.departments.map(({ slug, name }) => ({ slug, name })),
    degrees: await getFacultyDegrees(faculty),
  }, { headers: { "Cache-Control": "no-store" } });
}
