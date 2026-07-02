import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function requireAdmin(request: Request) {
  const authHeader = request.headers.get("authorization");

  // Support Bearer token or cookie-based session
  let userId: string | null = null;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice(7);
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      return { error: NextResponse.json({ error: "Non authentifié" }, { status: 401 }), userId: null };
    }
    userId = data.user.id;
  } else {
    const cookieHeader = request.headers.get("cookie") || "";
    const cookies = Object.fromEntries(
      cookieHeader.split(";").filter(Boolean).map((c) => {
        const [k, ...v] = c.trim().split("=");
        return [k, v.join("=")];
      })
    );
    const accessToken = cookies["sb-access-token"] || cookies["supabase-auth-token"];
    if (accessToken) {
      try {
        const parsed = JSON.parse(decodeURIComponent(accessToken));
        const token = Array.isArray(parsed) ? parsed[0] : parsed;
        const { data, error } = await supabaseAdmin.auth.getUser(token);
        if (!error && data.user) {
          userId = data.user.id;
        }
      } catch {}
    }
  }

  if (!userId) {
    return { error: NextResponse.json({ error: "Non authentifié" }, { status: 401 }), userId: null };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from("profiles")
    .select("is_admin, status")
    .eq("id", userId)
    .single();

  if (profileError || !profile) {
    return { error: NextResponse.json({ error: "Profil introuvable" }, { status: 403 }), userId };
  }

  if (!profile.is_admin) {
    return { error: NextResponse.json({ error: "Accès refusé : administrateur requis" }, { status: 403 }), userId };
  }

  return { error: null, userId };
}

export { supabaseAdmin };
