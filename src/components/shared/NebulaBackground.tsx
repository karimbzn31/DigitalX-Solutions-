"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

interface Mass {
  id: number;
  color: string;
  width: number;
  height: number;
  x: number;
  y: number;
  br1: number;
  br2: number;
  br3: number;
  br4: number;
  delay: number;
  duration: number;
}

const masses: Mass[] = [
  { id: 1, color: "rgba(124, 92, 255, 0.25)", width: 700, height: 600, x: 10, y: 15, br1: 60, br2: 40, br3: 30, br4: 70, delay: 0, duration: 22 },
  { id: 2, color: "rgba(196, 92, 255, 0.18)", width: 600, height: 500, x: 55, y: 50, br1: 40, br2: 60, br3: 70, br4: 30, delay: 3, duration: 25 },
  { id: 3, color: "rgba(255, 111, 184, 0.12)", width: 400, height: 350, x: 75, y: 20, br1: 50, br2: 30, br3: 60, br4: 40, delay: 6, duration: 18 },
  { id: 4, color: "rgba(92, 201, 255, 0.10)", width: 500, height: 450, x: 25, y: 65, br1: 30, br2: 50, br3: 40, br4: 60, delay: 2, duration: 20 },
];

export function NebulaBackground({ intensity = 1 }: { intensity?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !isVisible) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let stars: { x: number; y: number; size: number; opacity: number; phase: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const initStars = () => {
      stars = [];
      const count = isMobile ? 30 : 80;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.2 + 0.5,
          opacity: Math.random() * 0.4 + 0.2,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    let lastTime = 0;
    const draw = (time: number) => {
      if (time - lastTime < 60) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      lastTime = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        const pulse = Math.sin(time * 0.0005 + star.phase) * 0.25 + 0.75;
        const alpha = star.opacity * pulse;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 241, 250, ${alpha})`;
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    resize();
    initStars();
    animationId = requestAnimationFrame(draw);

    window.addEventListener("resize", () => { resize(); initStars(); });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
    };
  }, [isMobile, isVisible]);

  return (
    <div ref={containerRef} className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-void" style={{ opacity: intensity }}>
      <canvas ref={canvasRef} className="absolute inset-0" />

      {isVisible && (
        <motion.div
          initial={false}
          className="absolute inset-0"
        >
          {(isMobile ? masses.slice(0, 2) : masses).map((m) => {
            const xMove = (m.x > 50 ? -1 : 1) * (isMobile ? 6 : 20);
            const yMove = (m.y > 50 ? -1 : 1) * (isMobile ? 4 : 12);
            return (
              <motion.div
                key={m.id}
                className="absolute"
                style={{
                  width: isMobile ? m.width * 0.5 : m.width,
                  height: isMobile ? m.height * 0.5 : m.height,
                  background: m.color,
                  top: `${m.y}%`,
                  left: `${m.x}%`,
                  borderRadius: `${m.br1}% ${m.br2}% ${m.br3}% ${m.br4}%`,
                  willChange: "transform",
                  filter: `blur(${isMobile ? 40 : 60}px)`,
                }}
                animate={{ x: [0, xMove, 0], y: [0, yMove, 0], scale: [1, 1.03, 1] }}
                transition={{ duration: m.duration * 1.5, repeat: Infinity, ease: "easeInOut", delay: m.delay }}
              />
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
