"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { VideoListItem } from "@/components/dashboard/VideoListItem";
import { ChevronLeft, Play, CheckCircle, FileText, MessageCircle } from "lucide-react";

interface VideoData {
  id: string; module_id: string; title: string; description: string;
  url: string; duration: string; order_index: number; completed: boolean;
}
interface ModuleData { id: string; title: string; title_short: string; color_from: string; color_to: string; }

export default function WatchPage({ params }: { params: { videoId: string } }) {
  const { videoId } = params;
  const router = useRouter();
  const [video, setVideo] = useState<VideoData | null>(null);
  const [mod, setMod] = useState<ModuleData | null>(null);
  const [modVideos, setModVideos] = useState<VideoData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student/video/${videoId}`)
      .then(r => r.json())
      .then(data => {
        setVideo(data.video || null);
        setMod(data.module || null);
        setModVideos(data.moduleVideos || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [videoId]);

  const toggleWatched = async () => {
    if (!video) return;
    const res = await fetch("/api/student/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoId: video.id, watched: !video.completed }),
    });
    if (res.ok) {
      const newCompleted = !video.completed;
      setVideo({ ...video, completed: newCompleted });
      setModVideos(prev => prev.map(v => v.id === video.id ? { ...v, completed: newCompleted } : v));
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" /></div>;
  }

  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-mist text-sm">Vidéo non trouvée</p>
        <Link href="/dashboard/formation" className="text-violet text-xs mt-2 hover:underline">Retour</Link>
      </div>
    );
  }

  const currentIndex = modVideos.findIndex((v) => v.id === videoId);
  const nextVideo = currentIndex < modVideos.length - 1 ? modVideos[currentIndex + 1] : null;
  const prevVideo = currentIndex > 0 ? modVideos[currentIndex - 1] : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <button onClick={() => router.push(`/dashboard/formation/${video.module_id}`)}
        className="flex items-center gap-1.5 text-xs text-mist hover:text-star-white transition-colors">
        <ChevronLeft className="w-4 h-4" /> Retour au module
      </button>

      <div className="bg-surface/70 border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-violet/30 via-magenta/20 to-rose/10 flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
          {video.completed && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-medium backdrop-blur border border-emerald-500/20">
              <CheckCircle className="w-3.5 h-3.5" /> Terminé
            </div>
          )}
        </div>
      </div>

      <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <span className="text-[11px] text-violet font-medium">{mod?.title}</span>
            <h1 className="text-lg font-display font-semibold text-star-white mt-0.5">{video.title}</h1>
            <span className="text-xs text-mist">{video.duration}</span>
          </div>
          <button onClick={toggleWatched}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
              video.completed
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                : "bg-violet/10 text-violet border border-violet/20 hover:bg-violet/20"
            }`}>
            <CheckCircle className="w-3.5 h-3.5" />
            {video.completed ? "Marquer comme non visionné" : "Marquer comme visionné"}
          </button>
        </div>

        {video.description && (
          <p className="text-sm text-mist mt-4 pt-4 border-t border-white/5">{video.description}</p>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          {prevVideo ? (
            <Link href={`/dashboard/watch/${prevVideo.id}`}
              className="flex items-center gap-1.5 text-xs text-mist hover:text-star-white transition-colors max-w-[45%]">
              <ChevronLeft className="w-4 h-4 shrink-0" />
              <span className="truncate">{prevVideo.title}</span>
            </Link>
          ) : <div />}
          {nextVideo && (
            <Link href={`/dashboard/watch/${nextVideo.id}`}
              className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-violet to-magenta text-white px-4 py-2 rounded-lg hover:brightness-110 transition-all shrink-0">
              Suivant <ChevronLeft className="w-4 h-4 rotate-180" />
            </Link>
          )}
        </div>
      </div>

      <div className="lg:hidden">
        <h3 className="text-sm font-semibold text-star-white mb-3">Liste des vidéos</h3>
        <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-2 space-y-0.5">
          {modVideos.map((v) => (
            <Link key={v.id} href={`/dashboard/watch/${v.id}`}>
              <VideoListItem video={{ id: v.id, title: v.title, duration: v.duration, completed: v.completed, order: v.order_index, moduleId: v.module_id }}
                isActive={v.id === videoId} />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link href={`/dashboard/formation/${video.module_id}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 text-mist hover:text-star-white hover:bg-white/10 text-xs font-medium transition-all">
          <FileText className="w-3.5 h-3.5" /> Ressources du module
        </Link>
        <Link href="/dashboard/ai"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 text-mist hover:text-star-white hover:bg-white/10 text-xs font-medium transition-all">
          <MessageCircle className="w-3.5 h-3.5" /> Poser une question à l&apos;IA
        </Link>
      </div>
    </div>
  );
}
