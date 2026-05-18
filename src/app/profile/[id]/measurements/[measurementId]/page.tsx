export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getProfile } from "@/actions/profiles";
import { getMeasurement, getLastMeasurement } from "@/actions/measurements";
import { AppShell } from "@/components/layout/AppShell";
import { MeasurementForm } from "@/components/measurement/MeasurementForm";
import { DeleteMeasurementButton } from "@/components/measurement/DeleteMeasurementButton";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditMeasurementPageProps {
  params: Promise<{ id: string; measurementId: string }>;
}

export default async function EditMeasurementPage({ params }: EditMeasurementPageProps) {
  const { id, measurementId } = await params;
  const [profile, measurement] = await Promise.all([
    getProfile(id),
    getMeasurement(measurementId),
  ]);

  if (!profile || !measurement) notFound();

  return (
    <AppShell profileId={id} profileName={profile.name} avatarColor={profile.avatarColor}>
      <div className="max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <Link
            href={`/profile/${id}/measurements`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Voltar ao histórico
          </Link>
          <DeleteMeasurementButton
            profileId={id}
            measurementId={measurementId}
          />
        </div>
        <h1 className="text-2xl font-bold mb-1">Editar registro</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Perfil: <strong>{profile.name}</strong>
        </p>
        <MeasurementForm
          profileId={id}
          measurementId={measurementId}
          defaultValues={measurement}
        />
      </div>
    </AppShell>
  );
}
