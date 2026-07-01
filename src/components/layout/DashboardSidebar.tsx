"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home, BookOpen, Library, Users, Bot, Award, Settings, LogOut, ChevronLeft, User
} from "lucide-react";
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
  { icon: User, label: "Profil", href: "/dashboard/profile" },
];

const levelBadges: Record<string, string> = {
  "0": "Apprenti IA",
  "25": "Vibe Coder",
  "50": "Fondateur",
  "75": "Architecte IA",
  "100": "Maître",
};

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
  const sidebarOpen = useAppStore((s) => s.sidebarOpen);
  const setSidebarOpen = useAppStore((s) => s.setSidebarOpen);
  const handleLogout = () => { setUser(null); router.push("/login"); };
  const level = getLevel(42);

  return (
    <aside className={cn(
      "hidden md:flex md:w-64 flex-col bg-surface border-r border-white/5 h-screen sticky top-0 transition-all duration-200 z-30",
      !sidebarOpen && "md:w-16"
    )}>
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          {sidebarOpen ? <LogoFull /> : <LogoFull className="[&>div>span]:hidden" />}
        </Link>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 rounded-lg hover:bg-violet/10 text-mist hover:text-star-white transition-colors">
          <ChevronLeft className={cn("w-4 h-4 transition-transform", !sidebarOpen && "rotate-180")} />
        </button>
      </div>

      {/* User profile */}
      {sidebarOpen && (
        <Link href="/dashboard/profile" className="px-3 pt-3 pb-2 block">
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
      )}

      {/* Navigation */}
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
              {sidebarOpen && item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      {sidebarOpen && (
        <div className="p-3 border-t border-white/5">
          <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2 text-sm text-mist hover:text-rose hover:bg-rose/5 rounded-xl transition-colors w-full">
            <LogOut className="w-4 h-4 shrink-0" />
            Se déconnecter
          </button>
        </div>
      )}
    </aside>
  );
}
