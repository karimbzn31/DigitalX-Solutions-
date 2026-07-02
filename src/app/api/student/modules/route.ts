import { supabaseAdmin, getAuthenticatedUser } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: modules, error } = await supabaseAdmin
    .from("modules")
    .select("*")
    .order("order_index", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get progress for all videos
  const { data: progress } = await supabaseAdmin
    .from("video_progress")
    .select("video_id, watched")
    .eq("user_id", user.id);

  const watchedVideoIds = new Set((progress || []).filter(p => p.watched).map(p => p.video_id));

  // Get video counts per module
  const { data: allVideos } = await supabaseAdmin.from("videos").select("id, module_id");
  const videosByModule: Record<string, number> = {};
  const watchedByModule: Record<string, number> = {};

  for (const v of allVideos || []) {
    videosByModule[v.module_id] = (videosByModule[v.module_id] || 0) + 1;
    if (watchedVideoIds.has(v.id)) {
      watchedByModule[v.module_id] = (watchedByModule[v.module_id] || 0) + 1;
    }
  }

  const totalVideos = allVideos?.length || 0;
  const totalWatched = watchedVideoIds.size;

  const enriched = (modules || []).map((m) => {
    const total = videosByModule[m.id] || 0;
    const watched = watchedByModule[m.id] || 0;
    const progressPct = total > 0 ? Math.round((watched / total) * 100) : 0;
    return {
      ...m,
      videos: total,
      progress: progressPct,
      status: progressPct === 100 ? "completed" : progressPct > 0 ? "in-progress" : "locked",
    };
  });

  return NextResponse.json({
    modules: enriched,
    stats: { totalVideos, totalWatched },
  });
}
