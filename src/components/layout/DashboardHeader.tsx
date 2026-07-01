"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Bell, Search, Command } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useNotificationStore } from "@/store/useNotificationStore";

const breadcrumbMap: Record<string, string> = {
  "/dashboard": "Accueil",
  "/dashboard/formation": "Ma Formation",
  "/dashboard/bibliotheque": "Bibliothèque",
  "/dashboard/communaute": "Communauté",
  "/dashboard/ai": "Assistant IA",
  "/dashboard/certificats": "Certificats",
  "/dashboard/parametres": "Paramètres",
  "/dashboard/profile": "Profil",
};

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const pathname = usePathname();
  const user = useAppStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  const currentPage = breadcrumbMap[pathname] || "Dashboard";

  return (
    <header className="sticky top-0 z-30 bg-void/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button onClick={onMenuClick} className="md:hidden p-2 text-mist hover:text-star-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          )}
          <div>
            <p className="text-xs text-mist">Dashboard</p>
            <h1 className="text-sm font-semibold text-star-white">{currentPage}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-mist hover:text-star-white hover:bg-white/5 transition-colors border border-white/5">
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Rechercher</span>
            <kbd className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-mist"><Command className="w-2.5 h-2.5" />K</kbd>
          </button>

          <button className="relative p-2 text-mist hover:text-star-white hover:bg-white/5 rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose text-[8px] flex items-center justify-center font-bold text-white">{unreadCount > 9 ? "9+" : unreadCount}</span>}
          </button>

          <Link href="/dashboard/profile" className="w-8 h-8 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-xs font-bold text-white hover:brightness-110 transition-all">
            {user?.initials || "?"}
          </Link>
        </div>
      </div>
    </header>
  );
}
