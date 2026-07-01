"use client";
import Link from "next/link";
import { Play } from "lucide-react";

interface ContinueCardProps {
  moduleTitle: string;
  videoTitle: string;
  progress: number;
  videoId: string;
}

export function ContinueCard({ moduleTitle, videoTitle, progress, videoId }: ContinueCardProps) {
  return (
    <div className="relative bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl overflow-hidden hover:border-violet/40 transition-all duration-200">
      <div className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-48 h-32 sm:h-auto bg-gradient-to-br from-violet/30 via-magenta/20 to-rose/10 flex items-center justify-center shrink-0">
          <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur flex items-center justify-center">
            <Play className="w-6 h-6 text-white ml-0.5" />
          </div>
        </div>
        <div className="flex-1 p-5">
          <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-violet/10 text-violet font-medium mb-2">Module en cours · {moduleTitle}</span>
          <h3 className="font-display text-base font-semibold text-star-white mb-1">{videoTitle}</h3>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: "linear-gradient(90deg, #7C5CFF, #C45CFF)" }} />
            </div>
            <span className="text-xs text-mist">{progress}%</span>
          </div>
          <Link
            href={`/dashboard/watch/${videoId}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-violet to-magenta text-white text-xs font-medium hover:brightness-110 transition-all"
          >
            <Play className="w-3.5 h-3.5" />
            Continuer
          </Link>
        </div>
      </div>
    </div>
  );
}
