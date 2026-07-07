import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/api-auth";
import { checkRateLimit } from "@/lib/rate-limit";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const allowed = await checkRateLimit(`register:${ip}`, 5, 60000);
    if (!allowed) {
      return NextResponse.json({ error: "Trop de tentatives. Réessayez dans une minute." }, { status: 429 });
    }

    const { email, password, name, initials } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Format d'email invalide" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 });
    }

    if (name.trim().length < 2) {
      return NextResponse.json({ error: "Le nom doit contenir au moins 2 caractères" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name, initials },
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const userId = data.user?.id;
    if (!userId) {
      return NextResponse.json({ error: "Erreur création utilisateur" }, { status: 500 });
    }

    const { error: profileError } = await supabaseAdmin.from("profiles").upsert({
      id: userId,
      email,
      name,
      initials,
      is_admin: false,
      status: "pending",
    });

    if (profileError) {
      // Rollback: delete auth user if profile creation fails
      await supabaseAdmin.auth.admin.deleteUser(userId);
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    return NextResponse.json({ user: { id: userId } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
