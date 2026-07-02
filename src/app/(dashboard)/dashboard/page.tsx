"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { StatCard } from "@/components/dashboard/StatCard";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { ContinueCard } from "@/components/dashboard/ContinueCard";
import { BookOpen, Clock, Award, Zap, ChevronRight, Rocket } from "lucide-react";

interface Mod {
  id: string; title: string; title_short: string; description: string;
  videos: number; duration: string; level: string; progress: number;
  status: string; color_from: string; color_to: string;
}

interface VideoItem {
  id: string; module_id: string; title: string; duration: string;
  order_index: number; completed: boolean;
}

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const [modules, setModules] = useState<Mod[]>([]);
  const [stats, setStats] = useState({ totalVideos: 0, watchedVideos: 0, progress: 0 });
  const [nextVideo, setNextVideo] = useState<VideoItem & { moduleTitle: string; moduleProgress: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/student/modules").then(r => r.json()),
      fetch("/api/student/progress").then(r => r.json()),
    ]).then(([modulesData, progressData]) => {
      const mods = modulesData.modules || [];
      setModules(mods);
      setStats(progressData.stats || { totalVideos: 0, watchedVideos: 0, progress: 0 });

      // Find next unwatched video
      for (const mod of mods) {
        if (mod.status === "in-progress" || mod.status === "completed") {
          fetch(`/api/student/videos?moduleId=${mod.id}`).then(r => r.json()).then(data => {
            const vids = data.videos || [];
            const firstUnwatched = vids.find((v: VideoItem) => !v.completed);
            if (firstUnwatched) {
              setNextVideo({ ...firstUnwatched, moduleTitle: mod.title, moduleProgress: mod.progress });
            }
          });
          break;
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const totalProgress = modules.length > 0
    ? Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)
    : 0;

  const hasNoActivity = modules.every((m) => m.status === "locked" || (m.status === "in-progress" && m.progress === 0));

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">
          Bon retour, {user?.name || "Apprenant"} 👋
        </h2>
        <p className="text-sm text-mist mt-1">
          {hasNoActivity ? "Prêt à commencer votre formation ?" : "Continuez votre progression dans la formation"}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} value={`${stats.watchedVideos}/${stats.totalVideos}`} label="Vidéos visionnées" />
        <StatCard icon={Clock} value={user?.timeSpent || "0h"} label="Temps total" />
        <StatCard icon={Zap} value={`${totalProgress}%`} label="Progression globale" />
        <StatCard icon={Award} value={user?.certificates || 0} label="Certificats obtenus" />
      </div>

      {nextVideo && (
        <ContinueCard
          videoId={nextVideo.id}
          videoTitle={nextVideo.title}
          moduleTitle={nextVideo.moduleTitle}
          progress={nextVideo.moduleProgress}
        />
      )}

      {hasNoActivity && modules.length > 0 && (
        <Link
          href={`/dashboard/formation/${modules[0].id}`}
          className="group flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-violet/20 via-magenta/10 to-rose/10 border border-violet/20 hover:border-violet/40 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-semibold text-star-white">Commencez votre formation</p>
              <p className="text-xs text-mist mt-0.5">{modules[0].title}</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-violet group-hover:translate-x-1 transition-transform" />
        </Link>
      )}

      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-star-white">Formations en cours</h3>
          <Link href="/dashboard/formation" className="text-xs text-violet hover:underline">Voir tout</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {modules.filter((m) => m.status === "in-progress" || m.status === "locked").slice(0, 3).map((mod) => (
            <ModuleCard key={mod.id} module={{ ...mod, status: mod.status as "completed" | "in-progress" | "locked" | undefined, color: { from: mod.color_from || "#6366F1", to: mod.color_to || "#8B5CF6" } }} />
          ))}
        </div>
      </div>

      {modules.length === 0 && !loading && (
        <div className="text-center py-12 text-white/30 text-sm">
          Aucune formation disponible pour le moment
        </div>
      )}
    </div>
  );
}
