"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { GlowCard } from "@/components/dashboard/GlowCard";
import { HeroSection } from "@/components/dashboard/HeroSection";
import { CircularProgress } from "@/components/dashboard/CircularProgress";
import { DailyTip } from "@/components/dashboard/DailyTip";
import { ProgressTimeline } from "@/components/dashboard/ProgressTimeline";
import { StatsChart } from "@/components/dashboard/StatsChart";
import { ConfettiEffect, useConfetti } from "@/components/dashboard/ConfettiEffect";
import { DashboardSkeleton } from "@/components/dashboard/SkeletonCard";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { ContinueCard } from "@/components/dashboard/ContinueCard";
import { BookOpen, Clock, Award, ChevronRight, Rocket, TrendingUp, Zap, Flame, Sparkles } from "lucide-react";
import { useGamificationStore, getLevelTitle, ALL_BADGES, getNextLevelXp } from "@/store/useGamificationStore";
import { RecommendedModules } from "@/components/dashboard/RecommendedModules";

interface Mod {
  id: string; title: string; title_short: string; description: string;
  videos: number; duration: string; level: string; progress: number;
  status: string; color_from: string; color_to: string;
}

interface VideoItem {
  id: string; module_id: string; title: string; duration: string;
  order_index: number; completed: boolean;
}

function getLevel(progress: number): string {
  if (progress >= 75) return "Architecte IA";
  if (progress >= 50) return "Fondateur";
  if (progress >= 25) return "Vibe Coder";
  return "Apprenti IA";
}

