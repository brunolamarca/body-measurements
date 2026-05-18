export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getProfile } from "@/actions/profiles";
import { getLastMeasurement } from "@/actions/measurements";
import { AppShell } from "@/components/layout/AppShell";
import { MeasurementForm } from "@/components/measurement/MeasurementForm";

interface NewMeasurementPageProps {
  params: Promise<{ id: string }>;
}

export default async function NewMeasurementPage({ params }: NewMeasurementPageProps) {
  const { id } = await params;
  const [profile, lastMeasurement] = await Promise.all([
    getProfile(id),
    getLastMeasurement(id),
  ]);

  if (!profile) notFound();

  return (
    <AppShell profileId={id} profileName={profile.name} avatarColor={profile.avatarColor}>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold mb-1">Novo registro</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Perfil: <strong>{profile.name}</strong>
        </p>
        <MeasurementForm
          profileId={id}
          lastMeasurement={lastMeasurement}
        />
      </div>
    </AppShell>
  );
}
