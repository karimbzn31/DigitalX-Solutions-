"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Home, Users, BookOpen, Bell, Shield } from "lucide-react";
import { Logo } from "@/components/shared/Logo";

const adminNav = [
  { icon: Home, label: "Vue d'ensemble", href: "/admin" },
  { icon: Shield, label: "Validations", href: "/admin/validations" },
  { icon: Users, label: "Étudiants", href: "/admin/students" },
  { icon: BookOpen, label: "Formations", href: "/admin/formations" },
  { icon: Bell, label: "Annonces", href: "/admin/announcements" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex md:w-60 lg:w-64 flex-col bg-surface border-r border-white/5 h-screen sticky top-0">
      <div className="p-4 border-b border-white/5">
        <Link href="/" className="flex items-center gap-2 mb-2">
          <Logo size={28} />
          <span className="font-display text-star-white font-semibold text-sm">Admin</span>
        </Link>
        <span className="text-xs text-violet">● Panel admin</span>
      </div>

      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5 scrollbar-thin">
        {adminNav.map((item) => {
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


    </aside>
  );
}
