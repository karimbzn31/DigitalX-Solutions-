"use client";

import { useRef, useState, type ReactNode, type MouseEvent } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
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

  /* ---- Spring-based 3D tilt ---- */
  const rotateX = useSpring(0, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(0, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMousePos({ x, y });

    if (hover) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rx = ((y - centerY) / centerY) * -6;
      const ry = ((x - centerX) / centerX) * 6;
      rotateX.set(rx);
      rotateY.set(ry);
    }
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      style={{
        rotateX: hover ? rotateX : 0,
        rotateY: hover ? rotateY : 0,
        transformStyle: "preserve-3d",
        perspective: 800,
      }}
      className={cn(
        "nebula-card rounded-[0.75rem] p-6 relative overflow-hidden transition-all duration-300",
        hover && "nebula-card-hover",
        onClick && "cursor-pointer",
        "group",
        className,
      )}
    >
      {/* Halo lumineux qui suit la souris */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background: isHovered
            ? `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`
            : undefined,
        }}
      />

      {/* Ligne lumineuse en haut au hover */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: isHovered
            ? `radial-gradient(500px circle at ${mousePos.x}px ${mousePos.y}px, rgba(124,92,255,0.08), transparent 70%)`
            : undefined,
        }}
      />

      {/* Bordure subtile au hover */}
      <div
        className="pointer-events-none absolute inset-[-1px] rounded-[0.75rem] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          border: isHovered ? "1px solid rgba(124,92,255,0.2)" : "1px solid transparent",
        }}
      />

      {/* Contenu */}
      <div className="relative z-10" style={{ transform: "translateZ(20px)" }}>
        {children}
      </div>
    </motion.div>
  );
}
