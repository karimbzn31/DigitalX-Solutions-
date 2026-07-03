import { NextResponse } from "next/server";
import { getAuthenticatedUserWithClient, supabaseAdmin } from "@/lib/api-auth";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function GET() {
  const { user } = await getAuthenticatedUserWithClient();
  if (!user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("referral_code, referrals_count, name")
    .eq("id", user.id)
    .single();

  if (!profile) return NextResponse.json({ error: "Profil introuvable" }, { status: 404 });

  if (profile.referral_code) {
    return NextResponse.json({
      code: profile.referral_code,
      count: profile.referrals_count || 0,
      name: profile.name,
    });
  }

  let code = generateCode();
  let attempts = 0;
  while (attempts < 10) {
    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ referral_code: code })
      .eq("id", user.id);
    if (!error) break;
    code = generateCode();
    attempts++;
  }

  return NextResponse.json({ code, count: 0, name: profile.name });
}
