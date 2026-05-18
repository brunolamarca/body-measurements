export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { getProfile } from "@/actions/profiles";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { AppShell } from "@/components/layout/AppShell";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface EditProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProfilePage({ params }: EditProfilePageProps) {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) notFound();

  return (
    <AppShell profileId={id} profileName={profile.name} avatarColor={profile.avatarColor}>
      <Link
        href={`/profile/${id}`}
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Voltar ao dashboard
      </Link>
      <h2 className="text-2xl font-bold mb-6">Editar perfil</h2>
      <ProfileForm
        profileId={id}
        defaultValues={{
          name: profile.name,
          birthdate: profile.birthdate,
          gender: profile.gender as "masculino" | "feminino" | "outro" | null,
          heightCm: profile.heightCm,
          avatarColor: profile.avatarColor,
        }}
      />
    </AppShell>
  );
}
