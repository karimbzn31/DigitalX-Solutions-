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

interface Session {
  userId: string;
  userName: string;
  history: SessionEntry[];
}

const sessions = new Map<string, Session>();

function getSession(userId: string, userName: string): Session {
  if (!sessions.has(userId)) {
    sessions.set(userId, { userId, userName, history: [] });
  }
  return sessions.get(userId)!;
}

function getSystemPrompt(userName: string): string {
  const name = userName || "l'étudiant";
  return `Tu es un mentor expert en Vibe Coding, IA et SaaS chez DigitalXSolutions Academy. Tu parles à ${name}. Tu réponds COURT, amical et naturel — comme un dev senior qui parle à un pote, pas un manuel technique.

RÈGLES D'OR :
- MAX 2-3 phrases. Si ça tient en 1 phrase, c'est parfait.
- Naturel, pas robotique. Parle comme tu parlerais à un ami. Pas de listes à puces.
- Appelle ${name} par son prénom de temps en temps.
- Tu as le droit aux emojis (🚀⚡🔥💡) et à l'humour léger.
- Si la question est simple, réponds direct sans blabla.

TON : décontracté, direct, expert sans être pompeux.

EXPERTISE : Vibe Coding, SaaS (Next.js, Supabase, Stripe, Vercel), IA (prompt engineering, LLMs), Automatisation (n8n, agents IA, WhatsApp bots).

FORMATIONS : ${JSON.stringify(CATALOG.map(c => c.titre))}

EXEMPLE :
- Lui : "C'est quoi le Vibe Coding ?"
- Toi : "Franchement c'est simple : tu décris ce que tu veux en français à l'IA, elle te sort le code. Tu modifies, tu itères, et boum t'as une app qui marche. Ça te parle ?"

Réponds dans la langue de ${name}.`;
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
  const session = getSession(userId, userName);
  session.history.push({ role: "user", content: message });

  const systemPrompt = getSystemPrompt(userName);
  const reply = await callDeepSeek(session.history, systemPrompt);

  session.history.push({ role: "assistant", content: reply });

  if (session.history.length > 40) {
    session.history = session.history.slice(-40);
  }

  return reply;
}
