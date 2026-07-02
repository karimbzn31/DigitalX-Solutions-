import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const authHeader = req.headers.get("authorization");
  let sessionUserId: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && data.user) {
      sessionUserId = data.user.id;
    }
  }

  if (!sessionUserId) {
    return Response.json({ error: "Non authentifié" }, { status: 401 });
  }

  const { userId } = await req.json();

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  // Users can only fetch their own profile
  if (userId !== sessionUserId) {
    // Check if requester is admin
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("is_admin")
      .eq("id", sessionUserId)
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
