import { NextResponse } from "next/server";
import { getAuthenticatedUserWithClient, supabaseAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, supabase } = await getAuthenticatedUserWithClient();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const [modulesResult, progressResult, allVideosResult] = await Promise.all([
    supabase.from("modules").select("*").order("order_index", { ascending: true }),
    supabase.from("video_progress").select("video_id, watched").eq("user_id", user.id),
    supabaseAdmin.from("videos").select("id, module_id, title, duration, order_index").order("order_index", { ascending: true }),
  ]);

  const { data: modules, error } = modulesResult;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const progress = progressResult.data || [];
  const allVideos = allVideosResult.data || [];

  const watchedVideoIds = new Set(progress.filter(p => p.watched).map(p => p.video_id));

  const videosByModule: Record<string, typeof allVideos> = {};
  const watchedByModule: Record<string, number> = {};

  for (const v of allVideos) {
    if (!videosByModule[v.module_id]) videosByModule[v.module_id] = [];
    videosByModule[v.module_id].push(v);
    if (watchedVideoIds.has(v.id)) {
      watchedByModule[v.module_id] = (watchedByModule[v.module_id] || 0) + 1;
    }
  }

  const totalVideos = allVideos.length;
  const totalWatched = watchedVideoIds.size;

  let firstNextVideo: { id: string; moduleId: string; title: string; duration: string; moduleTitle: string; moduleProgress: number } | null = null;

  const enriched = (modules || []).map((m) => {
    const moduleVideos = videosByModule[m.id] || [];
    const total = moduleVideos.length;
    const watched = watchedByModule[m.id] || 0;
    const progressPct = total > 0 ? Math.round((watched / total) * 100) : 0;
    const status = progressPct === 100 ? "completed" : progressPct > 0 ? "in-progress" : "locked";

    const firstUnwatched = moduleVideos.find((v) => !watchedVideoIds.has(v.id));

    if (!firstNextVideo && firstUnwatched && (status === "in-progress" || status === "completed")) {
      firstNextVideo = {
        id: firstUnwatched.id,
        moduleId: m.id,
        title: firstUnwatched.title,
        duration: firstUnwatched.duration,
        moduleTitle: m.title,
        moduleProgress: progressPct,
      };
    }

    return {
      ...m,
      videos: total,
      progress: progressPct,
      status,
      nextVideo: firstUnwatched ? { id: firstUnwatched.id, title: firstUnwatched.title, duration: firstUnwatched.duration } : null,
    };
  });

  return NextResponse.json({
    modules: enriched,
    nextVideo: firstNextVideo,
    stats: { totalVideos, totalWatched },
  });
}
