import { NextResponse } from "next/server";
import { getAuthenticatedUserWithClient } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { supabase, user } = await getAuthenticatedUserWithClient();
  const { searchParams } = new URL(request.url);
  const channel = searchParams.get("channel");

  let query = supabase
    .from("community_posts")
    .select("*, profiles(name, initials)")
    .order("created_at", { ascending: false });

  if (channel && channel !== "all") {
    query = query.eq("channel", channel);
  }

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const postIds = (data || []).map((p) => p.id);

  const { data: counts } = postIds.length > 0
    ? await supabase.rpc("comment_counts", { post_ids: postIds })
    : { data: [] };

  const countMap: Record<string, number> = {};
  for (const row of (counts as any[]) || []) {
    countMap[row.post_id] = parseInt(row.count, 10);
  }

  const posts = (data || []).map((p: any) => ({
    id: p.id,
    content: p.content,
    channel: p.channel,
    likes: p.likes,
    liked: user ? (p.liked_by || []).includes(user.id) : false,
    created_at: p.created_at,
    author: {
      name: p.profiles?.name || "Anonyme",
      initials: p.profiles?.initials || "??",
    },
    comments: countMap[p.id] || 0,
  }));

  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const { user, supabase } = await getAuthenticatedUserWithClient();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { content, channel } = await request.json();

  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Contenu requis" }, { status: 400 });
  }

  if (!["general", "entraide", "ressources", "succes"].includes(channel)) {
    return NextResponse.json({ error: "Canal invalide" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("community_posts")
    .insert({ user_id: user.id, content: content.trim(), channel })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ post: data }, { status: 201 });
}
