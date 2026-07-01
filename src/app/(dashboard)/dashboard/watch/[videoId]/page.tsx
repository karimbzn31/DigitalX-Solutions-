"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/useAppStore";
import { videos, modules } from "@/lib/mock-data";
import { VideoListItem } from "@/components/dashboard/VideoListItem";
import { ChevronLeft, Play, CheckCircle, FileText, MessageCircle } from "lucide-react";

export default function WatchPage({ params }: { params: { videoId: string } }) {
  const { videoId } = params;
  const router = useRouter();
  const watchedVideos = useAppStore((s) => s.watchedVideos);
  const setVideoWatched = useAppStore((s) => s.setVideoWatched);
  const isWatched = watchedVideos[videoId] ?? false;

  const video = videos.find((v) => v.id === videoId);
  if (!video) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-mist text-sm">Vidéo non trouvée</p>
        <Link href="/dashboard/formation" className="text-violet text-xs mt-2 hover:underline">Retour</Link>
      </div>
    );
  }

  const mod = modules.find((m) => m.id === video.moduleId);
  const modVideos = videos.filter((v) => v.moduleId === video.moduleId).sort((a, b) => a.order - b.order);
  const currentIndex = modVideos.findIndex((v) => v.id === videoId);
  const nextVideo = currentIndex < modVideos.length - 1 ? modVideos[currentIndex + 1] : null;
  const prevVideo = currentIndex > 0 ? modVideos[currentIndex - 1] : null;

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        onClick={() => router.push(`/dashboard/formation/${video.moduleId}`)}
        className="flex items-center gap-1.5 text-xs text-mist hover:text-star-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        Retour au module
      </button>

      <div className="bg-surface/70 border border-white/[0.07] rounded-xl overflow-hidden">
        <div className="aspect-video bg-gradient-to-br from-violet/30 via-magenta/20 to-rose/10 flex items-center justify-center relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
          </div>
          {isWatched && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-medium backdrop-blur border border-emerald-500/20">
              <CheckCircle className="w-3.5 h-3.5" />
              Terminé
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
          <button
            onClick={() => setVideoWatched(videoId, !isWatched)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all shrink-0 ${
              isWatched
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20"
                : "bg-violet/10 text-violet border border-violet/20 hover:bg-violet/20"
            }`}
          >
            <CheckCircle className="w-3.5 h-3.5" />
            {isWatched ? "Marquer comme non visionné" : "Marquer comme visionné"}
          </button>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          {prevVideo ? (
            <Link
              href={`/dashboard/watch/${prevVideo.id}`}
              className="flex items-center gap-1.5 text-xs text-mist hover:text-star-white transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              {prevVideo.title.length > 25 ? prevVideo.title.slice(0, 25) + "..." : prevVideo.title}
            </Link>
          ) : <div />}
          {nextVideo && (
            <Link
              href={`/dashboard/watch/${nextVideo.id}`}
              className="flex items-center gap-1.5 text-xs bg-gradient-to-r from-violet to-magenta text-white px-4 py-2 rounded-lg hover:brightness-110 transition-all"
            >
              Suivant
              <ChevronLeft className="w-4 h-4 rotate-180" />
            </Link>
          )}
        </div>
      </div>

      <div className="lg:hidden">
        <h3 className="text-sm font-semibold text-star-white mb-3">Liste des vidéos</h3>
        <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-2 space-y-0.5">
          {modVideos.map((v) => (
            <Link key={v.id} href={`/dashboard/watch/${v.id}`}>
              <VideoListItem video={v} isActive={v.id === videoId} />
            </Link>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href={`/dashboard/formation/${video.moduleId}`}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 text-mist hover:text-star-white hover:bg-white/10 text-xs font-medium transition-all"
        >
          <FileText className="w-3.5 h-3.5" />
          Ressources du module
        </Link>
        <Link
          href="/dashboard/ai"
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 text-mist hover:text-star-white hover:bg-white/10 text-xs font-medium transition-all"
        >
          <MessageCircle className="w-3.5 h-3.5" />
          Poser une question à l&apos;IA
        </Link>
      </div>
    </div>
  );
}
