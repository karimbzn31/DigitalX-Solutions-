"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Bot, Award, Library } from "lucide-react";
import { useTranslation } from "@/lib/useTranslation";

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const items = [
    { icon: Home, label: t("dashboard.accueil"), href: "/dashboard" },
    { icon: BookOpen, label: t("dashboard.mesFormations"), href: "/dashboard/formation" },
    { icon: Library, label: t("dashboard.bibliotheque"), href: "/dashboard/bibliotheque" },
    { icon: Bot, label: t("dashboard.digitalXIA"), href: "/dashboard/ai" },
    { icon: Award, label: t("dashboard.certificats"), href: "/dashboard/certificats" },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors",
                isActive ? "text-violet" : "text-mist"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
