import { supabaseAdmin, getAuthenticatedUser } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");

  if (!moduleId) {
    return NextResponse.json({ error: "moduleId requis" }, { status: 400 });
  }

  const { data: videos, error } = await supabaseAdmin
    .from("videos")
    .select("*")
    .eq("module_id", moduleId)
    .order("order_index", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get user progress
  const { data: progress } = await supabaseAdmin
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
