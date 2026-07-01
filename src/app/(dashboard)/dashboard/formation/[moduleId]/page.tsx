"use client";
import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { modules, videos, resources } from "@/lib/mock-data";
import { VideoListItem } from "@/components/dashboard/VideoListItem";
import {
  Clock, ChevronLeft, FileText, Code, File, Download,
  CheckCircle, ArrowRight, Play
} from "lucide-react";
import { cn } from "@/lib/utils";

const resourceIcons = {
  prompt: FileText,
  code: Code,
  pdf: File,
  template: File,
};

export default function ModuleDetailPage({ params }: { params: Promise<{ moduleId: string }> }) {
  const { moduleId } = use(params);
  const router = useRouter();
  const mod = modules.find((m) => m.id === moduleId);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  if (!mod) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-mist text-sm">Module non trouvé</p>
        <Link href="/dashboard/formation" className="text-violet text-xs mt-2 hover:underline">
          Retour à la formation
        </Link>
      </div>
    );
  }

  const modVideos = videos.filter((v) => v.moduleId === moduleId).sort((a, b) => a.order - b.order);
  const modResources = resources.filter((r) => r.moduleId === moduleId);
  const completedCount = modVideos.filter((v) => v.completed).length;

  return (
    <div className="space-y-6">
      {/* Back */}
      <button
        onClick={() => router.push("/dashboard/formation")}
        className="flex items-center gap-1.5 text-xs text-mist hover:text-star-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour à la formation
      </button>

      {/* Header */}
      <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="h-2" style={{ background: `linear-gradient(90deg, ${mod.color?.from || "#7C5CFF"}, ${mod.color?.to || "#C45CFF"})` }} />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-[11px] font-medium text-violet uppercase tracking-wider">Module {mod.id}</span>
              <h1 className="text-xl font-display font-semibold text-star-white mt-1">{mod.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-[11px] text-mist">
                  <Play className="w-3.5 h-3.5 text-violet" />
                  {mod.videos} vidéos
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-mist">
                  <Clock className="w-3.5 h-3.5 text-violet" />
                  {mod.duration}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-mist">
                  <CheckCircle className="w-3.5 h-3.5 text-violet" />
                  {completedCount}/{modVideos.length}
                </span>
              </div>
            </div>

            {/* Progress ring */}
            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke="url(#gradProgress)" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 28}`} strokeDashoffset={`${2 * Math.PI * 28 * (1 - mod.progress / 100)}`} />
                </svg>
                <svg width="0" height="0"><defs><linearGradient id="gradProgress" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7C5CFF" /><stop offset="100%" stopColor="#C45CFF" /></linearGradient></defs></svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-star-white">{mod.progress}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {mod.description && (
            <p className="text-sm text-mist mt-4 leading-relaxed line-clamp-3">{mod.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video playlist */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-star-white flex items-center gap-2">
            <Play className="w-4 h-4 text-violet" />
            Liste des vidéos
          </h3>
          <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-2 space-y-0.5">
            {modVideos.map((video) => (
              <div key={video.id} className="flex items-center">
                <VideoListItem
                  video={video}
                  isActive={activeVideo === video.id}
                  onClick={() => setActiveVideo(video.id)}
                />
                {(mod.status !== "locked") && (
                  <Link
                    href={`/dashboard/watch/${video.id}`}
                    className="mr-2 p-1.5 rounded-lg text-mist hover:text-violet hover:bg-violet/10 transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {mod.status !== "locked" && activeVideo && (
            <Link
              href={`/dashboard/watch/${activeVideo}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet to-magenta text-white text-sm font-medium hover:brightness-110 transition-all"
            >
              <Play className="w-4 h-4" />
              Regarder la vidéo
            </Link>
          )}
        </div>

        {/* Resources sidebar */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-star-white flex items-center gap-2">
            <Download className="w-4 h-4 text-violet" />
            Ressources
          </h3>
          <div className="space-y-2">
            {modResources.length > 0 ? modResources.map((r) => {
              const Icon = resourceIcons[r.type];
              return (
                <div key={r.id} className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-3 hover:border-violet/30 transition-all group">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4 text-violet" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-star-white truncate">{r.title}</p>
                      <p className="text-[11px] text-mist mt-0.5 line-clamp-1">{r.description}</p>
                    </div>
                    <span className={cn(
                      "px-1.5 py-0.5 rounded text-[9px] font-medium uppercase shrink-0",
                      r.type === "prompt" && "bg-cyan-500/10 text-cyan-400",
                      r.type === "code" && "bg-emerald-500/10 text-emerald-400",
                      r.type === "pdf" && "bg-rose-500/10 text-rose-400",
                      r.type === "template" && "bg-violet/10 text-violet",
                    )}>
                      {r.type === "prompt" ? "Prompt" : r.type === "code" ? "Code" : r.type === "pdf" ? "PDF" : "Template"}
                    </span>
                  </div>
                </div>
              );
            }) : (
              <p className="text-xs text-mist text-center py-6">Aucune ressource pour ce module</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
