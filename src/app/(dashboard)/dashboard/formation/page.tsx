"use client";
import { useState, useEffect } from "react";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { BookOpen, Clock, Award } from "lucide-react";

interface Module {
  id: string; title: string; title_short: string; description: string;
  videos: number; duration: string; level: string; progress: number;
  status: string; color_from: string; color_to: string;
}

export default function FormationPage() {
  const [modules, setModules] = useState<Module[]>([]);
  const [stats, setStats] = useState({ totalVideos: 0, totalWatched: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/student/modules")
      .then(r => r.json())
      .then(data => {
        setModules(data.modules || []);
        setStats(data.stats || { totalVideos: 0, totalWatched: 0 });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredModules = filter ? modules.filter((m) => m.status === filter) : modules;

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">Ma Formation</h2>
        <p className="text-sm text-mist mt-1">Parcourez l&apos;ensemble des modules de la formation</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: BookOpen, value: `${modules.length}`, label: "Modules" },
          { icon: Clock, value: `${stats.totalVideos}`, label: "Vidéos" },
          { icon: Award, value: `${stats.totalWatched}/${stats.totalVideos}`, label: "Complétées" },
        ].map((stat) => (
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

      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {[
          { label: "Tous", value: null as string | null },
          { label: "En cours", value: "in-progress" },
          { label: "Terminés", value: "completed" },
          { label: "Verrouillés", value: "locked" },
        ].map((tab) => (
          <button key={tab.value || "all"} onClick={() => setFilter(tab.value)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
              filter === tab.value ? "bg-violet text-white" : "bg-white/5 text-mist hover:text-star-white hover:bg-white/10"
            }`}>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredModules.map((mod) => {
          const m = { ...mod, status: mod.status as "completed" | "in-progress" | "locked" | undefined, color: { from: mod.color_from || "#6366F1", to: mod.color_to || "#8B5CF6" } };
          return <ModuleCard key={mod.id} module={m} />;
        })}
      </div>

      {modules.length === 0 && !loading && (
        <div className="text-center py-12 text-white/30 text-sm">Aucun module pour le moment</div>
      )}
    </div>
  );
}
