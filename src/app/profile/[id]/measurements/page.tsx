import { notFound } from "next/navigation";
import Link from "next/link";
import { PlusCircle, Download, Pencil } from "lucide-react";
import type { Measurement } from "@/generated/prisma/client";
import { getProfile } from "@/actions/profiles";
import { getMeasurements } from "@/actions/measurements";
import { AppShell } from "@/components/layout/AppShell";
import { DeltaBadge } from "@/components/measurement/DeltaBadge";
import { NotesPopover } from "@/components/measurement/NotesPopover";
import { buttonVariants } from "@/components/ui/button";
import { formatDate, cn } from "@/lib/utils";

interface MeasurementsPageProps {
  params: Promise<{ id: string }>;
}

export default async function MeasurementsPage({ params }: MeasurementsPageProps) {
  const { id } = await params;
  const [profile, measurements] = await Promise.all([
    getProfile(id),
    getMeasurements(id),
  ]);

  if (!profile) notFound();

  return (
    <AppShell profileId={id} profileName={profile.name}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Histórico de medidas</h1>
          <p className="text-sm text-muted-foreground">{profile.name}</p>
        </div>
        <div className="flex gap-2">
          {measurements.length > 0 && (
            <a
              href={`/profile/${id}/measurements/export`}
              download
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              <Download className="h-3.5 w-3.5 mr-1" />
              Exportar CSV
            </a>
          )}
          <Link
            href={`/profile/${id}/new`}
            className={cn(buttonVariants({ size: "sm" }))}
          >
            <PlusCircle className="h-3.5 w-3.5 mr-1" />
            Novo registro
          </Link>
        </div>
      </div>

      {measurements.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="text-xl font-semibold mb-2">Nenhuma medida registrada</h3>
          <p className="text-muted-foreground mb-6 max-w-sm">
            Comece a registrar suas medidas para acompanhar a evolução ao longo do tempo
          </p>
          <Link href={`/profile/${id}/new`} className={buttonVariants()}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar primeiro registro
          </Link>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-lg border overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium">Data</th>
                  <th className="text-right px-3 py-3 font-medium">Peso</th>
                  <th className="text-right px-3 py-3 font-medium">Cin. umbigo</th>
                  <th className="text-right px-3 py-3 font-medium">Cin. acima</th>
                  <th className="text-right px-3 py-3 font-medium">Braço D/E</th>
                  <th className="text-right px-3 py-3 font-medium">Glúteos</th>
                  <th className="text-right px-3 py-3 font-medium">Coxa D/E</th>
                  <th className="text-right px-3 py-3 font-medium">Pant. D/E</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y">
                {measurements.map((m: Measurement, i: number) => {
                  const prev = measurements[i + 1] as Measurement | undefined;
                  return (
                    <tr key={m.id} className="hover:bg-muted/30 transition-colors">
                      <td className="px-4 py-3 font-medium whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {formatDate(m.date)}
                          {m.notes && <NotesPopover notes={m.notes} />}
                        </div>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">
                        <div>{m.weightKg ? `${m.weightKg}kg` : "—"}</div>
                        <DeltaBadge current={m.weightKg} previous={prev?.weightKg} />
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">
                        <div>{m.waistNavelCm ? `${m.waistNavelCm}cm` : "—"}</div>
                        <DeltaBadge current={m.waistNavelCm} previous={prev?.waistNavelCm} />
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">
                        <div>{m.waistAboveNavelCm ? `${m.waistAboveNavelCm}cm` : "—"}</div>
                        <DeltaBadge current={m.waistAboveNavelCm} previous={prev?.waistAboveNavelCm} />
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap text-xs">
                        {m.rightArmCm || m.leftArmCm
                          ? `${m.rightArmCm ?? "—"} / ${m.leftArmCm ?? "—"}`
                          : "—"}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap">
                        <div>{m.glutesCm ? `${m.glutesCm}cm` : "—"}</div>
                        <DeltaBadge current={m.glutesCm} previous={prev?.glutesCm} />
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap text-xs">
                        {m.rightThighCm || m.leftThighCm
                          ? `${m.rightThighCm ?? "—"} / ${m.leftThighCm ?? "—"}`
                          : "—"}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums whitespace-nowrap text-xs">
                        {m.rightCalfCm || m.leftCalfCm
                          ? `${m.rightCalfCm ?? "—"} / ${m.leftCalfCm ?? "—"}`
                          : "—"}
                      </td>
                      <td className="px-3 py-3">
                        <Link
                          href={`/profile/${id}/measurements/${m.id}`}
                          className={buttonVariants({ variant: "ghost", size: "sm" })}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {measurements.map((m: Measurement, i: number) => {
              const prev = measurements[i + 1] as Measurement | undefined;
              return (
                <div key={m.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-sm">{formatDate(m.date)}</p>
                      {m.notes && (
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                          📝 {m.notes}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/profile/${id}/measurements/${m.id}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {m.weightKg != null && (
                      <div>
                        <p className="text-muted-foreground">Peso</p>
                        <p className="font-medium">{m.weightKg}kg</p>
                        <DeltaBadge current={m.weightKg} previous={prev?.weightKg} />
                      </div>
                    )}
                    {m.waistNavelCm != null && (
                      <div>
                        <p className="text-muted-foreground">Cin. umbigo</p>
                        <p className="font-medium">{m.waistNavelCm}cm</p>
                        <DeltaBadge current={m.waistNavelCm} previous={prev?.waistNavelCm} />
                      </div>
                    )}
                    {m.glutesCm != null && (
                      <div>
                        <p className="text-muted-foreground">Glúteos</p>
                        <p className="font-medium">{m.glutesCm}cm</p>
                        <DeltaBadge current={m.glutesCm} previous={prev?.glutesCm} />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </AppShell>
  );
}
