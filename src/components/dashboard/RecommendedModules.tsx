"use client";
import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { getRecommendedModuleIds, getOnboardingData } from "@/lib/recommendations";

interface Mod {
  id: string; title: string; description: string; videos: number;
  duration: string; level: string; progress: number; status: string;
  color_from: string; color_to: string;
}

export function RecommendedModules({ modules }: { modules: Mod[] }) {
  const recommendedIds = useMemo(() => {
    const data = getOnboardingData();
    if (!data) return [];
    return getRecommendedModuleIds(data);
  }, []);

  if (recommendedIds.length === 0) return null;

  const recommended = modules.filter((m) => recommendedIds.includes(m.id));

  if (recommended.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-4 h-4 text-violet" />
        <h3 className="text-sm font-semibold text-star-white">Recommandé pour vous</h3>
        <span className="text-[10px] text-mist bg-white/5 px-2 py-0.5 rounded-full">
          selon votre profil
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {recommended.map((mod) => (
          <Link
            key={mod.id}
            href={mod.status === "locked" ? "#" : `/dashboard/formation/${mod.id}`}
            className={`group relative overflow-hidden rounded-xl border ${
              mod.status === "locked"
                ? "border-white/[0.04] opacity-50 cursor-not-allowed"
                : "border-white/[0.07] hover:border-violet/30"
            } bg-surface/50 p-4 transition-all`}
          >
            <div
              className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity"
              style={{
                background: `linear-gradient(135deg, ${mod.color_from || "#6366F1"}, ${mod.color_to || "#8B5CF6"})`,
              }}
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-[10px] font-medium px-1.5 py-0.5 rounded-full"
                  style={{
                    backgroundColor: `${mod.color_from || "#6366F1"}15`,
                    color: mod.color_from || "#6366F1",
                  }}
                >
                  {mod.level}
                </span>
              </div>
              <p className="text-sm font-medium text-star-white group-hover:text-violet transition-colors leading-snug">
                {mod.title}
              </p>
              <p className="text-[11px] text-mist mt-1 line-clamp-2">{mod.description}</p>
              <div className="flex items-center gap-3 mt-3 text-[10px] text-mist">
                <span>{mod.videos} vidéos</span>
                <span>{mod.duration}</span>
                {mod.status === "in-progress" && (
                  <span className="text-violet">{mod.progress}%</span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
}
