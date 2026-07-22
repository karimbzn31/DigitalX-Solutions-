"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Zap, Flame } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useGamificationStore } from "@/store/useGamificationStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useTranslation } from "@/lib/useTranslation";
import { LangSwitch } from "@/components/shared/LangSwitch";
import { LogoFull } from "@/components/shared/Logo";

export function DashboardHeader() {
  const pathname = usePathname();
  const user = useAppStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const xp = useGamificationStore((s) => s.xp);
  const streak = useGamificationStore((s) => s.streak);
  const { t } = useTranslation();

  const breadcrumbLabels: Record<string, string> = {
    "/dashboard": t("dashboard.accueil"),
    "/dashboard/formation": t("dashboard.nosFormations"),
    "/dashboard/bibliotheque": t("dashboard.bibliotheque"),
    "/dashboard/communaute": t("dashboard.communaute"),
    "/dashboard/ai": t("dashboard.assistantIA"),
    "/dashboard/certificats": t("dashboard.certificats"),
    "/dashboard/parametres": t("dashboard.parametres"),
  };

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

        <div className="flex items-center gap-2">
          <LangSwitch />
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
