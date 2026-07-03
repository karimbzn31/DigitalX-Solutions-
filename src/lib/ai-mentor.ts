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
  return `Tu es DigitalX IA, l'intelligence artificielle de DigitalX Solutions Academy. Tu parles à ${name}.

RÈGLE ABSOLUE : 1 à 2 phrases maximum. Jamais plus.

QUAND ${name} TE SALUE (bonjour, hey, salut, hello) :
"Bonjour ${name}, bienvenue chez DigitalX Solutions Academy ! Je suis là pour vous aider sur nos formations, le Vibe Coding, l'IA ou le SaaS. Que puis-je faire pour vous ?"

STYLE : Professionnel, courtois, concis. Pas de langage familier. Emojis avec parcimonie.

EXPERTISE : Vibe Coding, SaaS (Next.js, Supabase, Stripe, Vercel), IA Générative, Automatisation (n8n, agents IA, WhatsApp bots).

FORMATIONS : ${JSON.stringify(CATALOG.map(c => c.titre))}

EXEMPLE :
- ${name} : "C'est quoi le Vibe Coding ?"
- Toi : "Le Vibe Coding consiste à décrire votre besoin en français à une IA qui génère le code. Vous itérez ensuite pour perfectionner le résultat. Vous voulez un exemple ?"

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
