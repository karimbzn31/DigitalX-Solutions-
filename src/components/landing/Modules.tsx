"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, BarChart3, X } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NebulaBadge } from "@/components/shared/NebulaBadge";
import { modules } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as const } },
  exit: { opacity: 0, scale: 0.95, y: 20, transition: { duration: 0.2 } },
};

export function Modules() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = modules.find((m) => m.id === selectedId);

  useEffect(() => {
    if (!selectedId) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedId(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId]);

  return (
    <section id="modules" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Modules"
          title="6 modules. Une transformation complète."
          subtitle="De l'initiation à l'IA jusqu'au lancement de votre startup, chaque module est conçu pour vous faire passer à l'action."
        />

        <div className="flex gap-8">
          <div className="flex-1 space-y-0">
            {modules.map((mod) => (
              <div
                key={mod.id}
                onClick={() => setSelectedId(mod.id)}
                className="border-b border-white/5 hover:bg-violet/[0.02] transition-colors cursor-pointer group"
              >
                <div className="flex items-center justify-between py-5 px-4">
                  <NebulaBadge variant="violet" className="shrink-0">Module {mod.id}</NebulaBadge>
                  <span className="font-display text-star-white font-semibold tracking-tight flex-1 ml-6 text-base">
                    {mod.title}
                  </span>
                  <div className="flex items-center gap-3">
                    {mod.level && (
                      <NebulaBadge variant={mod.level === "Débutant" ? "default" : "violet"} className="hidden sm:inline-flex">
                        {mod.level}
                      </NebulaBadge>
                    )}
                    <span className="text-xs text-violet opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      Voir plus
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center gap-6 sticky top-32 h-fit">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setSelectedId(mod.id)}
                className="transition-all duration-200 relative flex items-center gap-3"
              >
                <span className={cn(
                  "w-2.5 h-2.5 rounded-full border-2 transition-all duration-200",
                  selectedId === mod.id
                    ? "bg-violet border-violet shadow-[0_0_8px_rgba(124,92,255,0.3)]"
                    : "bg-transparent border-white/20"
                )} />
                <span className={cn(
                  "text-xs transition-colors",
                  selectedId === mod.id ? "text-violet" : "text-mist/40"
                )}>
                  {mod.id.padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {selected && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
          >
            <div
              className="absolute inset-0 bg-void/80 backdrop-blur-sm"
              onClick={() => setSelectedId(null)}
            />

            <motion.div
              variants={modalVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="relative w-full max-w-lg max-h-[85vh] overflow-y-auto scrollbar-thin"
            >
              <div className="relative rounded-xl p-[1px] overflow-hidden"
                style={{ background: "linear-gradient(135deg, #7C5CFF 0%, #C45CFF 50%, #FF6FB8 100%)" }}
              >
                <div className="bg-surface p-6 sm:p-8 rounded-xl relative">
                  <button
                    onClick={() => setSelectedId(null)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-mist hover:text-star-white hover:bg-white/10 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-4">
                    <NebulaBadge variant="violet">Module {selected.id}</NebulaBadge>
                    {selected.level && (
                      <NebulaBadge variant={selected.level === "Débutant" ? "default" : "violet"}>
                        {selected.level}
                      </NebulaBadge>
                    )}
                  </div>

                  <h3 className="font-display text-xl sm:text-2xl font-bold text-star-white tracking-tight mb-5 pr-8">
                    {selected.title}
                  </h3>

                  <div className="flex flex-wrap gap-4 mb-5 pb-5 border-b border-white/5">
                    <span className="flex items-center gap-1.5 text-xs text-mist">
                      <Play className="w-3.5 h-3.5 text-violet" /> {selected.videos} vidéos
                    </span>
                    <span className="flex items-center gap-1.5 text-xs text-mist">
                      <Clock className="w-3.5 h-3.5 text-violet" /> {selected.duration}
                    </span>
                    {selected.level && (
                      <span className="flex items-center gap-1.5 text-xs text-mist">
                        <BarChart3 className="w-3.5 h-3.5 text-violet" /> {selected.level}
                      </span>
                    )}
                  </div>

                  {selected.description && (
                    <div className="text-sm text-mist leading-relaxed space-y-3">
                      {selected.description.split("\n").map((paragraph, i) => {
                        const trimmed = paragraph.trim();
                        if (!trimmed) return null;
                        if (trimmed.startsWith("• ") || trimmed.startsWith("👁️") || trimmed.startsWith("🎙️") || trimmed.startsWith("🇩🇿") || trimmed.startsWith("💬") || trimmed.startsWith("Facebook") || trimmed.startsWith("Instagram") || trimmed.startsWith("WhatsApp")) {
                          return (
                            <p key={i} className="flex items-start gap-2">
                              <span className="text-violet mt-1 shrink-0">✦</span>
                              <span>{trimmed}</span>
                            </p>
                          );
                        }
                        return <p key={i}>{trimmed}</p>;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
