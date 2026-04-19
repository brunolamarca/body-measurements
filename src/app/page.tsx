import Link from "next/link";
import { PlusCircle, Users } from "lucide-react";
import { getProfiles } from "@/actions/profiles";
import type { Profile } from "@/generated/prisma/client";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default async function Home() {
  const profiles = await getProfiles();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📏</span>
          <h1 className="text-xl font-bold">Medidas Corporais</h1>
        </div>
        <ThemeToggle />
      </header>

      <main className="max-w-3xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Selecionar perfil</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Escolha quem vai registrar medidas hoje
            </p>
          </div>
          <Link href="/profile/new" className={buttonVariants()}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Novo perfil
          </Link>
        </div>

        {profiles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">👤</div>
            <h3 className="text-xl font-semibold mb-2">Nenhum perfil criado</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Crie o primeiro perfil para começar a registrar suas medidas corporais
            </p>
            <Link href="/profile/new" className={buttonVariants()}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Criar primeiro perfil
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {profiles.map((profile: Profile & { _count: { measurements: number }; measurements: { date: Date }[] }) => (
              <ProfileCard
                key={profile.id}
                id={profile.id}
                name={profile.name}
                avatarColor={profile.avatarColor}
                measurementCount={profile._count.measurements}
                lastMeasurementDate={profile.measurements[0]?.date ?? null}
              />
            ))}
            <Link href="/profile/new">
              <div className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-5 flex flex-col items-center justify-center gap-2 h-full min-h-[100px] hover:border-primary hover:text-primary transition-colors cursor-pointer text-muted-foreground">
                <Users className="h-6 w-6" />
                <span className="text-sm font-medium">Novo perfil</span>
              </div>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
