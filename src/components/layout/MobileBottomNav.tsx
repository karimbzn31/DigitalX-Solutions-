"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, BookOpen, Brain, Bot, Award } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: BookOpen, label: "Formation", href: "/dashboard/formation" },
  { icon: Brain, label: "Quiz", href: "/dashboard/quiz" },
  { icon: Bot, label: "IA", href: "/dashboard/ai" },
  { icon: Award, label: "Certificats", href: "/dashboard/certificates" },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 md:hidden bg-surface/90 backdrop-blur-xl border-t border-white/5 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 py-2 px-3 rounded-lg transition-all duration-200",
                isActive ? "text-violet" : "text-mist hover:text-star-white"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
