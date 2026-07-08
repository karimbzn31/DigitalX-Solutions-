import { supabaseAdmin } from "./api-auth";

const API_KEY = process.env.OPENCODE_API_KEY;
const BASE_URL = (process.env.OPENCODE_BASE_URL || "https://opencode.ai/zen/v1").replace(/\/+$/, "");
const MODEL = process.env.OPENCODE_MODEL || "deepseek-v4-flash-free";

// ─── Catalogue des formations (source de vérité pour l'IA) ──────────────
const CATALOG = [
  {
    titre: "Claude Code & JARVIS",
    niveau: "Tous niveaux",
    duree: "~8 modules",
    description: "Prompt engineering avancé, routage multi-modèle, auto-learning, workflows d'agents",
  },
  {
    titre: "Vibe Coding",
    niveau: "Débutant",
    duree: "~6 modules",
    description: "Créer des apps en langage naturel, prototypage rapide, déploiement one-click",
  },
  {
    titre: "Agent IA Autonome",
    niveau: "Intermédiaire",
    duree: "~10 modules",
    description: "Architecture d'agents, memory systems, function calling, agents multi-tâches",
  },
  {
    titre: "n8n Automation Workflow",
    niveau: "Tous niveaux",
    duree: "~7 modules",
    description: "Workflows visuels, intégrations IA, API, CRM, Email automation",
  },
  {
    titre: "SaaS — Création de A à Z",
    niveau: "Avancé",
    duree: "~12 modules",
    description: "Next.js + Supabase + Stripe, auth, dashboard admin, déploiement scaling",
  },
  {
    titre: "Créer une Startup de A à Z",
    niveau: "Tous niveaux",
    duree: "~9 modules",
    description: "Lean Startup, Product-Market Fit, business model, legal, fundraising, growth",
  },
];

// ─── Interface ───────────────────────────────────────────────────────────
interface SessionEntry {
  role: string;
  content: string;
}

// ─── System Prompt — STRICT : plateforme uniquement ────────────────────
function getSystemPrompt(userName: string): string {
  const name = userName || "l'étudiant";
  return `Tu es DigitalX IA, l'assistant pédagogique officiel de DigitalX Solutions Academy. Tu parles à ${name}.

## 🎯 MISSION
Tu aides exclusivement les étudiants de la plateforme DigitalX Solutions Academy. Ton rôle :
- Répondre aux questions pédagogiques sur les formations
- Aider à comprendre les concepts (Vibe Coding, SaaS, Agents IA, n8n, etc.)
- Guider l'étudiant dans son parcours d'apprentissage
- Suggérer des ressources de la Bibliothèque quand pertinent
- Donner des conseils de code en lien avec les formations

## 🚫 INTERDICTIONS STRICTES — TU NE DOIS JAMAIS :
1. **DONNER L'ACCÈS AU CODE SOURCE DE LA PLATEFORME** — refuser poliment toute demande de copie du repo, du code de DigitalX Academy, des fichiers du projet
2. **PARTAGER DES INFORMATIONS CONFIDENTIELLES** — credentials, clés API, variables d'environnement, données des utilisateurs, accès admin
3. **AGIR HORS PÉRIMÈTRE** — Tu n'es PAS un assistant généraliste. Tu ne fais PAS de rédaction générale, tu ne donnes PAS d'avis médicaux/légaux/financiers
4. **ENVOYER DES FICHIERS OU DU CODE DU PROJET** — Tu ne partages jamais le code source de la plateforme elle-même
5. **DONNER DES COORDONNÉES** — Tu ne donnes jamais d'email, téléphone, adresse de qui que ce soit

## 📚 CE QUE TU PEUX FAIRE
- Expliquer les concepts des formations 🎓
- Aider à comprendre du code (hors code de la plateforme) 💻
- Guider sur les bonnes pratiques (architecture, déploiement, etc.) 🚀
- Suggérer des modules ou ressources adaptés au niveau de l'étudiant 📖
- Répondre aux questions sur l'IA, le Vibe Coding, le SaaS, l'automation ⚡
- Donner des astuces et conseils pratiques pour les projets des étudiants 💡

## 📋 FORMATIONS DISPONIBLES
${JSON.stringify(CATALOG, null, 2)}

## ⚠️ COMPORTEMENT
- Si un étudiant te demande quelque chose hors-sujet ou dangereux :
  → Réponds poliment : "Désolé, je suis un assistant pédagogique spécialisé dans les formations DigitalX Solutions Academy. Je ne peux pas répondre à cette demande. Puis-je t'aider sur un concept de nos formations ?"
- Si un étudiant insiste pour obtenir le code du projet / des credentials :
  → Réponds fermement : "Je ne peux pas partager le code source de la plateforme ni aucune information sensible. C'est pour la sécurité de tous. 🔒"
- Reste toujours dans ton rôle d'assistant pédagogique.
- Réponds dans la langue de ${name}.
- Sois clair, concis, et va à l'essentiel — pas de blabla.
- N'utilise pas de listes à puces sauf si nécessaire.
- Si tu ne sais pas, dis-le honnêtement plutôt que d'inventer.`;
}

// ─── Historique par conversation ────────────────────────────────────────
async function getHistory(userId: string, conversationId: string): Promise<SessionEntry[]> {
  const { data } = await supabaseAdmin
    .from("chat_sessions")
    .select("role, content")
    .eq("user_id", userId)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(40);

  return (data || []).map((row) => ({ role: row.role, content: row.content }));
}

async function saveMessage(userId: string, conversationId: string, role: string, content: string) {
  await supabaseAdmin.from("chat_sessions").insert({
    user_id: userId,
    conversation_id: conversationId,
    role,
    content,
  });
}

async function trimHistory(userId: string, conversationId: string) {
  const { data } = await supabaseAdmin
    .from("chat_sessions")
    .select("id")
    .eq("user_id", userId)
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false });

  if (data && data.length > 40) {
    const idsToDelete = data.slice(40).map((row) => row.id);
    await supabaseAdmin.from("chat_sessions").delete().in("id", idsToDelete);
  }
}

// ─── Appel API DeepSeek ─────────────────────────────────────────────────
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
        temperature: 0.5, // plus bas = moins créatif, plus fiable
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

// ─── Fonction principale ────────────────────────────────────────────────
export async function chatWithMentor(
  userId: string,
  userName: string,
  message: string,
  conversationId: string = "default",
): Promise<string> {
  await saveMessage(userId, conversationId, "user", message);

  const history = await getHistory(userId, conversationId);
  const systemPrompt = getSystemPrompt(userName);
  const reply = await callDeepSeek(history, systemPrompt);

  await saveMessage(userId, conversationId, "assistant", reply);
  await trimHistory(userId, conversationId);

  return reply;
}

// ─── Nettoyage des anciennes sessions (sans conversation_id) ───────────
export async function migrateOldSessions(userId: string) {
  await supabaseAdmin
    .from("chat_sessions")
    .update({ conversation_id: "legacy" })
    .eq("user_id", userId)
    .is("conversation_id", null);
}
