import { NextResponse } from "next/server";
import { getAuthenticatedUserWithClient, supabaseAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { user, supabase } = await getAuthenticatedUserWithClient();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: video, error } = await supabase
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

  const { data: progress } = await supabase
    .from("video_progress")
    .select("watched")
    .eq("user_id", user.id)
    .eq("video_id", params.id)
    .maybeSingle();

  const { data: allVideos } = await supabase
    .from("videos")
    .select("id, module_id, title, duration, order_index")
    .eq("module_id", video.module_id)
    .order("order_index", { ascending: true });

  const { data: allProgress } = await supabase
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
