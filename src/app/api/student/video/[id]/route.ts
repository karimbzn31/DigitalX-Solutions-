import { supabaseAdmin, getAuthenticatedUser } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: video, error } = await supabaseAdmin
    .from("videos")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !video) {
    return NextResponse.json({ error: "Vidéo non trouvée" }, { status: 404 });
  }

  const { data: mod } = await supabaseAdmin
    .from("modules")
    .select("id, title, title_short, color_from, color_to")
    .eq("id", video.module_id)
    .single();

  const { data: progress } = await supabaseAdmin
    .from("video_progress")
    .select("watched")
    .eq("user_id", user.id)
    .eq("video_id", params.id)
    .maybeSingle();

  const { data: allVideos } = await supabaseAdmin
    .from("videos")
    .select("id, module_id, title, duration, order_index")
    .eq("module_id", video.module_id)
    .order("order_index", { ascending: true });

  const { data: allProgress } = await supabaseAdmin
    .from("video_progress")
    .select("video_id, watched")
    .eq("user_id", user.id);

  const watchedMap = new Map((allProgress || []).map(p => [p.video_id, p.watched]));

  const enrichedVideos = (allVideos || []).map(v => ({
    ...v, completed: watchedMap.get(v.id) || false,
  }));

  return NextResponse.json({
    video: { ...video, completed: progress?.watched || false },
    module: mod || null,
    moduleVideos: enrichedVideos,
  });
}
