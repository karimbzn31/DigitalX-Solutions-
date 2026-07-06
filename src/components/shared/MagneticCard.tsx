"use client";

import { useRef, useState, type ReactNode, type MouseEvent, type TouchEvent } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

interface MagneticCardProps {
  children: ReactNode;
  className?: string;
  glowColor?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function MagneticCard({
  children,
  className,
  glowColor = "rgba(124, 92, 255, 0.25)",
  hover = true,
  onClick,
}: MagneticCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [glowBurst, setGlowBurst] = useState(false);
  const burstTimer = useRef<ReturnType<typeof setTimeout>>();

  /* 3D tilt springs */
  const rotateX = useSpring(0, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePos({ x, y });

    if (hover) {
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      rotateX.set(((y - cy) / cy) * -5);
      rotateY.set(((x - cx) / cx) * 5);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  /* ---- Touch glow burst ---- */
  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    setMousePos({ x, y });
    setIsHovered(true);
    setGlowBurst(true);

    if (burstTimer.current) clearTimeout(burstTimer.current);
    burstTimer.current = setTimeout(() => {
      setGlowBurst(false);
      setIsHovered(false);
    }, 600);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        rotateX: hover ? rotateX : 0,
        rotateY: hover ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 800 as unknown as string | number,
      }}
      className={cn(
        "nebula-card rounded-[0.75rem] p-6 relative overflow-hidden transition-all duration-300",
        hover && "nebula-card-hover",
        onClick && "cursor-pointer",
        "group",
        className,
      )}
    >
      {/* Halo tracking (desktop) + burst (mobile) */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered || glowBurst ? 1 : 0,
          background: mousePos.x !== 0 || mousePos.y !== 0
            ? `radial-gradient(${glowBurst ? 500 : 400}px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`
            : undefined,
        }}
      />

      {/* Bordure lumineuse au touch/hover */}
      <div
        className="pointer-events-none absolute inset-[-1px] rounded-[0.75rem] transition-opacity duration-300"
        style={{
          opacity: isHovered || glowBurst ? 1 : 0,
          border: "1px solid rgba(124,92,255,0.2)",
        }}
      />

      {/* Contenu */}
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
