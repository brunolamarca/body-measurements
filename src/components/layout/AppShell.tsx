"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, ClipboardList, BarChart2, Menu, Users } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

function getNavItems(profileId?: string): NavItem[] {
  if (!profileId) {
    return [{ href: "/", label: "Perfis", icon: <Users className="h-4 w-4" /> }];
  }
  return [
    { href: `/profile/${profileId}`, label: "Dashboard", icon: <LayoutDashboard className="h-4 w-4" /> },
    { href: `/profile/${profileId}/new`, label: "Novo Registro", icon: <PlusCircle className="h-4 w-4" /> },
    { href: `/profile/${profileId}/measurements`, label: "Histórico", icon: <ClipboardList className="h-4 w-4" /> },
    { href: `/profile/${profileId}/charts`, label: "Gráficos", icon: <BarChart2 className="h-4 w-4" /> },
  ];
}

function NavLinks({ items, pathname, onClick }: { items: NavItem[]; pathname: string; onClick?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onClick}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
            pathname === item.href
              ? "bg-primary text-primary-foreground"
              : "hover:bg-accent hover:text-accent-foreground text-muted-foreground"
          )}
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  profileId?: string;
  profileName?: string;
}

export function AppShell({ children, profileId, profileName }: AppShellProps) {
  const pathname = usePathname();
  const navItems = getNavItems(profileId);
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-14 items-center px-4 gap-4">
          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 pt-10">
              <div className="mb-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wider px-3 mb-2">
                  Navegação
                </p>
                <NavLinks items={navItems} pathname={pathname} onClick={() => setOpen(false)} />
              </div>
              {profileId && (
                <div className="border-t pt-4">
                  <Link
                    href="/"
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent"
                  >
                    <Users className="h-4 w-4" />
                    Trocar perfil
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-semibold text-sm">
            <span className="text-primary text-lg">📏</span>
            <span className="hidden sm:inline">Medidas Corporais</span>
          </Link>

          <div className="flex-1" />

          {/* Profile indicator */}
          {profileName && (
            <Link
              href="/"
              className="hidden md:flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Users className="h-3.5 w-3.5" />
              <span>{profileName}</span>
            </Link>
          )}

          <ThemeToggle />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex w-56 flex-col border-r min-h-[calc(100vh-3.5rem)] p-4 gap-4 sticky top-14 self-start">
          <NavLinks items={navItems} pathname={pathname} />
          {profileId && (
            <div className="mt-auto border-t pt-4">
              <Link
                href="/"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-accent"
              >
                <Users className="h-4 w-4" />
                Trocar perfil
              </Link>
            </div>
          )}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  );
}
