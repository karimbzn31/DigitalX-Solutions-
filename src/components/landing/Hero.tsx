"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { NebulaButton } from "@/components/shared/NebulaButton";
import { NebulaBadge } from "@/components/shared/NebulaBadge";

const words = ["L'Intelligence Artificielle", "n'est plus l'avenir.", "Elle est le présent."];

const wordVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.12 },
  }),
};

/* ------------------------------------------------------------------ */
/*  Grille de fond dynamique                                          */
/* ------------------------------------------------------------------ */
function GridBackground({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Grille horizontale/verticale */}
      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124,92,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124,92,255,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          transform: `translate(${(mouseX - 0.5) * -8}px, ${(mouseY - 0.5) * -8}px)`,
          transition: "transform 0.15s ease-out",
        }}
      />
      {/* Grille plus fine */}
      <div
        className="absolute inset-0 opacity-[0.008]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(196,92,255,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(196,92,255,1) 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          transform: `translate(${(mouseX - 0.5) * -12}px, ${(mouseY - 0.5) * -12}px)`,
          transition: "transform 0.2s ease-out",
        }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Scan lines subtiles                                                */
/* ------------------------------------------------------------------ */
function ScanLines() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.03]"
      style={{
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(124,92,255,0.3) 2px, rgba(124,92,255,0.3) 3px)",
        backgroundSize: "100% 3px",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Effet spotlight qui suit la souris                                 */
/* ------------------------------------------------------------------ */
function Spotlight({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        background: `radial-gradient(600px circle at ${mouseX * 100}% ${mouseY * 100}%, rgba(124,92,255,0.06), transparent 60%)`,
        transition: "background 0.2s ease-out",
      }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Particules flottantes au-dessus du Hero                            */
/* ------------------------------------------------------------------ */
function FloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-violet/20"
          style={{
            left: `${15 + i * 14}%`,
            top: `${20 + (i % 3) * 25}%`,
          }}
          animate={{
            y: [0, -20 - i * 5, 0],
            opacity: [0.2, 0.6, 0.2],
          }}
          transition={{
            duration: 4 + i * 0.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero principal                                                     */
/* ------------------------------------------------------------------ */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouse({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };
    window.addEventListener("mousemove", handler, { passive: true });
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative min-h-svh flex flex-col items-center justify-center overflow-hidden pt-20 md:pt-24"
    >
      {/* --- Calques de fond --- */}
      <div className="absolute inset-0 bg-gradient-to-b from-violet/[0.04] via-transparent to-transparent pointer-events-none" />
      <GridBackground mouseX={mouse.x} mouseY={mouse.y} />
      <ScanLines />
      <Spotlight mouseX={mouse.x} mouseY={mouse.y} />
      <FloatingParticles />

      {/* Contenu */}
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

        <h1 className="font-display text-4xl sm:text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight leading-[0.95] text-center max-w-5xl">
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
          className="text-sm sm:text-base md:text-lg text-mist text-center max-w-3xl mt-4 md:mt-8 leading-relaxed px-2"
        >
          DigitalX Solutions Academy est une communauté privée dédiée à rendre les technologies
          de l&apos;Intelligence Artificielle accessibles à tous les Algériens. Apprenez à maîtriser
          les outils, les méthodes et les compétences qui façonnent déjà le monde de demain.
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
            <NebulaButton variant="secondary" size="lg" className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 text-sm md:text-base">
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

        {/* Terminal */}
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
