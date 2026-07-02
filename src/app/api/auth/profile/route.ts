import { supabaseAdmin, getAuthenticatedUser } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { userId } = await req.json();
  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  // Users can only fetch their own profile (unless admin)
  if (userId !== user.id) {
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("is_admin")
      .eq("id", user.id)
      .single();

    if (!profile?.is_admin) {
      return Response.json({ error: "Accès refusé" }, { status: 403 });
    }
  }

  const { data: profile, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !profile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  return Response.json({ profile });
}