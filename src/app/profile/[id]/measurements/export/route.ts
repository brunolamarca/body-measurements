import { NextResponse, type NextRequest } from "next/server";
import { getMeasurements } from "@/actions/measurements";
import { getProfile } from "@/actions/profiles";
import { measurementsToCsv } from "@/lib/csv";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const [profile, measurements] = await Promise.all([
    getProfile(id),
    getMeasurements(id),
  ]);

  if (!profile) {
    return NextResponse.json({ error: "Perfil não encontrado" }, { status: 404 });
  }

  const csv = measurementsToCsv(measurements, profile.name);
  const filename = `medidas-${profile.name.toLowerCase().replace(/\s+/g, "-")}.csv`;

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
