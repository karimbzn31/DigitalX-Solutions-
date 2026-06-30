"use client";

"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home,
  BookOpen,
  Play,
  Brain,
  Bot,
  Award,
  BarChart3,
  Settings,
  Bell,
} from "lucide-react";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Logo } from "@/components/shared/Logo";

const navItems = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: BookOpen, label: "Ma Formation", href: "/dashboard/formation" },
  { icon: Play, label: "Vidéos", href: "/dashboard/formation" },
  { icon: Brain, label: "Quiz", href: "/dashboard/quiz" },
  { icon: Bot, label: "Assistant IA", href: "/dashboard/ai" },
  { icon: Award, label: "Certificats", href: "/dashboard/certificates" },
  { icon: BarChart3, label: "Mon Progrès", href: "/dashboard" },
];

export function Sidebar() {
  const pathname = usePathname();
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const notifications = useNotificationStore((s) => s.notifications);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 flex-col bg-surface border-r border-white/5 h-screen sticky top-0">
      <div className="p-4 border-b border-white/5">
        <div className="flex items-center justify-between mb-2">
          <Link href="/dashboard" className="flex items-center gap-2">
            <Logo size={28} />
            <span className="font-display text-star-white font-semibold text-sm">Academy</span>
          </Link>

          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-1.5 rounded-lg hover:bg-violet/10 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4 text-mist" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose text-[8px] flex items-center justify-center font-bold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-80 z-50 nebula-card rounded-xl overflow-hidden shadow-2xl">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-sm font-medium text-star-white">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-[10px] text-violet hover:text-rose transition-colors"
                      >
                        Tout marquer lu
                      </button>
                    )}
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-sm text-mist text-center py-8">Aucune notification</p>
                    ) : (
                      notifications.map((n) => (
                        <button
                          key={n.id}
                          onClick={() => markAsRead(n.id)}
                          className={cn(
                            "w-full text-left px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors",
                            !n.read && "bg-violet/5"
                          )}
                        >
                          <div className="flex items-start gap-3">
                            <div className={cn(
                              "w-2 h-2 rounded-full mt-1.5 shrink-0",
                              n.type === "info" && "bg-violet",
                              n.type === "success" && "bg-green-500",
                              n.type === "warning" && "bg-rose",
                              n.read && "opacity-30"
                            )} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-star-white">{n.title}</p>
                              <p className="text-[11px] text-mist truncate">{n.message}</p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
        <span className="text-xs text-violet">● En ligne</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 text-sm transition-all duration-200 rounded-lg",
                isActive
                  ? "text-violet bg-violet/10"
                  : "text-mist hover:text-star-white hover:bg-violet/5"
              )}
            >
              <item.icon className="w-4 h-4 shrink-0" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 text-sm text-mist hover:text-star-white hover:bg-violet/5 rounded-lg transition-all"
        >
          <Settings className="w-4 h-4 shrink-0" />
          Paramètres
        </Link>
      </div>

      <div className="px-3 pb-3">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet/10 to-magenta/10 border border-violet/10">
          <div className="w-8 h-8 rounded-full bg-violet/20 flex items-center justify-center text-xs font-medium text-violet">
            KB
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-star-white font-medium truncate">Karim B.</p>
            <p className="text-xs text-mist truncate">karim@dx.academy</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
