"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play, Clock, BarChart3, X, Sparkles, BookOpen,
  Layers, ArrowUpRight, GraduationCap,
} from "lucide-react";
import { modules } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import type { Module } from "@/types";

// ─── Module card colors ──────────────────────────────────────────────
const MODULE_STYLES: Record<string, { accent: string; gradient: string; icon: string }> = {
  "1": { accent: "violet", gradient: "from-violet/20 via-magenta/10 to-transparent", icon: "🤖" },
  "2": { accent: "cyan", gradient: "from-cyan-soft/20 via-violet/10 to-transparent", icon: "🎨" },
  "3": { accent: "rose", gradient: "from-rose/20 via-magenta/10 to-transparent", icon: "🧠" },
  "4": { accent: "emerald", gradient: "from-emerald-400/15 via-cyan-soft/10 to-transparent", icon: "🚀" },
  "5": { accent: "magenta", gradient: "from-magenta/20 via-violet/10 to-transparent", icon: "💻" },
  "6": { accent: "amber", gradient: "from-amber-400/15 via-violet/10 to-transparent", icon: "💡" },
};

const LEVEL_COLORS: Record<string, string> = {
  "Débutant": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "Intermédiaire": "text-amber-400 bg-amber-500/10 border-amber-500/20",
  "Avancé": "text-rose-400 bg-rose-500/10 border-rose-500/20",
  "Tous": "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
};

const LEVEL_ICONS: Record<string, string> = {
  "Débutant": "🌱",
  "Intermédiaire": "🔥",
  "Avancé": "⚡",
  "Tous": "🌟",
};

