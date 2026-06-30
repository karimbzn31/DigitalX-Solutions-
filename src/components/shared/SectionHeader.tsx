"use client";

import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({ eyebrow, title, subtitle, className }: SectionHeaderProps) {
  return (
    <div className={cn("text-center mb-16", className)}>
      <p className="text-sm text-mist mb-4">
        {eyebrow}
      </p>

      <h2 className="font-display text-4xl md:text-5xl font-semibold tracking-tight leading-[1.1] text-star-white max-w-3xl mx-auto">
        {title}
      </h2>

      {subtitle && (
        <p className="mt-4 text-base text-mist max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
}
