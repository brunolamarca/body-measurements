export const dynamic = "force-dynamic";

import Link from "next/link";
import { PlusCircle, UserPlus, Activity } from "lucide-react";
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
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 glass">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-sm">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <span className="font-bold text-base tracking-tight">Medidas Corporais</span>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-4 border border-primary/20">
            <Activity className="h-3 w-3" />
            Acompanhamento corporal
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">
            Selecione{" "}
            <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
              seu perfil
            </span>
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Acompanhe sua evolução corporal ao longo do tempo com gráficos e histórico completo
          </p>
        </div>

        {profiles.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-primary/25">
              <UserPlus className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold mb-2">Nenhum perfil criado</h3>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Crie o primeiro perfil para começar a registrar suas medidas corporais
            </p>
            <Link href="/profile/new" className={buttonVariants({ size: "lg" })}>
              <PlusCircle className="h-5 w-5 mr-2" />
              Criar primeiro perfil
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground font-medium">
                {profiles.length} perfil{profiles.length !== 1 ? "s" : ""} cadastrado{profiles.length !== 1 ? "s" : ""}
              </p>
              <Link
                href="/profile/new"
                className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-1.5")}
              >
                <PlusCircle className="h-3.5 w-3.5" />
                Novo perfil
              </Link>
            </div>

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

              {/* Add new profile card */}
              <Link href="/profile/new" className="group">
                <div className="border-2 border-dashed border-border rounded-2xl p-6 flex flex-col items-center justify-center gap-3 min-h-[140px] hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 cursor-pointer text-muted-foreground hover:text-primary">
                  <div className="w-12 h-12 rounded-xl border-2 border-dashed border-current flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <PlusCircle className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold">Novo perfil</span>
                </div>
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
