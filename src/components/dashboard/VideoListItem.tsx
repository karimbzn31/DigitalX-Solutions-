"use client";
import { cn } from "@/lib/utils";
import { Play, CheckCircle } from "lucide-react";
import type { Video } from "@/types";

interface VideoListItemProps {
  video: Video;
  isActive?: boolean;
  onClick?: () => void;
}

export function VideoListItem({ video, isActive, onClick }: VideoListItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg transition-all duration-150 group",
        isActive ? "bg-violet/15 border-l-2 border-violet" : "hover:bg-violet/5 hover:translate-x-0.5"
      )}
    >
      <div className="w-6 h-6 rounded-full flex items-center justify-center shrink-0">
        {video.completed ? (
          <CheckCircle className="w-4 h-4 text-emerald-400" />
        ) : (
          <Play className={cn("w-4 h-4", isActive ? "text-violet" : "text-mist group-hover:text-violet transition-colors")} />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn("text-xs truncate", isActive ? "text-violet font-medium" : "text-star-white")}>{video.title}</p>
      </div>
      <span className="text-[11px] text-mist shrink-0">{video.duration}</span>
    </button>
  );
}