export default function DashboardPage() {
  const user = useAppStore((s) => s.user);
  const [modules, setModules] = useState<Mod[]>([]);
  const [stats, setStats] = useState({ totalVideos: 0, watchedVideos: 0, progress: 0 });
  const [nextVideo, setNextVideo] = useState<VideoItem & { moduleTitle: string; moduleProgress: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const confetti = useConfetti();
  const levelNum = useGamificationStore((s) => s.level);
  const xp = useGamificationStore((s) => s.xp);
  const streak = useGamificationStore((s) => s.streak);
  const badges = useGamificationStore((s) => s.badges);

  const nextLevelXp = getNextLevelXp(xp);
  const levelTitle = getLevelTitle(xp);
  const earnedBadges = ALL_BADGES.filter((b) => badges.some((e) => e.id === b.id));

  useEffect(() => {
    Promise.all([
      fetch("/api/student/modules").then(r => r.json()),
      fetch("/api/student/progress").then(r => r.json()),
    ]).then(([modulesData, progressData]) => {
      const mods = modulesData.modules || [];
      setModules(mods);
      setStats(progressData.stats || { totalVideos: 0, watchedVideos: 0, progress: 0 });

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

  const timelineModules = modules.map((m) => ({
    id: m.id,
    title: m.title_short || m.title,
    progress: m.progress,
    status: m.status as "completed" | "in-progress" | "locked",
    videos: m.videos,
    duration: m.duration,
  }));

  const inProgressModules = modules.filter((m) => m.status === "in-progress" || m.status === "locked").slice(0, 3);

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <ConfettiEffect trigger={confetti.show} onComplete={confetti.done} />

      {/* Hero */}
      <HeroSection
        name={user?.name || "Apprenant"}
        level={levelTitle}
        progress={totalProgress}
      />

      {/* Daily Tip */}
      <DailyTip />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <GlowCard delay={0.05} className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-violet" />
            </div>
            <div>
              <p className="text-2xl font-bold text-star-white">{stats.watchedVideos}/{stats.totalVideos}</p>
              <p className="text-xs text-mist">Vidéos visionnées</p>
            </div>
          </div>
        </GlowCard>

        <GlowCard delay={0.1} className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-soft/20 to-violet/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-cyan-soft" />
            </div>
            <div>
              <p className="text-2xl font-bold text-star-white">{user?.timeSpent || "0h"}</p>
              <p className="text-xs text-mist">Temps total</p>
            </div>
          </div>
        </GlowCard>

        <GlowCard delay={0.15} className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-400/20 to-cyan-soft/10 flex items-center justify-center shrink-0">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-star-white">{totalProgress}%</p>
              <p className="text-xs text-mist">Progression globale</p>
            </div>
          </div>
        </GlowCard>

        <GlowCard delay={0.2} className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400/20 to-rose/10 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-star-white">{user?.certificates || 0}</p>
              <p className="text-xs text-mist">Certificats</p>
            </div>
          </div>
        </GlowCard>
      </div>

      {/* Gamification bar */}
      {(xp > 0 || streak > 0 || badges.length > 0) && (
        <GlowCard delay={0.25} className="p-4">
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-violet/15 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-violet" />
              </div>
              <div>
                <p className="text-sm font-bold text-star-white">{levelTitle}</p>
                <p className="text-[10px] text-mist">Niveau {levelNum}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <div>
                <p className="text-sm font-bold text-star-white">{xp} <span className="text-[10px] font-normal text-mist">XP</span></p>
                <div className="w-20 h-1.5 rounded-full bg-white/5 mt-0.5">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-violet to-amber-400 transition-all duration-500"
                    style={{ width: `${Math.min((xp / (nextLevelXp || 1)) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            {streak > 0 && (
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <div>
                  <p className="text-sm font-bold text-star-white">{streak}</p>
                  <p className="text-[10px] text-mist">Jours consécutifs</p>
                </div>
              </div>
            )}

            {earnedBadges.length > 0 && (
              <div className="flex items-center gap-1.5">
                {earnedBadges.slice(0, 4).map((badge) => (
                  <div
                    key={badge.id}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs bg-violet/15"
                    title={badge.name}
                  >
                    {badge.icon}
                  </div>
                ))}
                {earnedBadges.length > 4 && (
                  <span className="text-[10px] text-mist">+{earnedBadges.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </GlowCard>
      )}

      {/* Recommended Modules */}
      <RecommendedModules modules={modules} />

      {/* Continue Watching + Progress Ring */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Left: Continue + Chart */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          {nextVideo && (
            <GlowCard delay={0.25}>
              <ContinueCard
                videoId={nextVideo.id}
                videoTitle={nextVideo.title}
                moduleTitle={nextVideo.moduleTitle}
                progress={nextVideo.moduleProgress}
              />
            </GlowCard>
          )}

          {hasNoActivity && modules.length > 0 && (
            <GlowCard delay={0.25}>
              <Link
                href={`/dashboard/formation/${modules[0].id}`}
                className="group flex items-center justify-between p-5 rounded-xl bg-gradient-to-r from-violet/20 via-magenta/10 to-rose/5 border border-violet/20 hover:border-violet/40 transition-all"
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
            </GlowCard>
          )}

          {/* Stats Chart */}
          <StatsChart />
        </div>

        {/* Right: Circular Progress + Timeline */}
        <div className="space-y-4 sm:space-y-6">
          {/* Circular Progress */}
          <GlowCard delay={0.3} className="p-6 flex flex-col items-center">
            <CircularProgress value={totalProgress} size={140} label="Progression globale" />
            <div className="grid grid-cols-3 gap-4 mt-4 w-full pt-4 border-t border-white/5">
              <div className="text-center">
                <p className="text-lg font-bold text-violet">{modules.length}</p>
                <p className="text-[10px] text-mist">Modules</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-emerald-400">
                  {modules.filter(m => m.status === "completed").length}
                </p>
                <p className="text-[10px] text-mist">Terminés</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-amber-400">
                  {modules.filter(m => m.status === "in-progress").length}
                </p>
                <p className="text-[10px] text-mist">En cours</p>
              </div>
            </div>
          </GlowCard>

          {/* Timeline */}
          <GlowCard delay={0.35} className="p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-star-white">Parcours</h3>
              <Link href="/dashboard/formation" className="text-[11px] text-violet hover:underline">Voir tout</Link>
            </div>
            <ProgressTimeline modules={timelineModules} />
          </GlowCard>

          {/* Badges */}
          {earnedBadges.length > 0 && (
            <GlowCard delay={0.4} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-star-white">Badges</h3>
                <span className="text-[11px] text-mist">{earnedBadges.length}/{ALL_BADGES.length}</span>
              </div>
              <div className="grid grid-cols-4 gap-3">
                {ALL_BADGES.map((badge) => {
                  const earned = badges.some((b) => b.id === badge.id);
                  return (
                    <div
                      key={badge.id}
                      className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                        earned ? "opacity-100" : "opacity-25 grayscale"
                      }`}
                      title={earned ? badge.name : "Badge à débloquer"}
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm bg-violet/15"
                      >
                        {badge.icon}
                      </div>
                      <span className="text-[9px] text-mist text-center leading-tight">{badge.name}</span>
                    </div>
                  );
                })}
              </div>
            </GlowCard>
          )}
        </div>
      </div>

      {/* Modules en cours */}
      {inProgressModules.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-star-white">Formations en cours</h3>
            <Link href="/dashboard/formation" className="text-xs text-violet hover:underline">Voir tout</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {inProgressModules.map((mod, i) => (
              <GlowCard key={mod.id} delay={0.4 + i * 0.1}>
                <ModuleCard module={{ ...mod, status: mod.status as "completed" | "in-progress" | "locked" | undefined, color: { from: mod.color_from || "#6366F1", to: mod.color_to || "#8B5CF6" } }} />
              </GlowCard>
            ))}
          </div>
        </div>
      )}

      {modules.length === 0 && !loading && (
        <div className="text-center py-12 text-white/30 text-sm">
          Aucune formation disponible pour le moment
        </div>
      )}
    </div>
  );
}
