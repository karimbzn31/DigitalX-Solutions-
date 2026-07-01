"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StarField } from "./StarField";

const masses = [
  { color: "rgba(124, 92, 255, 0.15)", width: 500, height: 400, x: 10, y: 20, br1: 60, br2: 40, br3: 30, br4: 70, delay: 0, duration: 20 },
  { color: "rgba(196, 92, 255, 0.12)", width: 400, height: 350, x: 60, y: 50, br1: 40, br2: 60, br3: 70, br4: 30, delay: 3, duration: 22 },
  { color: "rgba(92, 201, 255, 0.08)", width: 350, height: 300, x: 75, y: 15, br1: 50, br2: 30, br3: 60, br4: 40, delay: 6, duration: 18 },
];

export function NebulaBackground({ intensity = 0.5 }: { intensity?: number }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-void" style={{ opacity: intensity }}>
      <StarField count={isMobile ? 30 : 60} />
      {masses.map((m) => {
        const xMove = (m.x > 50 ? -1 : 1) * (isMobile ? 4 : 15);
        const yMove = (m.y > 50 ? -1 : 1) * (isMobile ? 3 : 10);
        return (
          <motion.div
            key={m.color}
            className="absolute"
            style={{
              width: isMobile ? m.width * 0.5 : m.width,
              height: isMobile ? m.height * 0.5 : m.height,
              background: m.color,
              top: `${m.y}%`,
              left: `${m.x}%`,
              borderRadius: `${m.br1}% ${m.br2}% ${m.br3}% ${m.br4}%`,
              filter: `blur(${isMobile ? 40 : 80}px)`,
            }}
            animate={{ x: [0, xMove, 0], y: [0, yMove, 0], scale: [1, 1.03, 1] }}
            transition={{ duration: m.duration, repeat: Infinity, ease: "easeInOut", delay: m.delay }}
          />
        );
      })}
    </div>
  );
}
