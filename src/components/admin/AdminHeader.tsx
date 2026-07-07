"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Plus, LogOut } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import { supabase } from "@/lib/supabase";

const breadcrumbLabels: Record<string, string> = {
  "/admin": "Vue d'ensemble",
  "/admin/inscriptions": "Inscriptions",
  "/admin/etudiants": "Étudiants",
  "/admin/codes": "Codes d'accès",
  "/admin/ressources": "Ressources",
  "/admin/statistiques": "Statistiques",
  "/admin/parametres": "Paramètres",
};

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAppStore((s) => s.user);
  const setUser = useAppStore((s) => s.setUser);

  const currentLabel = breadcrumbLabels[pathname] || "Administration";

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-surface/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-star-white font-medium">{currentLabel}</span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/admin/etudiants"
            className="hidden sm:flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet hover:bg-violet/80 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Gérer les étudiants</span>
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg bg-white/5 hover:bg-rose/10 border border-white/10 hover:border-rose/20 text-mist hover:text-rose transition-all text-xs sm:text-sm"
            title="Se déconnecter"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Déconnexion</span>
          </button>

          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-violet to-magenta">
            {user?.initials || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
