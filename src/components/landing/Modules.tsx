"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, Clock, BarChart3 } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NebulaBadge } from "@/components/shared/NebulaBadge";
import { modules } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function Modules() {
  const [openId, setOpenId] = useState<string | null>("1");

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
            {modules.map((mod) => {
              const isOpen = openId === mod.id;
              return (
                <div
                  key={mod.id}
                  onClick={() => setOpenId(isOpen ? null : mod.id)}
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
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-4 h-4 text-mist" />
                      </motion.div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="px-4 pb-6 space-y-4">
                          {mod.description && (
                            <p className="text-sm text-mist leading-relaxed">{mod.description}</p>
                          )}
                          <div className="flex flex-wrap gap-4">
                            <span className="flex items-center gap-1.5 text-xs text-mist">
                              <Play className="w-3.5 h-3.5 text-violet" /> {mod.videos} vidéos
                            </span>
                            <span className="flex items-center gap-1.5 text-xs text-mist">
                              <Clock className="w-3.5 h-3.5 text-violet" /> {mod.duration}
                            </span>
                            {mod.level && (
                              <span className="flex items-center gap-1.5 text-xs text-mist">
                                <BarChart3 className="w-3.5 h-3.5 text-violet" /> {mod.level}
                              </span>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="hidden lg:flex flex-col items-center justify-center gap-6 sticky top-32 h-fit">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => setOpenId(mod.id)}
                className="transition-all duration-200 relative flex items-center gap-3"
              >
                <span className={cn(
                  "w-2.5 h-2.5 rounded-full border-2 transition-all duration-200",
                  openId === mod.id
                    ? "bg-violet border-violet shadow-[0_0_8px_rgba(124,92,255,0.3)]"
                    : "bg-transparent border-white/20"
                )} />
                <span className={cn(
                  "text-xs transition-colors",
                  openId === mod.id ? "text-violet" : "text-mist/40"
                )}>
                  {mod.id.padStart(2, "0")}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
