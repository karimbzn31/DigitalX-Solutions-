"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Command, X, ArrowRight } from "lucide-react";
import Link from "next/link";

const routes = [
  { label: "Accueil", href: "/", desc: "Page d'accueil" },
  { label: "Formation", href: "/#formation", desc: "Découvrir la formation" },
  { label: "Modules", href: "/#modules", desc: "Voir les modules" },
  { label: "Tarifs", href: "/#pricing", desc: "Nos offres" },
  { label: "Blog", href: "/blog", desc: "Articles et tutoriels" },
  { label: "Contact", href: "/contact", desc: "Nous écrire" },
  { label: "Connexion", href: "/login", desc: "Se connecter" },
  { label: "Inscription", href: "/register", desc: "Créer un compte" },
  { label: "Dashboard", href: "/dashboard", desc: "Mon espace" },
];

export function SearchModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 640);
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [open]);

  const filtered = query
    ? routes.filter((r) =>
        r.label.toLowerCase().includes(query.toLowerCase()) ||
        r.desc.toLowerCase().includes(query.toLowerCase())
      )
    : routes;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-void/70 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          {isMobile ? (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 inset-x-0 z-[101]"
            >
              <div
                className="bg-surface border border-white/10 rounded-t-2xl overflow-hidden shadow-2xl"
                style={{ maxHeight: "80vh" }}
              >
                <div className="flex items-center justify-center pt-2 pb-1">
                  <div className="w-10 h-1 rounded-full bg-white/20" />
                </div>
                <div className="flex items-center gap-3 px-5 py-3 border-b border-white/5">
                  <Search className="w-4 h-4 text-mist shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="flex-1 bg-transparent text-sm text-star-white placeholder:text-mist/40 outline-none"
                  />
                  <button onClick={onClose} className="p-1">
                    <X className="w-4 h-4 text-mist" />
                  </button>
                </div>
                <div className="overflow-y-auto p-2" style={{ maxHeight: "calc(80vh - 100px)" }}>
                  {filtered.map((r) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      onClick={onClose}
                      className="flex items-center justify-between px-4 py-3 rounded-lg text-sm hover:bg-violet/10 transition-colors active:bg-violet/20"
                    >
                      <div>
                        <p className="text-star-white font-medium">{r.label}</p>
                        <p className="text-xs text-mist">{r.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-mist/50" />
                    </Link>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-sm text-mist text-center py-8">Aucun résultat</p>
                  )}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: -20 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-lg z-[101] px-4"
            >
              <div className="nebula-card rounded-xl overflow-hidden shadow-2xl">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5">
                  <Search className="w-4 h-4 text-mist shrink-0" />
                  <input
                    ref={inputRef}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Escape") onClose(); }}
                    placeholder="Rechercher..."
                    className="flex-1 bg-transparent text-sm text-star-white placeholder:text-mist/40 outline-none"
                  />
                  <button onClick={onClose} className="p-1 rounded-md hover:bg-white/5 transition-colors">
                    <X className="w-4 h-4 text-mist" />
                  </button>
                </div>
                <div className="max-h-72 overflow-y-auto p-2 scrollbar-thin">
                  {filtered.map((r) => (
                    <Link
                      key={r.href}
                      href={r.href}
                      onClick={onClose}
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm hover:bg-violet/10 transition-colors group"
                    >
                      <div>
                        <p className="text-star-white">{r.label}</p>
                        <p className="text-xs text-mist">{r.desc}</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-mist opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-sm text-mist text-center py-8">Aucun résultat</p>
                  )}
                </div>
                <div className="px-4 py-2.5 border-t border-white/5 flex items-center gap-4 text-[10px] text-mist">
                  <span className="flex items-center gap-1"><Command className="w-3 h-3" />K Ouvrir</span>
                  <span className="flex items-center gap-1"><Command className="w-3 h-3" /><span className="text-xs">↑↓</span> Naviguer</span>
                  <span className="flex items-center gap-1">Esc Fermer</span>
                </div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
}
