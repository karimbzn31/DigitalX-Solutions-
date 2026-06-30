"use client";

import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  const variants = {
    default: "bg-cyan-core/5 border-cyan-core/20 text-comet",
    accent: "bg-cyan-core/10 border-cyan-core/30 text-cyan-core",
    success: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    warning: "bg-amber-500/10 border-amber-500/30 text-amber-400",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-mono text-[10px] uppercase tracking-[0.15em] px-2.5 py-1 rounded-[0.25rem] border",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
