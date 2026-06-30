"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Menu, X, Search, Command } from "lucide-react";
import { useScrolled } from "@/hooks/useScrolled";
import { useSearchStore } from "@/store/useSearchStore";
import { cn } from "@/lib/utils";
import { NebulaButton } from "@/components/shared/NebulaButton";
import { Logo } from "@/components/shared/Logo";

const links = [
  { label: "Accueil", href: "/" },
  { label: "Formation", href: "/#formation" },
  { label: "Modules", href: "/#modules" },
  { label: "Blog", href: "/blog" },
  { label: "Tarifs", href: "/#pricing" },
];

export function Navbar() {
  const scrolled = useScrolled(40);
  const [mobileOpen, setMobileOpen] = useState(false);

  const openSearch = () => useSearchStore.getState().setOpen(true);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-surface/80 backdrop-blur-xl border-b border-white/5"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <Logo size={32} />
            <span className="text-sm text-mist font-medium">
              DigitalXSolutions Academy
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-mist hover:text-star-white transition-colors relative py-1 group"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-violet opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={openSearch}
              aria-label="Rechercher"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs text-mist hover:text-star-white hover:bg-white/5 transition-colors border border-white/5"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Rechercher</span>
              <kbd className="hidden lg:flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-mist">
                <Command className="w-2.5 h-2.5" />K
              </kbd>
            </button>
            <Link href="/login">
              <NebulaButton variant="ghost" size="sm">Connexion</NebulaButton>
            </Link>
            <Link href="#pricing">
              <NebulaButton size="sm">Rejoindre</NebulaButton>
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-mist hover:text-star-white"
            aria-label={mobileOpen ? "Fermer" : "Menu"}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-surface/95 backdrop-blur-2xl border-t border-white/5"
          >
            <div className="px-4 py-8 space-y-6">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="block text-sm text-mist hover:text-star-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="pt-6 border-t border-white/10 flex flex-col gap-3">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <NebulaButton variant="ghost" className="w-full">Connexion</NebulaButton>
                </Link>
                <Link href="#pricing" onClick={() => setMobileOpen(false)}>
                  <NebulaButton className="w-full">Rejoindre</NebulaButton>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
