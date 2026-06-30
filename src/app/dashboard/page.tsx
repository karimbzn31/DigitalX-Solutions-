"use client";

import { BarChart3, BookOpen, Clock, Award, ChevronRight } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { NebulaProgressBar } from "@/components/shared/NebulaProgressBar";
import { NebulaBadge } from "@/components/shared/NebulaBadge";
import { modules } from "@/lib/mock-data";
import { ActivityChart } from "@/components/dashboard/ActivityChart";
import { LearningCalendar } from "@/components/dashboard/LearningCalendar";
import Link from "next/link";
import { cn } from "@/lib/utils";

const stats = [
  { icon: BookOpen, label: "Modules débloqués", value: modules.filter(m => m.status !== "locked").length, total: modules.length },
  { icon: Clock, label: "Temps passé", value: "12h", total: null },
  { icon: BarChart3, label: "Progression globale", value: "33", total: "%" },
  { icon: Award, label: "Certificats", value: "1", total: null },
];

export default function DashboardPage() {
  const unlocked = modules.filter(m => m.status !== "locked");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-star-white">Tableau de bord</h1>
        <p className="text-sm text-mist">Bienvenue dans votre espace de formation</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <NebulaCard key={s.label} className="p-5">
            <div className="w-9 h-9 bg-gradient-to-br from-violet/10 to-magenta/10 rounded-lg flex items-center justify-center border border-violet/10 mb-3">
              <s.icon className="w-4 h-4 text-violet" />
            </div>
            <div className="flex items-baseline gap-0.5">
              <p className="font-display text-2xl font-bold text-star-white">{s.value}</p>
              {s.total && <span className="text-sm text-mist">{s.total}</span>}
            </div>
            <p className="text-xs text-mist mt-0.5">{s.label}</p>
          </NebulaCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart />
        <LearningCalendar />
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-medium text-mist">Continuer votre formation</h2>
          <Link href="/dashboard/formation" className="text-xs text-violet hover:text-rose transition-colors flex items-center gap-1">
            Voir tout <ChevronRight className="w-3 h-3" />
          </Link>
        </div>
        <div className="space-y-3">
          {unlocked.map((mod) => (
            <NebulaCard key={mod.id} className="p-4 hover:shadow-nebula transition-all duration-300 cursor-pointer">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold",
                    mod.status === "completed" ? "bg-green-500/10 text-green-400" : "bg-violet/10 text-violet"
                  )}>
                    {mod.id}
                  </div>
                  <div>
                    <h3 className="text-sm text-star-white font-medium">{mod.titleShort || mod.title}</h3>
                    <p className="text-[10px] text-mist">{mod.videos} vidéos · {mod.duration}</p>
                  </div>
                </div>
                <NebulaBadge variant={mod.status === "completed" ? "success" : mod.status === "in-progress" ? "violet" : "default"}>
                  {mod.status === "completed" ? "Terminé" : mod.status === "in-progress" ? "En cours" : "Verrouillé"}
                </NebulaBadge>
              </div>
              <NebulaProgressBar value={mod.progress} />
            </NebulaCard>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-sm font-medium text-mist mb-4">Progression visuelle</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {modules.map((mod, i) => (
            <div key={mod.id} className="flex flex-col items-center gap-1.5 group">
              <div className={cn(
                "w-full aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300",
                mod.status === "completed" ? "bg-gradient-to-br from-violet to-magenta text-white" :
                mod.status === "in-progress" ? "bg-violet/20 text-violet border border-violet/30" :
                "bg-white/5 text-mist/30 border border-white/5"
              )}>
                {mod.status === "completed" ? "✓" : mod.progress > 0 ? `${mod.progress}%` : i + 1}
              </div>
              <span className="text-[9px] text-mist text-center leading-tight">
                {mod.titleShort || `Module ${mod.id}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
