"use client";
import { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/lib/useTranslation";

interface Particle {
  x: number;
  y: number;
  size: number;
  speed: number;
  opacity: number;
  hue: number;
}

function HeroParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const particles = useMemo(() => {
    const items: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      items.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 240,
      });
    }
    return items;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      time += 0.005;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;

      for (const p of particles) {
        const x = (p.x + Math.sin(time * p.speed + p.y) * 3) * w / 100;
        const y = (p.y + Math.cos(time * p.speed + p.x) * 3) * h / 100;
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 70%, ${p.opacity})`;
        ctx.fill();
      }

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [particles]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ width: "100%", height: "100%" }}
    />
  );
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

const quotes = [
  "Le Vibe Coding n'est pas une compétence, c'est un super-pouvoir. 🚀",
  "Chaque ligne de code générée par l'IA est une victoire sur l'impossible.",
  "L'IA ne remplace pas les développeurs, elle les démultiplie. ⚡",
  "Un SaaS réussi commence par une idée simple et une exécution parfaite.",
  "Les agents IA sont les nouveaux employés du futur. Forme-les aujourd'hui.",
  "Dans la formation, la persévérance bat le talent.",
];

interface HeroSectionProps {
  name?: string;
  level?: string;
  progress?: number;
  xp?: number;
  streak?: number;
}

export function HeroSection({ name = "Apprenant", level = "Apprenti IA", progress = 0 }: HeroSectionProps) {
  const { t } = useTranslation();
  const greeting = getGreeting();
  const quote = useMemo(() => quotes[Math.floor(Math.random() * quotes.length)], []);

  const firstName = name.split(" ")[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-gradient-to-br from-violet/[0.12] via-magenta/[0.06] to-rose/[0.04] p-6 sm:p-8"
    >
      <HeroParticles />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm text-mist"
            >
              {greeting} 👋
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl font-bold text-star-white"
            >
              {firstName}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2"
            >
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-violet/20 text-violet text-xs font-medium border border-violet/20">
                {level}
              </span>
            </motion.div>
          </div>

          {progress > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="shrink-0 text-center"
            >
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center border-2 font-bold text-lg",
                progress >= 80 ? "border-emerald-400 text-emerald-400" :
                progress >= 40 ? "border-violet text-violet" :
                "border-mist text-mist"
              )}>
                {Math.round(progress)}%
              </div>
              <p className="text-[10px] text-mist mt-1">Global</p>
            </motion.div>
          )}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-4 text-xs text-mist/70 italic border-l-2 border-violet/30 pl-3"
        >
          {quote}
        </motion.p>
      </div>
    </motion.div>
  );
}
