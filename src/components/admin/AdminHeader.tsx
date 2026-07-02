"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const breadcrumbLabels: Record<string, string> = {
  "/admin": "Vue d'ensemble",
  "/admin/inscriptions": "Inscriptions",
  "/admin/etudiants": "Étudiants",
  "/admin/codes": "Codes d'accès",
  "/admin/annonces": "Annonces",
  "/admin/statistiques": "Statistiques",
  "/admin/parametres": "Paramètres",
};

export function AdminHeader() {
  const pathname = usePathname();
  const user = useAppStore((s) => s.user);

  const currentLabel = breadcrumbLabels[pathname] || "Administration";

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-white/5 bg-surface/80 backdrop-blur-sm">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex items-center gap-3">
          <span className="text-sm text-star-white font-medium">{currentLabel}</span>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/etudiants"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-violet hover:bg-violet/80 text-white text-sm font-medium transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Créer un compte</span>
          </Link>

          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br from-violet to-magenta">
            {user?.initials || "A"}
          </div>
        </div>
      </div>
    </header>
  );
}
