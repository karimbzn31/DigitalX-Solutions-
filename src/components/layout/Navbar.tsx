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

const menuVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const linkItemVariants = {
  hidden: { x: -30, opacity: 0 },
  visible: (i: number) => ({
    x: 0,
    opacity: 1,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.06 },
  }),
};

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
            <Logo size={32} scrolled={scrolled} />
            <span className="hidden sm:block text-sm text-mist font-medium">
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
            <Link href="/register">
              <NebulaButton size="sm">Rejoindre</NebulaButton>
            </Link>
          </div>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden relative z-[60] p-2 text-mist hover:text-star-white"
            aria-label={mobileOpen ? "Fermer" : "Menu"}
          >
            <motion.div
              animate={{ rotate: mobileOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </motion.div>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-0 z-[55] md:hidden"
          >
            <div className="absolute inset-0 bg-void/90 backdrop-blur-2xl" />
            <div className="relative h-full flex flex-col justify-center px-8">
              <nav className="space-y-1">
                {links.map((link, i) => (
                  <motion.div
                    key={link.href}
                    custom={i}
                    variants={linkItemVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="block text-2xl font-display font-semibold text-star-white hover:text-violet transition-colors py-3"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="mt-10 pt-8 border-t border-white/10"
              >
                <div className="flex flex-col gap-3">
                  <Link href="/login" onClick={() => setMobileOpen(false)}>
                    <NebulaButton variant="ghost" className="w-full">Connexion</NebulaButton>
                  </Link>
                  <Link href="/register" onClick={() => setMobileOpen(false)}>
                    <NebulaButton className="w-full">Rejoindre</NebulaButton>
                  </Link>
                </div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
