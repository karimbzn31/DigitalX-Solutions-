"use client";

import { cn } from "@/lib/utils";

interface NebulaProgressBarProps {
  value: number;
  className?: string;
  showLabel?: boolean;
}

export function NebulaProgressBar({ value, className, showLabel = true }: NebulaProgressBarProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="nebula-progress flex-1">
        <div className="nebula-progress-bar" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
      {showLabel && (
        <span className="text-xs text-mist min-w-[2.5rem] text-right tabular-nums">
          {Math.round(value)}%
        </span>
      )}
    </div>
  );
}
