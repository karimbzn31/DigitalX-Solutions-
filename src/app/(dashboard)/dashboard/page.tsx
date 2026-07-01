"use client";
import Link from "next/link";
import { modules, videos, currentUser } from "@/lib/mock-data";
import { useAppStore } from "@/store/useAppStore";
import { StatCard } from "@/components/dashboard/StatCard";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { ContinueCard } from "@/components/dashboard/ContinueCard";
import { BookOpen, Clock, Award, Zap, ChevronRight, Rocket } from "lucide-react";

export default function DashboardPage() {
  const inProgressModules = modules.filter((m) => m.status === "in-progress");
  const totalProgress = Math.round(
    modules.reduce((sum, m) => sum + m.progress, 0) / modules.length
  );

  const watchedVideos = useAppStore((s) => s.watchedVideos);
  const totalWatched = Object.values(watchedVideos).filter(Boolean).length;

  const nextVideo = (() => {
    for (const mod of modules) {
      if (mod.status === "in-progress" || mod.status === "completed") {
        const modVideos = videos.filter((v) => v.moduleId === mod.id).sort((a, b) => a.order - b.order);
        const firstUnwatched = modVideos.find((v) => !v.completed && !watchedVideos[v.id]);
        if (firstUnwatched) return { ...firstUnwatched, moduleTitle: mod.title, moduleProgress: mod.progress };
      }
    }
    return null;
  })();

  const hasNoActivity = modules.every((m) => m.status === "locked" || (m.status === "in-progress" && m.progress === 0));

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">
          Bon retour, {currentUser.name} 👋
        </h2>
        <p className="text-sm text-mist mt-1">
          {hasNoActivity
            ? "Prêt à commencer votre formation ?"
            : "Continuez votre progression dans la formation"}
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} value={`${(currentUser.videosWatched ?? 0) + totalWatched}/${currentUser.totalVideos}`} label="Vidéos visionnées" />
        <StatCard icon={Clock} value={currentUser.timeSpent ?? ""} label="Temps total" />
        <StatCard icon={Zap} value={`${totalProgress}%`} label="Progression globale" />
        <StatCard icon={Award} value={currentUser.certificates ?? 0} label="Certificats obtenus" />
      </div>

      {hasNoActivity ? (
        <div className="bg-surface/50 backdrop-blur-sm border border-white/[0.07] rounded-xl p-12 text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center mx-auto mb-4">
            <Rocket className="w-7 h-7 text-violet" />
          </div>
          <h3 className="text-lg font-display font-semibold text-star-white mb-2">Bienvenue dans votre formation</h3>
          <p className="text-sm text-mist mb-6 max-w-md mx-auto">
            Commencez par explorer les modules disponibles. Votre progression sera suivie automatiquement.
          </p>
          <Link
            href="/dashboard/formation"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet to-magenta text-white text-sm font-medium hover:brightness-110 transition-all"
          >
            Voir les modules <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <>
          {nextVideo && (
            <ContinueCard
              moduleTitle={nextVideo.moduleTitle || ""}
              videoTitle={nextVideo.title}
              progress={nextVideo.moduleProgress ?? 0}
              videoId={nextVideo.id}
            />
          )}

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
        </>
      )}

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
