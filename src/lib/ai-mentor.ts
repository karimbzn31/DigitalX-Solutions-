import { supabaseAdmin } from "./api-auth";

const API_KEY = process.env.OPENCODE_API_KEY;
const BASE_URL = (process.env.OPENCODE_BASE_URL || "https://opencode.ai/zen/v1").replace(/\/+$/, "");
const MODEL = process.env.OPENCODE_MODEL || "deepseek-v4-flash-free";

const CATALOG = [
  {
    titre: "Introduction à l'IA Générative",
    niveau: "Débutant",
    duree: "2h",
    chapitres: ["Qu'est-ce que l'IA Générative ?", "Comment fonctionnent les LLMs", "Prompt Engineering 101", "Introduction au Vibe Coding"],
  },
  {
    titre: "Vibe Coding - Créer avec l'IA",
    niveau: "Débutant",
    duree: "4h",
    chapitres: ["Philosophie du Vibe Coding", "Écrire des prompts efficaces", "Itération et debugging avec l'IA", "Du concept au prototype"],
  },
  {
    titre: "Lancer son SaaS en 2026",
    niveau: "Intermédiaire",
    duree: "6h",
    chapitres: ["Architecture SaaS moderne", "Next.js + Supabase", "Paiements Stripe", "Déploiement Vercel"],
  },
  {
    titre: "Agents Autonomes & Automatisation",
    niveau: "Avancé",
    duree: "5h",
    chapitres: ["n8n et workflows", "Chatbot WhatsApp", "Agents avec mémoire", "Déploiement d'agents"],
  },
];

interface SessionEntry {
  role: string;
  content: string;
}

function getSystemPrompt(userName: string): string {
  const name = userName || "l'étudiant";
  return `Tu es DigitalX IA, l'intelligence artificielle de DigitalX Solutions Academy. Tu parles à ${name}.

RÈGLE ABSOLUE : 1 à 2 phrases. Jamais plus. Ne répète jamais "Bonjour" ni le prénom après le premier message.

STYLE : Naturel, professionnel, concis. Tu comprends les sous-entendus et le contexte de la conversation. Si ${name} pose une question, réponds-y directement sans réintroduction.

CE QU'IL NE FAUT PAS FAIRE : Dire "Bonjour ${name}" à chaque réponse, répéter la même info, faire des listes, être robotique.

EXPERTISE : Vibe Coding, SaaS (Next.js, Supabase, Stripe, Vercel), IA Générative, Automatisation (n8n, agents IA, WhatsApp bots).

FORMATIONS : ${JSON.stringify(CATALOG.map(c => c.titre))}

EXEMPLE :
- ${name} : "C'est quoi le Vibe Coding ?"
- Toi : "Vous décrivez votre besoin à l'IA, elle génère le code. Vous itérez jusqu'au résultat. Simple et puissant."

Réponds dans la langue de ${name}.`;
}

async function getHistory(userId: string): Promise<SessionEntry[]> {
  const { data } = await supabaseAdmin
    .from("chat_sessions")
    .select("role, content")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(40);

  return (data || []).map((row) => ({ role: row.role, content: row.content }));
}

async function saveMessage(userId: string, role: string, content: string) {
  await supabaseAdmin.from("chat_sessions").insert({
    user_id: userId,
    role,
    content,
  });
}

async function trimHistory(userId: string) {
  const { data } = await supabaseAdmin
    .from("chat_sessions")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (data && data.length > 40) {
    const idsToDelete = data.slice(40).map((row) => row.id);
    await supabaseAdmin.from("chat_sessions").delete().in("id", idsToDelete);
  }
}

async function callDeepSeek(messages: SessionEntry[], systemPrompt: string): Promise<string> {
  if (!API_KEY || API_KEY.includes("your_")) {
    return "Le service IA est en configuration. Contacte le support.";
  }

  try {
    const response = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: systemPrompt },
          ...messages.slice(-20),
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "");
      console.error("DeepSeek API error:", response.status, errText);
      return "Désolé, je n'ai pas pu générer de réponse pour le moment.";
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;
    if (!text) {
      console.warn("DeepSeek invalid response:", JSON.stringify(data));
      return "Désolé, je n'ai pas pu générer de réponse.";
    }
    return text;
  } catch (e) {
    console.error("DeepSeek call error:", e instanceof Error ? e.message : e);
    return "Désolé, une erreur est survenue. Peux-tu reformuler ?";
  }
}

export async function chatWithMentor(
  userId: string,
  userName: string,
  message: string
): Promise<string> {
  await saveMessage(userId, "user", message);

  const history = await getHistory(userId);
  const systemPrompt = getSystemPrompt(userName);
  const reply = await callDeepSeek(history, systemPrompt);

  await saveMessage(userId, "assistant", reply);
  await trimHistory(userId);

  return reply;
}
