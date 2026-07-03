import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

import { 
  getSession, 
  resetSession, 
  addToHistory, 
  getHistory
} from './sessionStore.js';
import { 
  callDeepSeek,
  callGeminiText,
  callGeminiWithImage,
  transcribeWithWhisper
} from './llmService.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = process.env.PORT || 3000;
const CATALOG_PATH = path.join(process.cwd(), 'catalog.json');

// Load catalog helper
function loadCatalog() {
  try {
    if (fs.existsSync(CATALOG_PATH)) {
      return JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
    }
  } catch (err) {
    console.error('Error loading catalog:', err.message);
  }
  return [];
}

// System prompt generator
function getSystemPrompt(session, catalog) {
  return `Tu es un expert sénior en Vibe Coding, Intelligence Artificielle et développement SaaS. Tu es le mentor technique officiel de DigitalXSolutions Academy.

TON RÔLE PRINCIPAL :
Quand un étudiant ne comprend pas un concept de la formation, tu dois :
1. Analyser ce qu'il bloque
2. Reformuler le concept avec des mots simples
3. Donner un exemple concret et pratique
4. Proposer un mini-exercice pour vérifier la compréhension
5. Encourager et rassurer

Tu es patient, pédagogue et tu sais t'adapter au niveau de l'étudiant (débutant, intermédiaire, avancé).

TON EXPERTISE (domaines que tu maîtrises parfaitement) :
- Vibe Coding : génération de code avec l'IA, prompts efficaces, itération rapide, debugging assisté
- SaaS : architecture, Stripe, authentication, déploiement Vercel, domaines, SEO
- IA Générative : LLMs (GPT, Claude, DeepSeek), prompt engineering, RAG, fine-tuning
- Automatisation : n8n, Make, Zapier, webhooks, agents autonomes
- Développement Web : Next.js, React, Tailwind, Supabase, API REST, PostgreSQL
- Agents IA : WhatsApp bots, assistants vocaux, chatbots intelligents, AI workflows
- Déploiement : Vercel, Supabase, Cloudflare, Docker, CI/CD

MODULES DE LA FORMATION :
${JSON.stringify(catalog, null, 2)}

COMMENT RÉPONDRE (structure recommandée) :
1. Accuser réception de la question avec empathie
2. Reformuler le concept simplement
3. Donner un exemple concret (code, analogie, cas réel)
4. Proposer une piste pour aller plus loin
5. Demander si c'est clair ou s'il veut approfondir

GESTION DES LANGUES :
Réponds dans la langue de l'étudiant (français, anglais, arabe/darija).

Tu n'es PAS un vendeur. Tu es uniquement un mentor technique. Ne collecte pas d'informations personnelles.
Utilise des extraits de code quand c'est pertinent, mais toujours avec des explications.`;
}
    ],
    "total": 0,
    "devise": "DZD",
    "statut": "en_attente"
  },
  "meta": {
    "canal": "chatbot",
    "agent": "Yasmine",
    "version": "1.0"
  }
}
\`\`\`
Ensuite, envoie ton message de remerciement chaleureux final en utilisant le prÃ©nom du client.
`;
}

/**
 * Endpoint principal pour le Chatbot (ManyChat / Make / Custom Webhook)
 * ReÃ§oit : { userId, type: 'text'|'image'|'audio', content: 'texte ou URL' }
 */
