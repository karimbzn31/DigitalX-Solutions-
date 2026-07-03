import { NextResponse } from "next/server";
import { getAuthenticatedUserWithClient } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: { id: string } }) {
  const { supabase } = await getAuthenticatedUserWithClient();

  const { data, error } = await supabase
    .from("community_comments")
    .select("*, profiles(name, initials)")
    .eq("post_id", params.id)
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const comments = (data || []).map((c: any) => ({
    id: c.id,
    content: c.content,
    created_at: c.created_at,
    author: {
      name: c.profiles?.name || "Anonyme",
      initials: c.profiles?.initials || "??",
    },
  }));

  return NextResponse.json({ comments });
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const { user, supabase } = await getAuthenticatedUserWithClient();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { content } = await request.json();

  if (!content || !content.trim()) {
    return NextResponse.json({ error: "Contenu requis" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("community_comments")
    .insert({ post_id: params.id, user_id: user.id, content: content.trim() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ comment: data }, { status: 201 });
}
