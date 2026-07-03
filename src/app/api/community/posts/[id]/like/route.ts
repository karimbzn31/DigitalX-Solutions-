import { NextResponse } from "next/server";
import { getAuthenticatedUserWithClient, supabaseAdmin } from "@/lib/api-auth";

export async function POST(_request: Request, { params }: { params: { id: string } }) {
  const { user } = await getAuthenticatedUserWithClient();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: post, error: fetchError } = await supabaseAdmin
    .from("community_posts")
    .select("likes, liked_by")
    .eq("id", params.id)
    .single();

  if (fetchError || !post) {
    return NextResponse.json({ error: "Post introuvable" }, { status: 404 });
  }

  const likedBy: string[] = post.liked_by || [];
  const alreadyLiked = likedBy.includes(user.id);

  const newLikedBy = alreadyLiked
    ? likedBy.filter((id) => id !== user.id)
    : [...likedBy, user.id];

  const { error: updateError } = await supabaseAdmin
    .from("community_posts")
    .update({ liked_by: newLikedBy, likes: newLikedBy.length })
    .eq("id", params.id);

  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 });

  return NextResponse.json({ liked: !alreadyLiked, likes: newLikedBy.length });
}
