"use client";

import { AnimatedCounter } from "@/components/shared/AnimatedCounter";
import { useTranslation } from "@/lib/useTranslation";

const STAT_KEYS = [
  { value: 20, suffix: "+", labelKey: "stats.1" as const },
  { value: 1200, suffix: "+", labelKey: "stats.2" as const },
  { value: 40, suffix: "+", labelKey: "stats.3" as const },
  { value: 98, suffix: "%", labelKey: "stats.4" as const },
];

export function Stats() {
  const { t, isAr } = useTranslation();

  const stats = STAT_KEYS.map((s) => ({ value: s.value, suffix: s.suffix, label: t(s.labelKey) }));
  return (
    <section className="py-16 md:py-24 border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex md:grid md:grid-cols-4 gap-4 md:gap-8 overflow-x-auto snap-x snap-mandatory scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="relative text-center group p-5 md:p-6 nebula-card rounded-[0.75rem] min-w-[160px] md:min-w-0 snap-start shrink-0 md:shrink"
            >
              <p className="font-display text-3xl md:text-5xl font-bold text-violet mb-1 md:mb-2 tabular-nums">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </p>
              <p className={`text-xs md:text-sm text-mist ${isAr ? "font-arabic" : ""}`}>{stat.label}</p>
              {i < stats.length - 1 && (
                <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 md:h-16 bg-white/5" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
