"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
}

const COLORS = ["#7C5CFF", "#C45CFF", "#FF6FB8", "#5CC9FF", "#FFD700", "#50E3C2"];

interface ConfettiEffectProps {
  trigger: boolean;
  onComplete?: () => void;
}

export function ConfettiEffect({ trigger, onComplete }: ConfettiEffectProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!trigger) {
      setPieces([]);
      return;
    }

    const newPieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      rotation: Math.random() * 720 - 360,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.5,
    }));
    setPieces(newPieces);

    const timer = setTimeout(() => {
      setPieces([]);
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [trigger, onComplete]);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {pieces.map((piece) => (
          <motion.div
            key={`${piece.id}-${trigger}`}
            initial={{
              x: `${piece.x}vw`,
              y: `${piece.y}vh`,
              rotate: 0,
              opacity: 1,
            }}
            animate={{
              y: "110vh",
              rotate: piece.rotation,
              opacity: 0,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5,
              delay: piece.delay,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="absolute"
            style={{
              width: piece.size,
              height: piece.size,
              backgroundColor: piece.color,
              borderRadius: Math.random() > 0.5 ? "50%" : "2px",
              left: 0,
              top: 0,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function useConfetti() {
  const [show, setShow] = useState(false);

  const fire = useCallback(() => {
    setShow(true);
  }, []);

  const done = useCallback(() => {
    setShow(false);
  }, []);

  return { show, fire, done };
}
