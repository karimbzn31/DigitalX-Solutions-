"use client";
import { useState, useEffect, useId } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VideoListItem } from "@/components/dashboard/VideoListItem";
import { Clock, ChevronLeft, FileText, Code, File, Download, CheckCircle, ArrowRight, Play } from "lucide-react";
import { cn } from "@/lib/utils";

interface Module {
  id: string; title: string; title_short: string; description: string;
  videos: number; duration: string; level: string; progress: number;
  status: string; color_from: string; color_to: string;
}

interface Video {
  id: string; module_id: string; title: string; description: string;
  url: string; duration: string; order_index: number; completed: boolean;
}

interface Resource {
  id: string; module_id: string; type: string; title: string;
  description: string; url: string; content: string;
}

import type { FC } from "react";
const resourceIcons: Record<string, FC<{ className?: string }>> = { prompt: FileText, code: Code, pdf: File, link: Download, zip: File };

const resourceLabels: Record<string, string> = {
  prompt: "Prompt", code: "Code", pdf: "PDF", link: "Lien", zip: "Projet"
};

const resourceColors: Record<string, string> = {
  prompt: "bg-cyan-500/10 text-cyan-400",
  code: "bg-emerald-500/10 text-emerald-400",
  pdf: "bg-rose-500/10 text-rose-400",
  link: "bg-violet/10 text-violet",
  zip: "bg-amber-500/10 text-amber-400",
};

export default function ModuleDetailPage({ params }: { params: { moduleId: string } }) {
  const gradientId = useId();
  const { moduleId } = params;
  const router = useRouter();
  const [mod, setMod] = useState<Module | null>(null);
  const [modVideos, setModVideos] = useState<Video[]>([]);
  const [modResources, setModResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/student/modules").then(r => r.json()),
      fetch(`/api/student/videos?moduleId=${moduleId}`).then(r => r.json()),
      fetch(`/api/student/resources?moduleId=${moduleId}`).then(r => r.json()),
    ]).then(([modulesData, videosData, resourcesData]) => {
      const found = (modulesData.modules || []).find((m: Module) => m.id === moduleId);
      setMod(found || null);
      setModVideos(videosData.videos || []);
      setModResources(resourcesData.resources || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [moduleId]);

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!mod) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-mist text-sm">Module non trouvé</p>
        <Link href="/dashboard/formation" className="text-violet text-xs mt-2 hover:underline">Retour à la formation</Link>
      </div>
    );
  }

  const completedCount = modVideos.filter((v) => v.completed).length;

  return (
    <div className="space-y-6">
      <button onClick={() => router.push("/dashboard/formation")}
        className="flex items-center gap-1.5 text-xs text-mist hover:text-star-white transition-colors">
        <ChevronLeft className="w-4 h-4" /> Retour à la formation
      </button>

      <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="h-2" style={{ background: `linear-gradient(90deg, ${mod.color_from || "#7C5CFF"}, ${mod.color_to || "#C45CFF"})` }} />
        <div className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <span className="text-[11px] font-medium text-violet uppercase tracking-wider">Module {moduleId.slice(0, 8)}</span>
              <h1 className="text-xl font-display font-semibold text-star-white mt-1">{mod.title}</h1>
              <div className="flex items-center gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-[11px] text-mist">
                  <Play className="w-3.5 h-3.5 text-violet" /> {mod.videos} vidéos
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-mist">
                  <Clock className="w-3.5 h-3.5 text-violet" /> {mod.duration}
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-mist">
                  <CheckCircle className="w-3.5 h-3.5 text-violet" /> {completedCount}/{modVideos.length}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative w-16 h-16">
                <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                  <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
                  <circle cx="32" cy="32" r="28" fill="none" stroke={`url(#${gradientId})`} strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - mod.progress / 100)}`} />
                </svg>
                <svg width="0" height="0"><defs><linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#7C5CFF" /><stop offset="100%" stopColor="#C45CFF" /></linearGradient></defs></svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-sm font-bold text-star-white">{mod.progress}%</span>
                </div>
              </div>
            </div>
          </div>

          {mod.description && (
            <p className="text-sm text-mist mt-4 leading-relaxed line-clamp-3">{mod.description}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-semibold text-star-white flex items-center gap-2">
            <Play className="w-4 h-4 text-violet" /> Liste des vidéos
          </h3>
          <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-2 space-y-0.5">
            {modVideos.map((video) => (
              <div key={video.id} className="flex items-center">
                <VideoListItem video={{ id: video.id, title: video.title, duration: video.duration, completed: video.completed, order: video.order_index, moduleId: video.module_id }}
                  isActive={activeVideo === video.id} onClick={() => setActiveVideo(video.id)} />
                {(mod.status !== "locked") && (
                  <Link href={`/dashboard/watch/${video.id}`}
                    className="mr-2 p-1.5 rounded-lg text-mist hover:text-violet hover:bg-violet/10 transition-colors">
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                )}
              </div>
            ))}
          </div>

          {mod.status !== "locked" && activeVideo && (
            <Link href={`/dashboard/watch/${activeVideo}`}
              className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-gradient-to-r from-violet to-magenta text-white text-sm font-medium hover:brightness-110 transition-all">
              <Play className="w-4 h-4" /> Regarder la vidéo
            </Link>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-star-white flex items-center gap-2">
            <Download className="w-4 h-4 text-violet" /> Ressources
          </h3>
          <div className="space-y-2">
            {modResources.length > 0 ? modResources.map((r) => {
              const Icon = resourceIcons[r.type] || File;
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
                    <span className={cn("px-1.5 py-0.5 rounded text-[9px] font-medium uppercase shrink-0", resourceColors[r.type] || "bg-white/5 text-white/60")}>
                      {resourceLabels[r.type] || r.type}
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
