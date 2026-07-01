"use client";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Play, Clock, Lock, CheckCircle, ArrowRight } from "lucide-react";
import type { Module } from "@/types";

const statusConfig = {
  completed: { label: "Terminé", icon: CheckCircle, className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
  "in-progress": { label: "En cours", icon: Play, className: "bg-violet/10 text-violet border-violet/20" },
  locked: { label: "Verrouillé", icon: Lock, className: "bg-white/5 text-mist border-white/10" },
};

interface ModuleCardProps {
  module: Module;
  index?: number;
}

export function ModuleCard({ module }: ModuleCardProps) {
  const status = statusConfig[module.status || "locked"];
  const StatusIcon = status.icon;

  return (
    <div className="group bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl overflow-hidden hover:border-violet/40 hover:-translate-y-0.5 transition-all duration-200">
      <div className="h-2" style={{ background: `linear-gradient(90deg, ${module.color?.from || "#7C5CFF"}, ${module.color?.to || "#C45CFF"})` }} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <span className="text-[11px] font-medium text-violet">Module {module.id}</span>
            <h3 className="font-display text-sm font-semibold text-star-white mt-0.5 leading-snug">{module.title}</h3>
          </div>
          <span className={cn("inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border shrink-0", status.className)}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-mist mb-3">
          <span className="flex items-center gap-1"><Play className="w-3 h-3 text-violet" /> {module.videos} vidéos</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-violet" /> {module.duration}</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] mb-1">
            <span className="text-mist">Progression</span>
            <span className="text-star-white font-medium">{module.progress}%</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${module.progress}%`, background: "linear-gradient(90deg, #7C5CFF, #C45CFF)", boxShadow: "0 0 6px rgba(124, 92, 255, 0.3)" }} />
          </div>
        </div>

        <Link
          href={module.status === "locked" ? "#" : `/dashboard/formation/${module.id}`}
          className={cn(
            "flex items-center justify-center gap-1.5 w-full py-2 rounded-lg text-xs font-medium transition-all",
            module.status === "locked"
              ? "bg-white/5 text-mist cursor-not-allowed"
              : module.status === "completed"
              ? "bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20"
              : "bg-gradient-to-r from-violet to-magenta text-white hover:brightness-110"
          )}
        >
          {module.status === "locked" ? "Verrouillé" : module.status === "completed" ? "Revoir" : "Continuer"}
          {module.status !== "locked" && <ArrowRight className="w-3 h-3" />}
        </Link>
      </div>
    </div>
  );
}
