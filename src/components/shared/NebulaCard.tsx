"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NebulaCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export function NebulaCard({ children, className, hover = true, onClick }: NebulaCardProps) {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } } : undefined}
      className={cn(
        "nebula-card rounded-[0.75rem] p-6 transition-all duration-300 relative overflow-hidden",
        hover && "nebula-card-hover",
        onClick && "cursor-pointer",
        className
      )}
    >
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
