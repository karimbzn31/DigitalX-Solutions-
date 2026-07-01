"use client";
import Link from "next/link";
import { modules, videos, currentUser } from "@/lib/mock-data";
import { StatCard } from "@/components/dashboard/StatCard";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { ContinueCard } from "@/components/dashboard/ContinueCard";
import { BookOpen, Clock, Award, Zap, ChevronRight } from "lucide-react";

export default function DashboardPage() {
  const inProgressModules = modules.filter((m) => m.status === "in-progress");
  const totalProgress = Math.round(
    modules.reduce((sum, m) => sum + m.progress, 0) / modules.length
  );

  // Find next video to watch
  const nextVideo = (() => {
    for (const mod of modules) {
      if (mod.status === "in-progress" || mod.status === "completed") {
        const modVideos = videos.filter((v) => v.moduleId === mod.id).sort((a, b) => a.order - b.order);
        const firstUnwatched = modVideos.find((v) => !v.completed);
        if (firstUnwatched) return { ...firstUnwatched, moduleTitle: mod.title };
      }
    }
    return null;
  })();

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">
          Bon retour, {currentUser.name} 👋
        </h2>
        <p className="text-sm text-mist mt-1">
          Continuez votre progression dans la formation
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} value={`${currentUser.videosWatched}/${currentUser.totalVideos}`} label="Vidéos visionnées" />
        <StatCard icon={Clock} value={currentUser.timeSpent} label="Temps total" />
        <StatCard icon={Zap} value={`${totalProgress}%`} label="Progression globale" />
        <StatCard icon={Award} value={currentUser.certificates} label="Certificats obtenus" />
      </div>

      {/* Continue Watching */}
      {nextVideo && (
        <ContinueCard
          moduleTitle={nextVideo.moduleTitle || ""}
          videoTitle={nextVideo.title}
          progress={inProgressModules[0]?.progress || 0}
          videoId={nextVideo.id}
        />
      )}

      {/* Modules in Progress */}
      {inProgressModules.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-star-white">Modules en cours</h3>
            <Link href="/dashboard/formation" className="text-xs text-violet hover:text-magenta transition-colors flex items-center gap-1">
              Voir tout <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {inProgressModules.map((mod) => (
              <ModuleCard key={mod.id} module={mod} />
            ))}
          </div>
        </div>
      )}

      {/* Quick Access */}
      <div className="bg-surface/50 backdrop-blur-sm border border-white/[0.07] rounded-xl p-5">
        <h3 className="text-sm font-semibold text-star-white mb-3">Accès rapide</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Bibliothèque", href: "/dashboard/bibliotheque", emoji: "📚" },
            { label: "Assistant IA", href: "/dashboard/ai", emoji: "🤖" },
            { label: "Communauté", href: "/dashboard/communaute", emoji: "💬" },
            { label: "Certificats", href: "/dashboard/certificats", emoji: "🎓" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white/5 hover:bg-violet/10 hover:border-violet/30 border border-white/[0.07] transition-all duration-200 group"
            >
              <span className="text-2xl">{item.emoji}</span>
              <span className="text-xs text-mist group-hover:text-star-white transition-colors">{item.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
