"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Search, Command, Zap, Flame } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useGamificationStore, getLevelTitle } from "@/store/useGamificationStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useSearchStore } from "@/store/useSearchStore";
import { LogoFull } from "@/components/shared/Logo";

const breadcrumbLabels: Record<string, string> = {
  "/dashboard": "Accueil",
  "/dashboard/formation": "Nos Formations",
  "/dashboard/bibliotheque": "Bibliothèque",
  "/dashboard/communaute": "Communauté",
  "/dashboard/ai": "Assistant IA",
  "/dashboard/certificats": "Certificats",
  "/dashboard/parametres": "Paramètres",
};

export function DashboardHeader() {
  const pathname = usePathname();
  const user = useAppStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const setSearchOpen = useSearchStore((s) => s.setOpen);
  const xp = useGamificationStore((s) => s.xp);
  const streak = useGamificationStore((s) => s.streak);

  const currentLabel = breadcrumbLabels[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-surface">
        <div className="flex items-center gap-3">
          <div className="sm:hidden">
            <LogoFull />
          </div>
          <span className="text-sm text-star-white font-medium hidden sm:inline">{currentLabel}</span>
        </div>

        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-400 font-medium">
              <Flame className="w-3.5 h-3.5" />
              {streak}
            </div>
          )}

          {xp > 0 && (
            <div className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-lg bg-violet/10 border border-violet/20 text-[11px] text-violet font-medium">
              <Zap className="w-3.5 h-3.5" />
              {xp} XP
            </div>
          )}

          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-mist hover:text-star-white transition-colors border border-white/[0.06]"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Rechercher</span>
            <kbd className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-mist"><Command className="w-2.5 h-2.5" />K</kbd>
          </button>

          <button className="relative p-2 text-mist hover:text-star-white hover:bg-white/5 rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose text-[8px] flex items-center justify-center font-bold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          <Link
            href="/dashboard/parametres"
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-violet to-magenta"
          >
            {user?.initials || "?"}
          </Link>
        </div>
      </div>
    </header>
  );
}
