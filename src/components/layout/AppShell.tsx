"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, PlusCircle, ClipboardList,
  BarChart2, Menu, Users, Activity,
} from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn, getInitials } from "@/lib/utils";
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

function NavLinks({
  items,
  pathname,
  onClick,
}: {
  items: NavItem[];
  pathname: string;
  onClick?: () => void;
}) {
  return (
    <nav className="flex flex-col gap-0.5">
      {items.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClick}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
              isActive
                ? "gradient-primary text-white shadow-sm shadow-primary/30"
                : "text-muted-foreground hover:bg-accent hover:text-foreground"
            )}
          >
            <span className={cn(isActive ? "text-white" : "text-muted-foreground")}>
              {item.icon}
            </span>
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

interface AppShellProps {
  children: React.ReactNode;
  profileId?: string;
  profileName?: string;
  avatarColor?: string;
}

export function AppShell({ children, profileId, profileName, avatarColor }: AppShellProps) {
  const pathname = usePathname();
  const navItems = getNavItems(profileId);
  const [open, setOpen] = useState(false);

  const Logo = () => (
    <Link href="/" className="flex items-center gap-2.5 px-1">
      <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center shadow-sm flex-shrink-0">
        <Activity className="h-4 w-4 text-white" />
      </div>
      <span className="font-bold text-sm tracking-tight">Medidas Corporais</span>
    </Link>
  );

  const SidebarContent = ({ onNav }: { onNav?: () => void }) => (
    <div className="flex flex-col h-full">
      <div className="mb-6">
        <Logo />
      </div>

      <NavLinks items={navItems} pathname={pathname} onClick={onNav} />

      <div className="mt-auto">
        {profileId && (
          <div className="border-t pt-4 mt-4">
            <Link
              href="/"
              onClick={onNav}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-150"
            >
              {avatarColor ? (
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                  style={{ backgroundColor: avatarColor }}
                >
                  {profileName ? getInitials(profileName) : "?"}
                </div>
              ) : (
                <Users className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="truncate">{profileName ?? "Trocar perfil"}</span>
            </Link>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 glass">
        <div className="flex h-14 items-center px-4 gap-3">
          {/* Mobile menu */}
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
              <span className="sr-only">Menu</span>
            </SheetTrigger>
            <SheetContent side="left" className="w-64 p-5">
              <SidebarContent onNav={() => setOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Logo (mobile) */}
          <Link href="/" className="md:hidden flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
              <Activity className="h-3.5 w-3.5 text-white" />
            </div>
          </Link>

          <div className="flex-1" />

          {/* Profile chip (desktop) */}
          {profileName && (
            <Link
              href="/"
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted hover:bg-accent transition-colors text-sm text-muted-foreground hover:text-foreground"
            >
              {avatarColor && (
                <div
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: avatarColor }}
                >
                  {getInitials(profileName)}
                </div>
              )}
              <span>{profileName}</span>
            </Link>
          )}

          <ThemeToggle />
        </div>
      </header>

      <div className="flex">
        {/* Sidebar (desktop) */}
        <aside className="hidden md:flex w-56 flex-col border-r min-h-[calc(100vh-3.5rem)] p-4 sticky top-14 self-start bg-sidebar">
          <SidebarContent />
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 md:max-w-5xl">
          {children}
        </main>
      </div>
    </div>
  );
}
