"use client";
import { useEffect, useRef } from "react";

export function StarField({ count = 80 }: { count?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    
    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const stars: { x: number; y: number; size: number; opacity: number; phase: number }[] = [];
    
    const initStars = () => {
      stars.length = 0;
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.2 + 0.3,
          opacity: Math.random() * 0.3 + 0.1,
          phase: Math.random() * Math.PI * 2,
        });
      }
    };

    let lastTime = 0;
    const draw = (time: number) => {
      if (time - lastTime < 60) { animationId = requestAnimationFrame(draw); return; }
      lastTime = time;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((star) => {
        const pulse = Math.sin(time * 0.0005 + star.phase) * 0.3 + 0.7;
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
    return () => { cancelAnimationFrame(animationId); };
  }, [count]);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />;
}
