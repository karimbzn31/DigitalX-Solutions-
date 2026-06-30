"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NebulaButton } from "@/components/shared/NebulaButton";
import { NebulaBadge } from "@/components/shared/NebulaBadge";

const words = ["Transformez", "vos idées", "en startup grâce à l'IA"];

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
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-24">
      <div className="absolute inset-0 bg-gradient-to-b from-violet/[0.04] via-transparent to-transparent pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center w-full px-4 py-20 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <NebulaBadge variant="violet" className="mb-8 px-4 py-1.5 text-sm">
            ✦ Nouvelle formation · Cohorte 2025
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
          className="text-base md:text-lg text-mist text-center max-w-2xl mt-8 leading-relaxed"
        >
          Maîtrisez l&apos;Intelligence Artificielle, le Vibe Coding et le développement SaaS.
          <br />
          Construisez des produits réels. Lancez votre startup.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-10"
        >
          <Link href="#pricing">
            <NebulaButton size="lg" className="px-8 py-4 text-base">
              Rejoindre la formation →
            </NebulaButton>
          </Link>
          <Link href="#formation">
            <NebulaButton variant="secondary" size="lg">
              Voir le programme
            </NebulaButton>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="flex items-center gap-4 mt-8 text-sm text-mist"
        >
          <div className="flex -space-x-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border border-violet/30 bg-surface flex items-center justify-center text-xs text-violet"
              >
                {String.fromCharCode(65 + i)}
              </div>
            ))}
          </div>
          <span>
            ★★★★★ Rejoins plus de <strong className="text-star-white">1 200 apprenants</strong> · Algérie & international
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="w-full max-w-4xl mx-auto mt-20"
        >
          <div className="nebula-glass rounded-[0.75rem] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-surface border-b border-white/5">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <span className="text-xs text-mist ml-2">terminal — vibe-coding</span>
            </div>
            <div className="p-5 font-mono text-sm leading-relaxed space-y-2 bg-surface/30">
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
