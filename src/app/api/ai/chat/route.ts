import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/api-auth";
import { chatWithMentor } from "@/lib/ai-mentor";
import { checkRateLimit } from "@/lib/rate-limit";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const user = await getAuthenticatedUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
  const allowed = await checkRateLimit(`chat:${user.id}:${ip}`, 30, 60000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de requêtes. Réessayez dans une minute." },
      { status: 429 }
    );
  }

  try {
    const { message, conversationId } = await req.json();
    if (!message || !message.trim()) {
      return NextResponse.json({ error: "Message requis" }, { status: 400 });
    }

    const userName = user.user_metadata?.name || user.email || "Étudiant";
    const reply = await chatWithMentor(
      user.id,
      userName,
      message.trim(),
      conversationId || "default"
    );
    return NextResponse.json({ reply });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erreur serveur";
    console.error("/api/ai/chat error:", msg);
    return NextResponse.json({ error: "Service IA indisponible" }, { status: 503 });
  }
}
