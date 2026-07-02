"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home, BookOpen, Library, Users, Bot, Award, Settings, LogOut, ChevronLeft
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";
import { LogoFull } from "@/components/shared/Logo";

const navItems = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: BookOpen, label: "Ma Formation", href: "/dashboard/formation" },
  { icon: Library, label: "Bibliothèque", href: "/dashboard/bibliotheque" },
  { icon: Users, label: "Communauté", href: "/dashboard/communaute" },
  { icon: Bot, label: "Assistant IA", href: "/dashboard/ai" },
  { icon: Award, label: "Certificats", href: "/dashboard/certificats" },
  { icon: Settings, label: "Paramètres", href: "/dashboard/parametres" },
];

const levelBadges = {
  "0": "Apprenti IA",
  "25": "Vibe Coder",
  "50": "Fondateur",
  "75": "Architecte IA",
  "100": "Maître",
} as const;

function getLevel(progress: number): string {
  if (progress >= 75) return levelBadges["75"];
  if (progress >= 50) return levelBadges["50"];
  if (progress >= 25) return levelBadges["25"];
  return levelBadges["0"];
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  const setCollapsed = useAppStore((s) => s.setSidebarCollapsed);
  const handleLogout = async () => { await supabase.auth.signOut(); setUser(null); router.push("/login"); };
  const level = getLevel(user?.totalProgress ?? 0);

  return (
    <aside className={cn(
      "hidden md:flex flex-col bg-surface border-r border-white/5 h-screen sticky top-0 z-30 group transition-all duration-200",
      collapsed ? "md:w-16 hover:md:w-64" : "md:w-64"
    )}>
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          {collapsed ? <LogoFull className="[&>div>span]:hidden group-hover:[&>div>span]:inline" /> : <LogoFull />}
        </Link>
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 rounded-lg hover:bg-violet/10 text-mist hover:text-star-white transition-colors">
          <ChevronLeft className={cn("w-4 h-4 transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      <div className={cn(collapsed && "hidden group-hover:block")}>
        <Link href="/dashboard/parametres" className="px-3 pt-3 pb-2 block">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet/10 to-magenta/10 border border-violet/10 hover:border-violet/30 transition-colors">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-xs font-bold text-white shrink-0">
              {user?.initials || "?"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-star-white font-medium truncate">{user?.name || "Utilisateur"}</p>
              <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-violet/20 text-violet font-medium">{level}</span>
            </div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-150 rounded-xl",
                isActive
                  ? "text-violet bg-violet/10 border-l-2 border-violet"
                  : "text-mist hover:text-star-white hover:bg-violet/5"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              <span className={cn(collapsed && "hidden group-hover:inline")}>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className={cn("p-3 border-t border-white/5", collapsed && "hidden group-hover:block")}>
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm text-mist hover:text-rose hover:bg-rose/5 rounded-xl transition-colors w-full">
          <LogOut className="w-4 h-4 shrink-0" />
          <span className={cn(collapsed && "hidden group-hover:inline")}>Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
}
