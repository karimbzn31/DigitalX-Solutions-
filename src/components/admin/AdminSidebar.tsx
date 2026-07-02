"use client";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import {
  Home, UserPlus, Users, Key, Megaphone, BarChart3, Settings, LogOut, Shield
} from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";
import { LogoFull } from "@/components/shared/Logo";

const navItems = [
  { icon: Home, label: "Vue d'ensemble", href: "/admin" },
  { icon: UserPlus, label: "Inscriptions", href: "/admin/inscriptions", badge: true },
  { icon: Users, label: "Étudiants", href: "/admin/etudiants" },
  { icon: Key, label: "Codes d'accès", href: "/admin/codes" },
  { icon: Megaphone, label: "Annonces", href: "/admin/annonces" },
  { icon: BarChart3, label: "Statistiques", href: "/admin/statistiques" },
  { icon: Settings, label: "Paramètres", href: "/admin/parametres" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);

  const [pendingCount] = useState(5);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex md:w-64 flex-col bg-surface border-r border-white/5 h-screen sticky top-0 z-30">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <Link href="/admin" className="flex items-center gap-2">
          <LogoFull />
        </Link>
      </div>

      <div className="px-3 pt-3 pb-2">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet/10 border border-violet/20 w-fit">
          <Shield className="w-3.5 h-3.5 text-violet" />
          <span className="text-[10px] font-semibold text-violet tracking-wide uppercase">Administrateur</span>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href));
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
              <span className="flex-1">{item.label}</span>
              {item.badge && pendingCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-rose text-[10px] font-bold text-white flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/5">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-violet/10 to-magenta/10 border border-violet/10 mb-2">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-xs font-bold text-white shrink-0">
            {user?.initials || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm text-star-white font-medium truncate">{user?.name || "Admin"}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 text-sm text-mist hover:text-rose hover:bg-rose/5 rounded-xl transition-colors w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          <span>Se déconnecter</span>
        </button>
      </div>
    </aside>
  );
}
