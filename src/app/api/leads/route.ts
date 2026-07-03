import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/api-auth";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }

    const { error } = await supabaseAdmin.from("leads").insert({
      email: email.toLowerCase(),
      source: "module-0-landing",
    });

    if (error) {
      if (error.code === "23505") {
        return NextResponse.json({ message: "Déjà inscrit !" }, { status: 200 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Inscription réussie" }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
