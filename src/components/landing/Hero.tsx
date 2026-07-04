"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NebulaButton } from "@/components/shared/NebulaButton";
import { NebulaBadge } from "@/components/shared/NebulaBadge";

const words = ["Ton IA travaille", "pendant que tu dors"];

const wordVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.12 },
  }),
};

export function Hero() {
  return (
    <section className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden pt-20 md:pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-violet/[0.04] via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-12 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <NebulaBadge variant="violet" className="mb-6 md:mb-8 px-3 md:px-4 py-1 text-xs md:text-sm">
            ✦ DigitalX Solutions Academy · Cohorte 2026
          </NebulaBadge>
        </motion.div>

        <h1 className="font-display text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] text-center max-w-5xl">
          {words.map((word, i) => (
            <motion.span
              key={word}
              custom={i}
              initial="hidden"
              animate="visible"
              variants={wordVariants}
              className="block text-star-white"
            >
              {i === 2 ? (
                <span className="text-gradient">{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-sm sm:text-base md:text-lg text-mist text-center max-w-2xl mt-4 md:mt-8 leading-relaxed px-2"
        >
          Crée des agents IA autonomes, lance des SaaS, automatise des workflows N8N
          <br className="hidden sm:block" />
          et crée ta propre startup. Sans payer un sous. L&apos;IA est ton meilleur investissement.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 mt-6 md:mt-10 w-full sm:w-auto px-4 sm:px-0"
        >
          <Link href="/register" className="w-full sm:w-auto">
            <NebulaButton size="lg" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-sm md:text-base">
              🚀 Accéder à l&apos;académie →
            </NebulaButton>
          </Link>
          <Link href="#formation" className="w-full sm:w-auto">
            <NebulaButton variant="secondary" size="lg" className="w-full sm:w-auto">
              📋 Voir les formations
            </NebulaButton>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-6 md:mt-8 text-xs md:text-sm text-mist"
        >
          <div className="flex -space-x-2">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-violet/30 bg-surface flex items-center justify-center text-[10px] md:text-xs text-violet"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <span className="text-center sm:text-left">
            ★★★★★ <strong className="text-star-white">1 200+ apprenants</strong> · Algérie & international
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="w-full max-w-4xl mx-auto mt-12 md:mt-20 px-2 sm:px-0"
        >
          <div className="nebula-glass rounded-[0.75rem] overflow-hidden">
            <div className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3 bg-surface border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80" />
                <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-[10px] md:text-xs text-mist ml-2">terminal — vibe-coding</span>
            </div>
            <div className="p-3 md:p-5 font-mono text-[11px] md:text-sm leading-relaxed space-y-1.5 md:space-y-2 bg-surface/30">
              <p><span className="text-violet">$</span> <span className="text-star-white">dx init agent-ia</span></p>
              <p className="text-mist">{">"} Création de l&apos;environnement de développement...</p>
              <p><span className="text-emerald-400">✓</span> <span className="text-emerald-400/90">Projet initialisé avec Next.js 14</span></p>
              <p><span className="text-violet">$</span> <span className="text-star-white">npm run dev</span></p>
              <p className="text-mist">{">"} Démarrage du serveur de développement...</p>
              <p className="text-cyan-soft">{">"} ready - started server on http://localhost:3000</p>
              <p className="text-mist animate-pulse">▌</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
