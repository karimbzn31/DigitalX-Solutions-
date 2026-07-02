import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const { userId, code } = await req.json();

  if (!userId || !code) {
    return Response.json({ error: "Missing userId or code" }, { status: 400 });
  }

  const { data: profile, error: fetchError } = await supabaseAdmin
    .from("profiles")
    .select("validation_code, status")
    .eq("id", userId)
    .single();

  if (fetchError || !profile) {
    return Response.json({ error: "Profil introuvable" }, { status: 404 });
  }

  if (profile.status === "active") {
    return Response.json({ success: true, alreadyActive: true });
  }

  if (profile.validation_code !== code) {
    return Response.json({ error: "Code invalide. V\u00e9rifiez votre code et r\u00e9essayez." }, { status: 400 });
  }

  const { error: updateError } = await supabaseAdmin
    .from("profiles")
    .update({ status: "active", validation_code: null })
    .eq("id", userId);

  if (updateError) {
    return Response.json({ error: "Erreur lors de l'activation" }, { status: 500 });
  }

  return Response.json({ success: true });
}
