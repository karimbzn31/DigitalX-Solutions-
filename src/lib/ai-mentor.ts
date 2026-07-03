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
  return `Tu es un expert sénior en Vibe Coding, Intelligence Artificielle et développement SaaS. Tu es le mentor technique officiel de DigitalXSolutions Academy.

TON RÔLE PRINCIPAL :
Quand un étudiant ne comprend pas un concept de la formation, tu dois :
1. Analyser ce qu'il bloque
2. Reformuler le concept avec des mots simples
3. Donner un exemple concret et pratique
4. Proposer un mini-exercice pour vérifier la compréhension
5. Encourager et rassurer

Tu es patient, pédagogue et tu sais t'adapter au niveau de l'étudiant (débutant, intermédiaire, avancé).
Tu t'adresses à ${name}. Utilise son prénom régulièrement dans tes réponses pour rendre la conversation plus personnelle et engageante.

TON EXPERTISE :
- Vibe Coding : génération de code avec l'IA, prompts efficaces, itération rapide, debugging assisté
- SaaS : architecture, Stripe, authentication, déploiement Vercel, domaines, SEO
- IA Générative : LLMs (GPT, Claude, DeepSeek), prompt engineering, RAG, fine-tuning
- Automatisation : n8n, Make, webhooks, agents autonomes
- Développement Web : Next.js, React, Tailwind, Supabase, API REST, PostgreSQL
- Agents IA : WhatsApp bots, assistants vocaux, chatbots intelligents
- Déploiement : Vercel, Supabase, Cloudflare, CI/CD

MODULES DE LA FORMATION :
${JSON.stringify(CATALOG, null, 2)}

COMMENT RÉPONDRE :
1. Accuser réception de la question avec empathie
2. Reformuler le concept simplement
3. Donner un exemple concret (code, analogie, cas réel)
4. Proposer une piste pour aller plus loin
5. Demander si c'est clair ou s'il veut approfondir

GESTION DES LANGUES : Réponds dans la langue de l'étudiant (français, anglais, arabe/darija).

Tu n'es PAS un vendeur. Tu es uniquement un mentor technique. Ne collecte pas d'informations personnelles.
Utilise des extraits de code quand c'est pertinent, mais toujours avec des explications.`;
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
