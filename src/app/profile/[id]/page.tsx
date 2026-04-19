import { notFound } from "next/navigation";
import Link from "next/link";
import { PlusCircle, ClipboardList, BarChart2, Pencil } from "lucide-react";
import { getProfile } from "@/actions/profiles";
import { getMeasurements } from "@/actions/measurements";
import type { Measurement } from "@/generated/prisma/client";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { DeleteProfileButton } from "@/components/profile/DeleteProfileButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { calcBMI, cn, formatDate, formatMeasurement } from "@/lib/utils";
import { ProfileSparkline } from "@/components/profile/ProfileSparkline";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const [profile, measurements] = await Promise.all([
    getProfile(id),
    getMeasurements(id),
  ]);

  if (!profile) notFound();

  const latest = measurements[0] as Measurement | undefined;
  const earliest = measurements[measurements.length - 1] as Measurement | undefined;
  const totalCount = measurements.length;

  const weightDelta =
    latest?.weightKg && earliest?.weightKg && latest.id !== earliest.id
      ? latest.weightKg - earliest.weightKg
      : null;

  const bmi =
    latest?.weightKg && profile.heightCm
      ? calcBMI(latest.weightKg, profile.heightCm)
      : null;

  return (
    <AppShell profileId={id} profileName={profile.name}>
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <ProfileAvatar name={profile.name} color={profile.avatarColor} size="lg" />
        <div className="flex-1">
          <h1 className="text-2xl font-bold">{profile.name}</h1>
          {profile.heightCm && (
            <p className="text-sm text-muted-foreground">
              Altura: {profile.heightCm} cm
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/profile/${id}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            <Pencil className="h-3.5 w-3.5 mr-1" />
            Editar
          </Link>
          <DeleteProfileButton profileId={id} profileName={profile.name} />
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal uppercase tracking-wide">
              Peso atual
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">
              {latest?.weightKg ? `${latest.weightKg.toFixed(1)}` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">kg</p>
            {weightDelta !== null && (
              <Badge variant="outline" className="mt-1 text-xs">
                {weightDelta > 0 ? "+" : ""}{weightDelta.toFixed(1)} kg total
              </Badge>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal uppercase tracking-wide">
              Cintura (umbigo)
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">
              {latest?.waistNavelCm ? `${latest.waistNavelCm.toFixed(1)}` : "—"}
            </p>
            <p className="text-xs text-muted-foreground">cm</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal uppercase tracking-wide">
              IMC
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{bmi ? bmi.toFixed(1) : "—"}</p>
            <p className="text-xs text-muted-foreground">
              {bmi
                ? bmi < 18.5 ? "Abaixo do peso"
                  : bmi < 25 ? "Peso normal"
                  : bmi < 30 ? "Sobrepeso"
                  : "Obesidade"
                : profile.heightCm ? "Sem peso" : "Informe altura"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-1 pt-4 px-4">
            <CardTitle className="text-xs text-muted-foreground font-normal uppercase tracking-wide">
              Total de registros
            </CardTitle>
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <p className="text-2xl font-bold">{totalCount}</p>
            <p className="text-xs text-muted-foreground">
              {latest ? `Último: ${formatDate(latest.date)}` : "Nenhum ainda"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Sparkline chart */}
      {measurements.length >= 2 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Evolução do peso (últimos 90 dias)</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileSparkline measurements={measurements} />
          </CardContent>
        </Card>
      )}

      {/* Recent measurements */}
      {measurements.length > 0 && (
        <Card className="mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Últimos registros</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {measurements.slice(0, 3).map((m: Measurement) => (
                <div key={m.id} className="px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{formatDate(m.date)}</p>
                    <p className="text-xs text-muted-foreground">
                      {[
                        m.weightKg ? `Peso: ${m.weightKg}kg` : null,
                        m.waistNavelCm ? `Cintura: ${m.waistNavelCm}cm` : null,
                      ]
                        .filter(Boolean)
                        .join(" · ") || "Medidas registradas"}
                    </p>
                  </div>
                  <Link
                    href={`/profile/${id}/measurements/${m.id}`}
                    className={buttonVariants({ variant: "ghost", size: "sm" })}
                  >
                    Editar
                  </Link>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href={`/profile/${id}/new`}
          className={cn(buttonVariants({ size: "lg" }), "h-14 justify-center")}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Novo registro
        </Link>
        <Link
          href={`/profile/${id}/measurements`}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 justify-center")}
        >
          <ClipboardList className="h-5 w-5 mr-2" />
          Ver histórico
        </Link>
        <Link
          href={`/profile/${id}/charts`}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-14 justify-center")}
        >
          <BarChart2 className="h-5 w-5 mr-2" />
          Ver gráficos
        </Link>
      </div>
    </AppShell>
  );
}