// ─── Module Card ─────────────────────────────────────────────────────
function ModuleCard({
  mod,
  index,
  onSelect,
}: {
  mod: Module;
  index: number;
  onSelect: (id: string) => void;
}) {
  const style = MODULE_STYLES[mod.id] || MODULE_STYLES["1"];
  const level = mod.level || "Débutant";
  const levelColor = LEVEL_COLORS[level] || LEVEL_COLORS["Débutant"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => onSelect(mod.id)}
      className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-surface/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet/40 cursor-pointer"
    >
      {/* Glow radial au hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at 50% -20%, ${mod.color?.from || "#7C5CFF"}22, transparent 60%)`,
        }}
      />

      {/* Header gradient */}
      <div
        className="h-1.5 w-full"
        style={{
          background: `linear-gradient(90deg, ${mod.color?.from || "#7C5CFF"}, ${mod.color?.to || "#C45CFF"})`,
        }}
      />

      <div className="relative z-10 p-5 sm:p-6">
        {/* Icon + Badge */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg shrink-0"
              style={{
                background: `linear-gradient(135deg, ${mod.color?.from || "#7C5CFF"}25, ${mod.color?.to || "#C45CFF"}15)`,
                border: `1px solid ${mod.color?.from || "#7C5CFF"}30`,
              }}
            >
              {style.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-violet uppercase tracking-wider">
                  Module {mod.id}
                </span>
                <span className={cn(
                  "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium border",
                  levelColor,
                )}>
                  {LEVEL_ICONS[level] || "🌟"} {level}
                </span>
              </div>
              <h3 className="font-display font-semibold text-star-white mt-1 leading-snug text-sm sm:text-base">
                {mod.title}
              </h3>
            </div>
          </div>

          {/* Arrow */}
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 opacity-0 group-hover:opacity-100"
            style={{
              background: `${mod.color?.from || "#7C5CFF"}15`,
              transform: "translateX(0)",
            }}
          >
            <ArrowUpRight className="w-4 h-4" style={{ color: mod.color?.from || "#7C5CFF" }} />
          </div>
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 py-3 mt-2 border-t border-white/[0.06]">
          <div className="flex items-center gap-1.5">
            <Play className="w-3.5 h-3.5 shrink-0" style={{ color: mod.color?.from || "#7C5CFF" }} />
            <span className="text-[11px] text-mist">{mod.videos} vidéos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: mod.color?.from || "#7C5CFF" }} />
            <span className="text-[11px] text-mist">{mod.duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 shrink-0" style={{ color: mod.color?.from || "#7C5CFF" }} />
            <span className="text-[11px] text-mist">{level}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Modal Détails Module ────────────────────────────────────────────
function ModuleModal({
  mod,
  onClose,
}: {
  mod: Module;
  onClose: () => void;
}) {
  const style = MODULE_STYLES[mod.id] || MODULE_STYLES["1"];
  const level = mod.level || "Débutant";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6"
    >
      <div className="absolute inset-0 bg-void/80 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-2xl max-h-[85vh] overflow-y-auto scrollbar-thin"
      >
        <div
          className="relative rounded-xl p-[1px] overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${mod.color?.from || "#7C5CFF"} 0%, ${mod.color?.to || "#C45CFF"} 50%, #FF6FB8 100%)`,
          }}
        >
          <div className="bg-surface p-6 sm:p-8 rounded-xl relative">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-mist hover:text-star-white hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${mod.color?.from || "#7C5CFF"}25, ${mod.color?.to || "#C45CFF"}15)`,
                  border: `1px solid ${mod.color?.from || "#7C5CFF"}30`,
                }}
              >
                {style.icon}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-violet uppercase tracking-wider">
                    Module {mod.id}
                  </span>
                  <span className={cn(
                    "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border",
                    LEVEL_COLORS[level] || LEVEL_COLORS["Débutant"],
                  )}>
                    {LEVEL_ICONS[level] || "🌟"} {level}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-star-white mt-0.5">
                  {mod.title}
                </h3>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 mb-5 pb-5 border-b border-white/5">
              <span className="flex items-center gap-1.5 text-xs text-mist">
                <Play className="w-3.5 h-3.5" style={{ color: mod.color?.from || "#7C5CFF" }} />
                {mod.videos} vidéos
              </span>
              <span className="flex items-center gap-1.5 text-xs text-mist">
                <Clock className="w-3.5 h-3.5" style={{ color: mod.color?.from || "#7C5CFF" }} />
                {mod.duration}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-mist">
                <BarChart3 className="w-3.5 h-3.5" style={{ color: mod.color?.from || "#7C5CFF" }} />
                {level}
              </span>
            </div>

            {/* Description */}
            {mod.description && (
              <div className="text-sm text-mist leading-relaxed space-y-3">
                {mod.description.split("\n").map((paragraph, i) => {
                  const trimmed = paragraph.trim();
                  if (!trimmed) return null;
                  const isBullet = trimmed.startsWith("• ") || trimmed.startsWith("👁️") || trimmed.startsWith("🎙️") || trimmed.startsWith("🇩🇿") || trimmed.startsWith("💬") || trimmed.startsWith("Facebook") || trimmed.startsWith("Instagram") || trimmed.startsWith("WhatsApp");
                  return (
                    <p key={i} className={isBullet ? "flex items-start gap-2" : ""}>
                      {isBullet ? (
                        <>
                          <span className="text-violet mt-1 shrink-0">✦</span>
                          <span>{trimmed}</span>
                        </>
                      ) : trimmed}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Section principale ──────────────────────────────────────────────
export function Modules() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = modules.find((m) => m.id === selectedId);

  useEffect(() => {
    if (!selectedId) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSelectedId(null); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [selectedId]);

  const totalVideos = modules.reduce((sum, m) => sum + m.videos, 0);

  return (
    <section id="modules" className="py-24 lg:py-32 relative overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute top-1/2 left-1/3 w-[600px] h-[600px] rounded-full bg-violet/5 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 right-1/4 w-[400px] h-[400px] rounded-full bg-magenta/5 blur-[100px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet/15 border border-violet/20 text-violet text-xs font-medium mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              Parcours 2026
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight text-star-white">
              <span className="text-gradient">6 modules</span>. Une transformation complète.
            </h2>
            <p className="mt-4 text-sm sm:text-base text-mist max-w-2xl mx-auto leading-relaxed">
              De l&apos;initiation à l&apos;IA jusqu&apos;au lancement de votre startup,
              chaque module est conçu pour vous faire passer à l&apos;action.
            </p>
          </motion.div>

          {/* Stats mini */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="mt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-6"
          >
            <div className="flex items-center gap-2 text-xs text-mist">
              <Layers className="w-4 h-4 text-violet" />
              <span><strong className="text-star-white">{modules.length}</strong> modules</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-mist">
              <BookOpen className="w-4 h-4 text-cyan-soft" />
              <span><strong className="text-star-white">{totalVideos}</strong> vidéos</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-mist">
              <GraduationCap className="w-4 h-4 text-emerald-400" />
              <span><strong className="text-star-white">Certificat</strong> à la clé</span>
            </div>
          </motion.div>
        </div>

        {/* Grid des modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {modules.map((mod, index) => (
            <ModuleCard
              key={mod.id}
              mod={mod}
              index={index}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </div>

      {/* Modal détails */}
      <AnimatePresence>
        {selected && (
          <ModuleModal mod={selected} onClose={() => setSelectedId(null)} />
        )}
      </AnimatePresence>
    </section>
  );
}
