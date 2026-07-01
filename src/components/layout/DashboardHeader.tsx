"use client";
import Link from "next/link";
import { Bell, Search, Command } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useNotificationStore } from "@/store/useNotificationStore";
import { useSearchStore } from "@/store/useSearchStore";

export function DashboardHeader() {
  const user = useAppStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const setSearchOpen = useSearchStore((s) => s.setOpen);

  return (
    <header className="sticky top-0 z-30 border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-surface">
        <div />

        <div className="flex items-center gap-3">
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
