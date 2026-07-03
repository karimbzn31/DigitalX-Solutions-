"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CircularProgressProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
  label?: string;
  color?: string;
}

export function CircularProgress({
  value,
  size = 120,
  strokeWidth = 6,
  className,
  label,
  color = "url(#gradient)",
}: CircularProgressProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C5CFF" />
            <stop offset="50%" stopColor="#C45CFF" />
            <stop offset="100%" stopColor="#FF6FB8" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>
      <div className="absolute flex flex-col items-center justify-center" style={{ width: size, height: size }}>
        <motion.span
          className="text-2xl font-bold text-star-white"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          {Math.round(value)}%
        </motion.span>
      </div>
      {label && <span className="text-xs text-mist mt-1">{label}</span>}
    </div>
  );
}
