"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, BookOpen, Bot, Award, Library } from "lucide-react";

const items = [
  { icon: Home, label: "Accueil", href: "/dashboard" },
  { icon: BookOpen, label: "Formation", href: "/dashboard/formation" },
  { icon: Library, label: "Bibliothèque", href: "/dashboard/bibliotheque" },
  { icon: Bot, label: "DigitalX IA", href: "/dashboard/ai" },
  { icon: Award, label: "Certificats", href: "/dashboard/certificats" },
];

export function BottomNav() {
  const pathname = usePathname();

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
