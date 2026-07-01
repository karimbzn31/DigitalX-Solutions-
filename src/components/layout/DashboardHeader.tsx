"use client";
import Link from "next/link";
import { Bell, Search, Command } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { useNotificationStore } from "@/store/useNotificationStore";

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const user = useAppStore((s) => s.user);
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <header className="sticky top-0 z-30 border-b border-white/5">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8" style={{ background: "#110D1F" }}>
        <div className="flex items-center gap-3">
          {onMenuClick && (
            <button onClick={onMenuClick} className="md:hidden p-2 text-mist hover:text-star-white">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          )}
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7C5CFF, #C45CFF)" }}>
              <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
                <path d="M12 12L20 20L28 12" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 28L20 20L28 28" stroke="white" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.6" />
              </svg>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs hover:text-star-white transition-colors border" style={{ color: "#9C93B8", borderColor: "rgba(255,255,255,0.06)" }}>
            <Search className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Rechercher</span>
            <kbd className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#9C93B8" }}><Command className="w-2.5 h-2.5" />K</kbd>
          </button>

          <button className="relative p-2 hover:bg-white/5 rounded-lg transition-colors" style={{ color: "#9C93B8" }}>
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-bold text-white" style={{ background: "#FF6FB8" }}>{unreadCount > 9 ? "9+" : unreadCount}</span>}
          </button>

          <Link href="/dashboard/profile" className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: "linear-gradient(135deg, #7C5CFF, #C45CFF)" }}>
            {user?.initials || "?"}
          </Link>
        </div>
      </div>
    </header>
  );
}
