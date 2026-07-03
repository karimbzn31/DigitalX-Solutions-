import { NextResponse } from "next/server";
import { getAuthenticatedUserWithClient } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { user, supabase } = await getAuthenticatedUserWithClient();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");

  if (!moduleId) {
    return NextResponse.json({ error: "moduleId requis" }, { status: 400 });
  }

  const { data: videos, error } = await supabase
    .from("videos")
    .select("*")
    .eq("module_id", moduleId)
    .order("order_index", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: progress } = await supabase
    .from("video_progress")
    .select("video_id, watched")
    .eq("user_id", user.id);

  const watchedMap = new Map((progress || []).map(p => [p.video_id, p.watched]));

  const enriched = (videos || []).map((v) => ({
    ...v,
    completed: watchedMap.get(v.id) || false,
  }));

  return NextResponse.json({ videos: enriched });
}
