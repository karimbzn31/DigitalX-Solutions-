"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";

/* ------------------------------------------------------------------ */
/*  Masses floues (nébuleuses)                                        */
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
/*  Canvas  —  particules + constellations + shooting stars           */
/* ------------------------------------------------------------------ */
interface Star {
  x: number; y: number; size: number; alpha: number; phase: number;
  speed: number; twinkleSpeed: number;
}

interface ShootingStar {
  x: number; y: number; vx: number; vy: number; life: number;
  maxLife: number; tail: number;
}

interface ParticleConnection {
  from: number; to: number; distance: number;
}

function useNebulaCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isMobile: boolean,
  isVisible: boolean,
  mouseX: number,
  mouseY: number,
  intensity: number,
) {
  const starsRef = useRef<Star[]>([]);
  const shootersRef = useRef<ShootingStar[]>([]);
  const animRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ---- resize ---- */
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    /* ---- stars ---- */
    const initStars = () => {
      const count = isMobile ? 80 : 200;
      const w = canvas.width;
      const h = canvas.height;
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        size: Math.random() * 1.8 + 0.3,
        alpha: Math.random() * 0.5 + 0.15,
        phase: Math.random() * Math.PI * 2,
        speed: 0.0003 + Math.random() * 0.0006,
        twinkleSpeed: 0.3 + Math.random() * 0.7,
      }));
    };

    /* ---- shooting stars ---- */
    const spawnShootingStar = () => {
      const w = canvas.width;
      const h = canvas.height;
      const angle = Math.PI / 4 + Math.random() * Math.PI / 3;
      const speed = 4 + Math.random() * 6;
      const startX = Math.random() * w;
      const startY = Math.random() * h * 0.5;
      const life = 40 + Math.random() * 60;
      shootersRef.current.push({
        x: startX, y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life, maxLife: life, tail: 50 + Math.random() * 80,
      });
    };

    let lastShooter = 0;
    let running = true;

    const draw = (time: number) => {
      if (!running) return;
      const w = canvas.width;
      const h = canvas.height;

      /* parallax offset — léger décalage vers la souris */
      const px = ((mouseX / w) - 0.5) * intensity * 12;
      const py = ((mouseY / h) - 0.5) * intensity * 8;

      ctx.clearRect(0, 0, w, h);

      /* ---- Stars ---- */
      const starCount = starsRef.current.length;
      for (let i = 0; i < starCount; i++) {
        const s = starsRef.current[i];
        const pulse = Math.sin(time * s.speed + s.phase) * 0.3 + 0.7;
        const alpha = s.alpha * pulse;
        const sx = s.x + px * ((s.x / w) - 0.5) * 0.3;
        const sy = s.y + py * ((s.y / h) - 0.5) * 0.3;
        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 241, 250, ${alpha})`;
        ctx.fill();
      }

      /* ---- Connections (constellations) ---- */
      if (!isMobile && starCount > 10) {
        const connectDist = 120;
        for (let i = 0; i < starCount; i++) {
          const a = starsRef.current[i];
          const ax = a.x + px * ((a.x / w) - 0.5) * 0.3;
          const ay = a.y + py * ((a.y / h) - 0.5) * 0.3;
          /* limiter les connexions proches */
          const checkCount = Math.min(i + 8, starCount);
          for (let j = i + 1; j < checkCount; j++) {
            const b = starsRef.current[j];
            const dx = ax - (b.x + px * ((b.x / w) - 0.5) * 0.3);
            const dy = ay - (b.y + py * ((b.y / h) - 0.5) * 0.3);
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectDist && dist > 10) {
              const alpha = (1 - dist / connectDist) * 0.12;
              ctx.beginPath();
              ctx.moveTo(ax, ay);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(124, 92, 255, ${alpha})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      /* ---- Shooting stars ---- */
      // spawn toutes les ~3s
      if (time - lastShooter > 2800 + Math.random() * 2000) {
        if (shootersRef.current.length < 3) spawnShootingStar();
        lastShooter = time;
      }

      for (let i = shootersRef.current.length - 1; i >= 0; i--) {
        const ss = shootersRef.current[i];
        ss.x += ss.vx;
        ss.y += ss.vy;
        ss.life--;

        if (ss.life <= 0) {
          shootersRef.current.splice(i, 1);
          continue;
        }

        const lifeRatio = ss.life / ss.maxLife;
        const alpha = lifeRatio * 0.9;

        /* tête */
        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.2 * lifeRatio + 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
        ctx.fill();

        /* traînée */
        const gradient = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - ss.vx * 3, ss.y - ss.vy * 3,
        );
        gradient.addColorStop(0, `rgba(200, 180, 255, ${alpha * 0.7})`);
        gradient.addColorStop(1, `rgba(124, 92, 255, 0)`);
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 4, ss.y - ss.vy * 4);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      /* ---- Vignette subtile ---- */
      const vigGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.4, w / 2, h / 2, h * 0.9);
      vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      vigGrad.addColorStop(1, "rgba(6,4,13,0.3)");
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, w, h);

      animRef.current = requestAnimationFrame(draw);
    };

    resize();
    initStars();
    animRef.current = requestAnimationFrame(draw);

    const onResize = () => { resize(); initStars(); };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", onResize);
    };
  }, [canvasRef, isMobile, isVisible, mouseX, mouseY, intensity]);
}

/* ------------------------------------------------------------------ */
/*  Composant principal                                                */
/* ------------------------------------------------------------------ */
interface NebulaBackgroundProps {
  intensity?: number;
  className?: string;
}

export function NebulaBackground({ intensity = 1, className = "" }: NebulaBackgroundProps) {
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

  useNebulaCanvas(canvasRef, isMobile, isVisible, mouse.x, mouse.y, intensity);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden bg-void ${className}`}
      style={{ opacity: intensity }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Masses floues par-dessus le canvas */}
      {isVisible && (
        <motion.div
          initial={false}
          className="absolute inset-0"
          style={{
            transform: `translate(${(mouse.nx - 0.5) * intensity * 8}px, ${(mouse.ny - 0.5) * intensity * 6}px)`,
            transition: "transform 0.15s ease-out",
          }}
        >
          {(isMobile ? MASSES.slice(0, 2) : MASSES).map((m) => (
            <motion.div
              key={m.id}
              className="absolute"
              style={{
                width: isMobile ? m.w * 0.5 : m.w,
                height: isMobile ? m.h * 0.5 : m.h,
                background: m.color,
                top: `${m.y}%`,
                left: `${m.x}%`,
                borderRadius: `${m.br1}% ${m.br2}% ${m.br3}% ${m.br4}%`,
                willChange: "transform",
                filter: `blur(${isMobile ? 40 : 60}px)`,
              }}
              animate={{
                x: [0, m.xMove, 0],
                y: [0, m.yMove, 0],
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: m.dur,
                repeat: Infinity,
                ease: "easeInOut",
                delay: m.delay,
              }}
            />
          ))}
        </motion.div>
      )}
    </div>
  );
}
