"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RefreshCw } from "lucide-react";

const tips = [
  { title: "Vibe Coding", text: "Décrivez votre idée en français, l'IA génère le code. Ajustez, itérez, et votre application prend vie en quelques minutes." },
  { title: "Prompt engineering", text: "Un bon prompt = contexte + rôle + format attendu. Testez cette structure dans votre prochain projet." },
  { title: "SaaS minimal", text: "Identifiez un problème précis, build une solution simple avec Next.js + Supabase, lancez vite. La perfection vient après." },
  { title: "Supabase", text: "Base de données, auth, stockage, et real-time en un seul outil. Maîtrisez-le, c'est le cœur de votre stack." },
  { title: "n8n automations", text: "Reliez vos apps sans code : un webhook n8n peut déclencher un email, un SMS ou une mise à jour Supabase." },
  { title: "Agent WhatsApp", text: "Créez un agent WhatsApp avec n8n + WhatsApp Business API. Idéal pour le support client automatisé." },
  { title: "Next.js + IA", text: "Intégrez DeepSeek ou OpenAI à votre app Next.js. Un appel API suffit pour ajouter une intelligence à votre SaaS." },
  { title: "Déploiement Vercel", text: "Push votre code sur GitHub, Vercel déploie automatiquement. En moins de 5 minutes, votre app est en ligne." },
  { title: "MVP rapide", text: "Votre première version doit résoudre un seul problème, parfaitement. Lancez, recueillez des retours, itérez." },
  { title: "Agents autonomes", text: "Un agent IA avec mémoire peut gérer des tâches complexes : scraping, rédaction, analyse de données. Formez le vôtre." },
];

export function DailyTip() {
  const [index, setIndex] = useState(() => {
    const today = new Date().toDateString();
    let hash = 0;
    for (let i = 0; i < today.length; i++) {
      hash = ((hash << 5) - hash) + today.charCodeAt(i);
    }
    return Math.abs(hash) % tips.length;
  });

  const tip = tips[index];

  const handleRefresh = () => {
    setIndex((prev) => (prev + 1) % tips.length);
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/15 bg-amber-500/[0.03] p-4">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="relative z-10 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
          <Lightbulb className="w-4 h-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs font-semibold text-amber-400">Astuce du jour</p>
            <button
              onClick={handleRefresh}
              className="p-1 rounded-md hover:bg-white/5 text-amber-400/50 hover:text-amber-400 transition-colors"
              title="Voir une autre astuce"
            >
              <RefreshCw className="w-3 h-3" />
            </button>
          </div>
          <AnimatePresence mode="wait">
            <motion.p
              key={index}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.3 }}
              className="text-xs text-amber-100/70 mt-1 leading-relaxed"
            >
              <span className="font-medium text-amber-200">{tip.title} :</span> {tip.text}
            </motion.p>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
