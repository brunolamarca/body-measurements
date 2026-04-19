import { ProfileForm } from "@/components/profile/ProfileForm";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NewProfilePage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📏</span>
          <h1 className="text-xl font-bold">Medidas Corporais</h1>
        </div>
        <ThemeToggle />
      </header>
      <main className="max-w-xl mx-auto p-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar
        </Link>
        <h2 className="text-2xl font-bold mb-6">Novo perfil</h2>
        <ProfileForm />
      </main>
    </div>
  );
}
