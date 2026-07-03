import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const BOT_URL = process.env.AI_BOT_WEBHOOK_URL || "http://localhost:3000/webhook";

export async function POST(req: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  try {
    const { message } = await req.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    const botRes = await fetch(BOT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: user.id,
        userName: user.user_metadata?.name || user.email || "Étudiant",
        type: "text",
        content: message.trim(),
      }),
    });

    if (!botRes.ok) {
      const errData = await botRes.json().catch(() => ({}));
      console.error("AI Bot error:", botRes.status, errData);
      return NextResponse.json({ error: "Erreur du service IA" }, { status: 502 });
    }

    const data = await botRes.json();
    return NextResponse.json({ reply: data.reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    console.error("/api/ai/chat error:", msg);
    return NextResponse.json({ error: "Service IA indisponible" }, { status: 503 });
  }
}
