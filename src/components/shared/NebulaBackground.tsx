"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";

/* ------------------------------------------------------------------ */
/*  Masses floues                                                      */
/* ------------------------------------------------------------------ */
interface Mass {
  id: number;
  color: string;
  w: number;
  h: number;
  x: number;
  y: number;
  br1: number;
  br2: number;
  br3: number;
  br4: number;
  delay: number;
  dur: number;
  xMove: number;
  yMove: number;
}

const MASSES: Mass[] = [
  { id: 1, color: "rgba(124,92,255,0.30)", w: 700, h: 600, x: 10, y: 15, br1: 60, br2: 40, br3: 30, br4: 70, delay: 0,   dur: 22, xMove: 30, yMove: 18 },
  { id: 2, color: "rgba(196,92,255,0.22)", w: 600, h: 500, x: 55, y: 50, br1: 40, br2: 60, br3: 70, br4: 30, delay: 3,  dur: 25, xMove: -25, yMove: -15 },
  { id: 3, color: "rgba(255,111,184,0.14)", w: 400, h: 350, x: 75, y: 20, br1: 50, br2: 30, br3: 60, br4: 40, delay: 6,  dur: 18, xMove: -18, yMove: 12 },
  { id: 4, color: "rgba(92,201,255,0.12)", w: 500, h: 450, x: 25, y: 65, br1: 30, br2: 50, br3: 40, br4: 60, delay: 2,  dur: 20, xMove: 22, yMove: -14 },
  { id: 5, color: "rgba(124,92,255,0.10)", w: 350, h: 350, x: 45, y: 30, br1: 70, br2: 30, br3: 50, br4: 40, delay: 8,  dur: 28, xMove: 16, yMove: 20 },
];

/* ------------------------------------------------------------------ */
/*  Canvas (desktop only)                                              */
/* ------------------------------------------------------------------ */
interface Star {
  x: number; y: number; ox: number; oy: number;
  size: number; alpha: number; phase: number;
  speed: number;
}

interface ShootingStar {
  x: number; y: number; vx: number; vy: number; life: number;
  maxLife: number;
}

function useNebulaCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isVisible: boolean,
  mouseX: number,
  mouseY: number,
  intensity: number,
) {
  const animRef = useRef<number>(0);

  useEffect(() => {
    /* Desktop ONLY — pas de canvas sur mobile */
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: Star[] = [];
    let shooters: ShootingStar[] = [];
    let lastShooter = 0;
    let running = true;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      const w = canvas.width;
      const h = canvas.height;
      stars = Array.from({ length: 200 }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        ox: 0, oy: 0,
        size: Math.random() * 1.8 + 0.3,
        alpha: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0002 + Math.random() * 0.0004,
      }));
      stars.forEach((s) => { s.ox = s.x; s.oy = s.y; });
    };

    const spawnShootingStar = () => {
      const w = canvas.width;
      const h = canvas.height;
      const angle = Math.PI / 4 + Math.random() * Math.PI / 3;
      const speed = 4 + Math.random() * 6;
      shooters.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 40 + Math.random() * 60,
        maxLife: 40 + Math.random() * 60,
      });
    };

    resize();
    initStars();

    const draw = (time: number) => {
      if (!running) return;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const px = ((mouseX / w) - 0.5) * intensity * 16;
      const py = ((mouseY / h) - 0.5) * intensity * 12;

      /* Stars */
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const drift = Math.sin(time * s.speed + s.phase) * 0.3 + 0.7;
        const alpha = s.alpha * drift;
        const sx = s.ox + px * ((s.ox / w) - 0.5) * 0.4;
        const sy = s.oy + py * ((s.oy / h) - 0.5) * 0.4;
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 241, 250, ${alpha})`;
        ctx.fill();
      }

      /* Constellations */
      for (let i = 0; i < stars.length; i++) {
        const a = stars[i];
        const checkCount = Math.min(i + 8, stars.length);
        for (let j = i + 1; j < checkCount; j++) {
          const b = stars[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120 && dist > 10) {
            const ca = (1 - dist / 120) * 0.12;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(124, 92, 255, ${ca})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      /* Shooting stars */
      if (time - lastShooter > 2800 + Math.random() * 2000) {
        if (shooters.length < 3) spawnShootingStar();
        lastShooter = time;
      }

      for (let i = shooters.length - 1; i >= 0; i--) {
        const ss = shooters[i];
        ss.x += ss.vx; ss.y += ss.vy; ss.life--;
        if (ss.life <= 0) { shooters.splice(i, 1); continue; }
        const lr = ss.life / ss.maxLife;
        const sa = lr * 0.9;
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.2 * lr + 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${sa})`;
        ctx.fill();
        const grad = ctx.createLinearGradient(ss.x, ss.y, ss.x - ss.vx * 3, ss.y - ss.vy * 3);
        grad.addColorStop(0, `rgba(200, 180, 255, ${sa * 0.7})`);
        grad.addColorStop(1, "rgba(124, 92, 255, 0)");
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 4, ss.y - ss.vy * 4);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      /* Vignette */
      const g = ctx.createRadialGradient(w / 2, h / 2, h * 0.4, w / 2, h / 2, h * 0.9);
      g.addColorStop(0, "rgba(0,0,0,0)");
      g.addColorStop(1, "rgba(6,4,13,0.3)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(draw);
    };

    animRef.current = requestAnimationFrame(draw);
    window.addEventListener("resize", resize);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [canvasRef, isVisible, mouseX, mouseY, intensity]);
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */
export function NebulaBackground({ intensity = 1, className = "" }: { intensity?: number; className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const mouse = useMousePosition();

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => setIsVisible(e.isIntersecting),
      { threshold: 0 },
    );
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useNebulaCanvas(canvasRef, isVisible, mouse.x, mouse.y, intensity);

  /* ---- Version mobile : tout en CSS, zéro canvas, zéro Framer Motion ---- */
  if (isMobile) {
    return (
      <div
        ref={containerRef}
        className={`fixed inset-0 z-0 pointer-events-none overflow-hidden bg-void ${className}`}
        style={{ opacity: intensity }}
      >
        {/* Un seul dégradé statique — le navigateur le peint une fois et c'est tout */}
        <div
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(600px at 15% 20%, rgba(124,92,255,0.25), transparent 70%),
              radial-gradient(500px at 55% 50%, rgba(196,92,255,0.18), transparent 70%),
              radial-gradient(350px at 70% 25%, rgba(255,111,184,0.10), transparent 60%),
              radial-gradient(400px at 30% 65%, rgba(92,201,255,0.08), transparent 60%)
            `,
          }}
        />

        {/* Uniquement les étoiles filantes en CSS — légères, pas de paint loop */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="shooting-star-css" style={{ left: "10%", top: "15%", animationDelay: "0s" }} />
          <div className="shooting-star-css" style={{ left: "40%", top: "8%", animationDelay: "3.5s" }} />
          <div className="shooting-star-css" style={{ left: "70%", top: "12%", animationDelay: "7s" }} />
          <div className="shooting-star-css" style={{ left: "25%", top: "20%", animationDelay: "11s" }} />
        </div>
      </div>
    );
  }

  /* ---- Version desktop : canvas + masses Framer Motion ---- */
  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden bg-void ${className}`}
      style={{ opacity: intensity }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {isVisible && (
        <motion.div
          initial={false}
          className="absolute inset-0"
          style={{
            transform: `translate(${(mouse.nx - 0.5) * intensity * 8}px, ${(mouse.ny - 0.5) * intensity * 6}px)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          {MASSES.map((m) => (
            <motion.div
              key={m.id}
              className="absolute"
              style={{
                width: m.w, height: m.h,
                background: m.color,
                top: `${m.y}%`, left: `${m.x}%`,
                borderRadius: `${m.br1}% ${m.br2}% ${m.br3}% ${m.br4}%`,
                willChange: "transform",
                filter: "blur(60px)",
              }}
              animate={{ x: [0, m.xMove, 0], y: [0, m.yMove, 0], scale: [1, 1.04, 1] }}
              transition={{ duration: m.dur, repeat: Infinity, ease: "easeInOut", delay: m.delay }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
