"use client";
import { useState } from "react";
import { modules, currentUser } from "@/lib/mock-data";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { BookOpen, Clock, Award } from "lucide-react";

export default function FormationPage() {
  const totalVideos = modules.reduce((sum, m) => sum + m.videos, 0);
  const completedVideos = currentUser.videosWatched;
  const [filter, setFilter] = useState<string | null>(null);

  const filteredModules = filter
    ? modules.filter((m) => m.status === filter)
    : modules;

  const stats = [
    { icon: BookOpen, value: `${modules.length}`, label: "Modules" },
    { icon: Clock, value: `${totalVideos}`, label: "Vidéos" },
    { icon: Award, value: `${completedVideos}/${totalVideos}`, label: "Complétées" },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">
          Ma Formation
        </h2>
        <p className="text-sm text-mist mt-1">
          Parcourez l&apos;ensemble des modules de la formation
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-violet" />
              </div>
              <div>
                <p className="text-xl font-bold text-star-white">{stat.value}</p>
                <p className="text-xs text-mist">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { label: "Tous", value: null },
          { label: "En cours", value: "in-progress" },
          { label: "Terminés", value: "completed" },
          { label: "Verrouillés", value: "locked" },
        ].map((tab) => (
          <button
            key={tab.value || "all"}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              filter === tab.value
                ? "bg-violet text-white"
                : "bg-white/5 text-mist hover:text-star-white hover:bg-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredModules.map((mod) => (
          <ModuleCard key={mod.id} module={mod} />
        ))}
      </div>
    </div>
  );
}
