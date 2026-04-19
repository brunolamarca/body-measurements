import { notFound } from "next/navigation";
import { getProfile } from "@/actions/profiles";
import { getMeasurements } from "@/actions/measurements";
import { AppShell } from "@/components/layout/AppShell";
import { ChartsClient } from "@/components/charts/ChartsClient";

interface ChartsPageProps {
  params: Promise<{ id: string }>;
}

export default async function ChartsPage({ params }: ChartsPageProps) {
  const { id } = await params;
  const [profile, measurements] = await Promise.all([
    getProfile(id),
    getMeasurements(id),
  ]);

  if (!profile) notFound();

  return (
    <AppShell profileId={id} profileName={profile.name}>
      <h1 className="text-2xl font-bold mb-1">Gráficos</h1>
      <p className="text-sm text-muted-foreground mb-6">{profile.name}</p>
      <ChartsClient measurements={measurements} />
    </AppShell>
  );
}
