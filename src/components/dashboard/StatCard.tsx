"use client";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  className?: string;
}

export function StatCard({ icon: Icon, value, label, className }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(
        "bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-4 hover:border-violet/40 hover:-translate-y-0.5 transition-all duration-200",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-violet" />
        </div>
        <div>
          <p className="text-2xl font-bold text-star-white">{value}</p>
          <p className="text-xs text-mist">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}
