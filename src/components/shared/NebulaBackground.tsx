"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useScrollY } from "@/hooks/useScrollProgress";

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
/*  Canvas                                                            */
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

interface TouchRipple {
  x: number; y: number; radius: number; alpha: number;
}

function useNebulaCanvas(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isMobile: boolean,
  isVisible: boolean,
  mouseX: number,
  mouseY: number,
  scrollY: number,
  intensity: number,
) {
  const starsRef = useRef<Star[]>([]);
  const shootersRef = useRef<ShootingStar[]>([]);
  const ripplesRef = useRef<TouchRipple[]>([]);
  const animRef = useRef<number>(0);
  const timeRef = useRef(0);

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
      const count = isMobile ? 60 : 200;
      const w = canvas.width;
      const h = canvas.height;
      starsRef.current = Array.from({ length: count }, () => {
        const x = Math.random() * w;
        const y = Math.random() * h;
        return {
          x, y, ox: x, oy: y,
          size: Math.random() * (isMobile ? 1.2 : 1.8) + 0.2,
          alpha: Math.random() * (isMobile ? 0.3 : 0.5) + 0.08,
          phase: Math.random() * Math.PI * 2,
          speed: 0.0002 + Math.random() * 0.0004,
        };
      });
    };

    /* ---- shooting stars ---- */
    const spawnShootingStar = () => {
      const w = canvas.width;
      const h = canvas.height;
      const angle = Math.PI / 4 + Math.random() * Math.PI / 3;
      const speed = (isMobile ? 3 : 4) + Math.random() * (isMobile ? 4 : 6);
      shootersRef.current.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 40 + Math.random() * 60,
        maxLife: 40 + Math.random() * 60,
      });
    };

    /* ---- touch ripple ---- */
    const handleTouch = (e: TouchEvent) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        ripplesRef.current.push({ x: t.clientX, y: t.clientY, radius: 5, alpha: 0.5 });
      }
    };
    window.addEventListener("touchstart", handleTouch, { passive: true });

    let lastShooter = 0;
    let running = true;

    const draw = (time: number) => {
      if (!running) return;
      timeRef.current = time;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      /* ---- Mouse offset (desktop) / auto-offset + scroll (mobile) ---- */
      let px: number, py: number;
      if (isMobile) {
        /* Mobile : les étoiles dérivent lentement avec le temps + scroll */
        const driftX = Math.sin(time * 0.00008) * 20;
        const driftY = Math.cos(time * 0.00006) * 15;
        const scrollOffset = (scrollY / Math.max(document.body.scrollHeight, 1)) * 40 - 20;
        px = driftX;
        py = driftY + scrollOffset * 0.3;
      } else {
        px = ((mouseX / w) - 0.5) * intensity * 16;
        py = ((mouseY / h) - 0.5) * intensity * 12;
      }

      /* ---- Stars ---- */
      const starCount = starsRef.current.length;
      for (let i = 0; i < starCount; i++) {
        const s = starsRef.current[i];
        const drift = Math.sin(time * s.speed + s.phase) * 0.3 + 0.7;
        const alpha = s.alpha * drift;
        const sx = s.ox + px * ((s.ox / w) - 0.5) * 0.4;
        const sy = s.oy + py * ((s.oy / h) - 0.5) * 0.4;
        s.x = sx; s.y = sy;

        ctx.beginPath();
        ctx.arc(sx, sy, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 241, 250, ${alpha})`;
        ctx.fill();
      }

      /* ---- Constellations (desktop only) ---- */
      if (!isMobile && starCount > 10) {
        const connectDist = 120;
        for (let i = 0; i < starCount; i++) {
          const a = starsRef.current[i];
          const checkCount = Math.min(i + 8, starCount);
          for (let j = i + 1; j < checkCount; j++) {
            const b = starsRef.current[j];
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < connectDist && dist > 10) {
              const ca = (1 - dist / connectDist) * 0.12;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.strokeStyle = `rgba(124, 92, 255, ${ca})`;
              ctx.lineWidth = 0.5;
              ctx.stroke();
            }
          }
        }
      }

      /* ---- Shooting stars ---- */
      const shooterInterval = isMobile ? 2200 : 2800;
      if (time - lastShooter > shooterInterval + Math.random() * 1500) {
        if (shootersRef.current.length < (isMobile ? 4 : 3)) spawnShootingStar();
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
        const sa = lifeRatio * 0.9;

        ctx.beginPath();
        ctx.arc(ss.x, ss.y, 1.2 * lifeRatio + 0.3, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${sa})`;
        ctx.fill();

        const gradient = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - ss.vx * 3, ss.y - ss.vy * 3,
        );
        gradient.addColorStop(0, `rgba(200, 180, 255, ${sa * 0.7})`);
        gradient.addColorStop(1, `rgba(124, 92, 255, 0)`);
        ctx.beginPath();
        ctx.moveTo(ss.x, ss.y);
        ctx.lineTo(ss.x - ss.vx * 4, ss.y - ss.vy * 4);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      /* ---- Touch ripples ---- */
      for (let i = ripplesRef.current.length - 1; i >= 0; i--) {
        const r = ripplesRef.current[i];
        r.radius += 1.2;
        r.alpha -= 0.012;

        if (r.alpha <= 0) {
          ripplesRef.current.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(124, 92, 255, ${r.alpha * 0.4})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        /* halo intérieur */
        const grad = ctx.createRadialGradient(r.x, r.y, 0, r.x, r.y, r.radius);
        grad.addColorStop(0, `rgba(124, 92, 255, ${r.alpha * 0.05})`);
        grad.addColorStop(1, `rgba(124, 92, 255, 0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      /* ---- Vignette ---- */
      const vigGrad = ctx.createRadialGradient(w / 2, h / 2, h * 0.4, w / 2, h / 2, h * 0.9);
      vigGrad.addColorStop(0, "rgba(0,0,0,0)");
      vigGrad.addColorStop(1, `rgba(6,4,13,${isMobile ? 0.2 : 0.3})`);
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
      window.removeEventListener("touchstart", handleTouch);
    };
  }, [canvasRef, isMobile, isVisible, mouseX, mouseY, scrollY, intensity]);
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
  const scrollY = useScrollY();

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

  useNebulaCanvas(canvasRef, isMobile, isVisible, mouse.x, mouse.y, scrollY, intensity);

  return (
    <div
      ref={containerRef}
      className={`fixed inset-0 z-0 pointer-events-none overflow-hidden bg-void ${className}`}
      style={{ opacity: intensity }}
    >
      <canvas ref={canvasRef} className="absolute inset-0" />

      {/* Masses floues */}
      {isVisible && (
        <motion.div
          initial={false}
          className="absolute inset-0"
          style={
            isMobile
              ? {} /* mobile : pas de parallaxe souris */
              : {
                  transform: `translate(${(mouse.nx - 0.5) * intensity * 8}px, ${(mouse.ny - 0.5) * intensity * 6}px)`,
                  transition: "transform 0.15s ease-out",
                }
          }
        >
          {(isMobile ? MASSES.slice(0, 4) : MASSES).map((m) => (
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
