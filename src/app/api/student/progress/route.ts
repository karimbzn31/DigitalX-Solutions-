import { NextResponse } from "next/server";
import { getAuthenticatedUserWithClient } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const { user, supabase } = await getAuthenticatedUserWithClient();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: progress, error } = await supabase
    .from("video_progress")
    .select("*")
    .eq("user_id", user.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: allVideos } = await supabase.from("videos").select("id", { count: "exact", head: true });
  const totalVideos = allVideos?.length || 0;
  const watchedVideos = (progress || []).filter(p => p.watched).length;

  return NextResponse.json({
    progress: progress || [],
    stats: { totalVideos, watchedVideos, progress: totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0 },
  });
}

export async function POST(req: Request) {
  const { user, supabase } = await getAuthenticatedUserWithClient();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { videoId, watched } = await req.json();
  if (!videoId) {
    return NextResponse.json({ error: "videoId requis" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("video_progress")
    .upsert({
      user_id: user.id,
      video_id: videoId,
      watched: watched ?? true,
      watched_at: watched ? new Date().toISOString() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ progress: data });
}
