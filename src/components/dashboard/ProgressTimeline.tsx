"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { CheckCircle, Play, Lock, ArrowRight } from "lucide-react";

interface TimelineModule {
  id: string;
  title: string;
  progress: number;
  status: "completed" | "in-progress" | "locked";
  videos?: number;
  duration?: string;
}

interface ProgressTimelineProps {
  modules: TimelineModule[];
}

const statusIcons = {
  completed: CheckCircle,
  "in-progress": Play,
  locked: Lock,
};

const statusColors = {
  completed: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  "in-progress": "text-violet border-violet/30 bg-violet/10",
  locked: "text-mist border-white/10 bg-white/5",
};

const lineColors = {
  completed: "bg-emerald-500/40",
  "in-progress": "bg-gradient-to-b from-violet to-violet/20",
  locked: "bg-white/5",
};

export function ProgressTimeline({ modules }: ProgressTimelineProps) {
  if (modules.length === 0) return null;

  return (
    <div className="space-y-0">
      {modules.map((mod, i) => {
        const Icon = statusIcons[mod.status];
        const isLast = i === modules.length - 1;

        return (
          <motion.div
            key={mod.id}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="relative flex gap-4 pb-6"
          >
            {/* Line */}
            {!isLast && (
              <div className={cn(
                "absolute left-[15px] top-8 w-0.5 h-full",
                lineColors[mod.status]
              )} />
            )}

            {/* Icon */}
            <div className={cn(
              "relative z-10 w-8 h-8 rounded-full border flex items-center justify-center shrink-0",
              statusColors[mod.status]
            )}>
              <Icon className="w-3.5 h-3.5" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <div className="flex items-center justify-between gap-2">
                <p className={cn(
                  "text-sm font-medium truncate",
                  mod.status === "locked" ? "text-mist" : "text-star-white"
                )}>
                  {mod.title}
                </p>
                {mod.status !== "locked" && (
                  <span className={cn(
                    "text-xs font-medium shrink-0",
                    mod.progress >= 80 ? "text-emerald-400" : "text-violet"
                  )}>
                    {mod.progress}%
                  </span>
                )}
              </div>

              {/* Progress bar for in-progress */}
              {mod.status === "in-progress" && (
                <div className="mt-1.5 w-full h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-violet to-magenta"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${mod.progress}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.15 }}
                  />
                </div>
              )}

              {/* Completed badge */}
              {mod.status === "completed" && (
                <p className="text-[11px] text-emerald-400/70 mt-0.5">Terminé ✓</p>
              )}

              {/* Action links */}
              <div className="mt-1.5">
                {mod.status === "in-progress" ? (
                  <Link
                    href={`/dashboard/formation/${mod.id}`}
                    className="inline-flex items-center gap-1 text-[11px] text-violet hover:text-violet/80 transition-colors"
                  >
                    Continuer <ArrowRight className="w-3 h-3" />
                  </Link>
                ) : mod.status === "locked" && mod.videos ? (
                  <p className="text-[11px] text-mist/50">{mod.videos} vidéos</p>
                ) : null}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
