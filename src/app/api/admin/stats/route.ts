import { supabaseAdmin, requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { data: profiles } = await supabaseAdmin.from("profiles").select("*");

  const total = profiles?.length || 0;
  const pending = profiles?.filter((p) => p.status === "pending" && !p.validation_code).length || 0;
  const active = profiles?.filter((p) => p.status === "active").length || 0;
  const blocked = profiles?.filter((p) => p.status === "blocked").length || 0;
  const admins = profiles?.filter((p) => p.is_admin).length || 0;

  // Daily registrations (last 7 days)
  const daily: { day: string; count: number }[] = [];
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStart = new Date(d); dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d); dayEnd.setHours(23, 59, 59, 999);
    const count = profiles?.filter((p) => {
      const c = new Date(p.created_at);
      return c >= dayStart && c <= dayEnd;
    }).length || 0;
    daily.push({ day: days[d.getDay()], count });
  }

  // Module completion data
  const { data: modules } = await supabaseAdmin.from("modules").select("id, title, color_from");
  const { data: allVideos } = await supabaseAdmin.from("videos").select("id, module_id");
  const { data: allProgress } = await supabaseAdmin.from("video_progress").select("video_id, watched");

  const videoCountByModule: Record<string, number> = {};
  for (const v of allVideos || []) {
    videoCountByModule[v.module_id] = (videoCountByModule[v.module_id] || 0) + 1;
  }

  const watchedByModule: Record<string, Set<string>> = {};
  for (const p of allProgress || []) {
    if (p.watched) {
      const v = allVideos?.find(vv => vv.id === p.video_id);
      if (v) {
        watchedByModule[v.module_id] = watchedByModule[v.module_id] || new Set();
        watchedByModule[v.module_id].add(p.video_id);
      }
    }
  }

  const moduleCompletion = (modules || []).map((m, i) => {
    const totalVids = videoCountByModule[m.id] || 0;
    const uniqueWatched = watchedByModule[m.id]?.size || 0;
    const colors = ["#06b6d4", "#6366f1", "#ec4899", "#f59e0b", "#22c55e", "#a855f7"];
    return {
      name: m.title.length > 20 ? m.title.slice(0, 20) + "..." : m.title,
      completions: totalVids > 0 ? Math.round((uniqueWatched / totalVids) * (active || 1)) : 0,
      color: colors[i % colors.length],
    };
  });

  return Response.json({
    total, pending, active, blocked, admins, daily, moduleCompletion,
    totalVideos: allVideos?.length || 0,
    totalProgress: allProgress?.length || 0,
  });
}