app.post('/webhook', async (req, res) => {
  const { userId, type, content } = req.body;

  if (!userId || !type || !content) {
    return res.status(400).json({ error: "Missing required fields: userId, type, content" });
  }

  try {
    const session = getSession(userId);
    const catalog = loadCatalog();

    console.log(`[Webhook] Message received from ${userId} | Type: ${type}`);

    // --- Ã‰tape 1 : Router et traiter selon le type de message ---
    if (type === 'image') {
      const history = getHistory(userId);
      const systemPrompt = getSystemPrompt(session, catalog);

      const geminiReply = await callGeminiWithImage(history, systemPrompt, content);

      if (geminiReply.startsWith('Désolée')) {
        addToHistory(userId, 'user', '[Image envoyée]');
        addToHistory(userId, 'system', "[Système] L'utilisateur a envoyé une photo mais l'analyse d'image est temporairement indisponible. Réponds en tant que Yasmine, demande poliment à l'utilisateur de décrire ce qu'il cherche ou ce qu'il a envoyé.");
      } else {
        addToHistory(userId, 'user', '[Image envoyée]');
        addToHistory(userId, 'assistant', geminiReply);
        return res.json({
          reply: geminiReply,
          orderCreated: false,
          orderDetails: null
        });
      }
    } else if (type === 'audio') {
      // Message vocal -> Transcrire avec Whisper, puis envoyer le texte à DeepSeek
      const transcription = await transcribeWithWhisper(content);
      console.log(`[Webhook] Whisper transcription: "${transcription}"`);

      if (transcription.startsWith('[')) {
        addToHistory(userId, 'system', `[Système] L'utilisateur a envoyé un message vocal. ${transcription}. Réponds en tant que Yasmine, informe poliment que tu n'as pas pu comprendre le message et demande de réécrire en texte.`);
      } else {
        addToHistory(userId, 'user', `(Message vocal transcrit) : ${transcription}`);
      }
      
    } else {
      // Message texte normal -> L'ajouter à l'historique
      addToHistory(userId, 'user', content);
    }

    // --- Étape 2 : Appeler DeepSeek pour générer la réponse ---
    const history = getHistory(userId);
    const systemPrompt = getSystemPrompt(session, catalog);
    let rawReply = await callDeepSeek(history, systemPrompt);

    // Fallback automatique si DeepSeek est indisponible
    if (rawReply === "Désolée, une erreur est survenue. Peux-tu reformuler ?" || rawReply === "Désolée, je n'ai pas pu générer de réponse.") {
      console.warn("[Webhook] DeepSeek failed, falling back to Gemini.");
      rawReply = await callGeminiText(history, systemPrompt);
    }

    // Ajouter la réponse à l'historique
    addToHistory(userId, 'assistant', rawReply);

    // Renvoyer la réponse
    return res.json({
      reply: rawReply
    });

  } catch (error) {
    console.error("[Webhook Error]:", error);
    return res.status(500).json({ error: "Internal server error occurred", details: error.message });
  }
});

// Endpoint pour rÃ©initialiser la session (utile pour retester)
app.post('/webhook/reset', (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ error: "Missing userId" });
  
  resetSession(userId);
  console.log(`[Webhook] Session reset for user ${userId}`);
  res.json({ success: true, message: `Session reset for ${userId}` });
});

// Endpoint pour mettre Ã  jour le catalogue depuis n8n
app.post('/api/catalog', (req, res) => {
  const newCatalog = req.body;
  if (!Array.isArray(newCatalog)) {
    return res.status(400).json({ error: "Catalog must be a JSON array of products" });
  }

  try {
    fs.writeFileSync(CATALOG_PATH, JSON.stringify(newCatalog, null, 2), 'utf8');
    console.log('[API] Product catalog updated successfully!');
    res.json({ success: true, message: "Catalog updated successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to write catalog file", details: err.message });
  }
});

// Endpoint pour lire le catalogue actuel
app.get('/api/catalog', (req, res) => {
  res.json(loadCatalog());
});

// Servir le dossier public (chat UI)
app.use(express.static('public'));

// Route racine : affiche l'interface chat
app.get('/', (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'chat.html'));
});

// Activer le serveur (local) ou exporter pour Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`\nðŸš€ Yasmine Chatbot Backend running on http://localhost:${PORT}`);
    console.log(`- Webhook Endpoint: POST http://localhost:${PORT}/webhook`);
    console.log(`- Reset Session Endpoint: POST http://localhost:${PORT}/webhook/reset`);
    console.log(`- Sync Catalog Endpoint: POST/GET http://localhost:${PORT}/api/catalog\n`);
  });
}

export default app;

