export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import Link from "next/link";
import {
  PlusCircle, ClipboardList, BarChart2, Pencil,
  Weight, Ruler, Activity, Hash,
} from "lucide-react";
import { getProfile } from "@/actions/profiles";
import { getMeasurements } from "@/actions/measurements";
import type { Measurement } from "@/generated/prisma/client";
import { AppShell } from "@/components/layout/AppShell";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { DeleteProfileButton } from "@/components/profile/DeleteProfileButton";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { calcBMI, cn, formatDate, formatRelative } from "@/lib/utils";
import { ProfileSparkline } from "@/components/profile/ProfileSparkline";

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

interface StatCardProps {
  label: string;
  value: string;
  unit: string;
  sub?: string;
  badge?: { text: string; positive: boolean } | null;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ label, value, unit, sub, badge, icon, color }: StatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card p-5 hover:shadow-md transition-shadow duration-200">
      {/* Icon */}
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${color}18` }}
      >
        <span style={{ color }}>{icon}</span>
      </div>

      <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-3xl font-extrabold tracking-tight">
        {value}
        <span className="text-base font-normal text-muted-foreground ml-1">{unit}</span>
      </p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
      {badge && (
        <span
          className={cn(
            "inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded-full",
            badge.positive
              ? "bg-green-500/10 text-green-600 dark:text-green-400"
              : "bg-red-500/10 text-red-500"
          )}
        >
          {badge.text}
        </span>
      )}

      {/* Decorative circle */}
      <div
        className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full opacity-5"
        style={{ backgroundColor: color }}
      />
    </div>
  );
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

  const bmiLabel = bmi
    ? bmi < 18.5 ? "Abaixo do peso"
      : bmi < 25 ? "Peso normal"
      : bmi < 30 ? "Sobrepeso"
      : "Obesidade"
    : profile.heightCm ? "Sem peso" : "Informe a altura";

  return (
    <AppShell profileId={id} profileName={profile.name} avatarColor={profile.avatarColor}>
      {/* Profile header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
        <ProfileAvatar name={profile.name} color={profile.avatarColor} size="lg" />
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-extrabold tracking-tight">{profile.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-1 text-sm text-muted-foreground">
            {profile.heightCm && <span>📏 {profile.heightCm} cm</span>}
            {profile.gender && (
              <span className="capitalize">
                {profile.gender === "masculino" ? "♂" : profile.gender === "feminino" ? "♀" : "⚧"} {profile.gender}
              </span>
            )}
            {totalCount > 0 && (
              <span>🗓 Desde {formatRelative(earliest!.date)}</span>
            )}
          </div>
        </div>
        <div className="flex gap-2 flex-shrink-0">
          <Link
            href={`/profile/${id}/edit`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }), "rounded-xl")}
          >
            <Pencil className="h-3.5 w-3.5 mr-1.5" />
            Editar
          </Link>
          <DeleteProfileButton profileId={id} profileName={profile.name} />
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard
          label="Peso atual"
          value={latest?.weightKg ? latest.weightKg.toFixed(1) : "—"}
          unit={latest?.weightKg ? "kg" : ""}
          icon={<Weight className="h-5 w-5" />}
          color="#6366f1"
          badge={
            weightDelta !== null
              ? {
                  text: `${weightDelta > 0 ? "+" : ""}${weightDelta.toFixed(1)} kg total`,
                  positive: weightDelta < 0,
                }
              : null
          }
        />
        <StatCard
          label="Cintura (umbigo)"
          value={latest?.waistNavelCm ? latest.waistNavelCm.toFixed(1) : "—"}
          unit={latest?.waistNavelCm ? "cm" : ""}
          icon={<Ruler className="h-5 w-5" />}
          color="#f59e0b"
        />
        <StatCard
          label="IMC"
          value={bmi ? bmi.toFixed(1) : "—"}
          unit=""
          sub={bmiLabel}
          icon={<Activity className="h-5 w-5" />}
          color={
            !bmi ? "#6b7280"
              : bmi < 18.5 ? "#3b82f6"
              : bmi < 25 ? "#22c55e"
              : bmi < 30 ? "#f59e0b"
              : "#ef4444"
          }
        />
        <StatCard
          label="Total de registros"
          value={String(totalCount)}
          unit=""
          sub={latest ? `Último: ${formatDate(latest.date)}` : "Nenhum ainda"}
          icon={<Hash className="h-5 w-5" />}
          color="#8b5cf6"
        />
      </div>

      {/* Sparkline */}
      {measurements.length >= 2 && (
        <div className="rounded-2xl border bg-card p-5 mb-6">
          <p className="text-sm font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Evolução do peso (últimos 90 dias)
          </p>
          <ProfileSparkline measurements={measurements} />
        </div>
      )}

      {/* Recent measurements */}
      {measurements.length > 0 && (
        <div className="rounded-2xl border bg-card mb-6 overflow-hidden">
          <div className="px-5 py-4 border-b">
            <p className="text-sm font-semibold">Últimos registros</p>
          </div>
          <div className="divide-y">
            {measurements.slice(0, 3).map((m: Measurement) => (
              <div key={m.id} className="px-5 py-3.5 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div>
                  <p className="text-sm font-semibold">{formatDate(m.date)}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
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
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-xs rounded-xl")}
                >
                  Editar
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Link
          href={`/profile/${id}/new`}
          className={cn(buttonVariants({ size: "lg" }), "h-13 rounded-xl justify-center shadow-md shadow-primary/20")}
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          Novo registro
        </Link>
        <Link
          href={`/profile/${id}/measurements`}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-13 rounded-xl justify-center")}
        >
          <ClipboardList className="h-5 w-5 mr-2" />
          Ver histórico
        </Link>
        <Link
          href={`/profile/${id}/charts`}
          className={cn(buttonVariants({ variant: "outline", size: "lg" }), "h-13 rounded-xl justify-center")}
        >
          <BarChart2 className="h-5 w-5 mr-2" />
          Ver gráficos
        </Link>
      </div>
    </AppShell>
  );
}
