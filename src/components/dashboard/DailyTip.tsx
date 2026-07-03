"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb, RefreshCw } from "lucide-react";

const tips = [
  { title: "Prompt efficace", text: "Sois précis dans tes prompts : donne le contexte, le rôle souhaité et le format de sortie attendu." },
  { title: "Itération rapide", text: "En Vibe Coding, ne cherche pas la perfection au premier essai. Itère vite, corrige avec l'IA." },
  { title: "Structure SaaS", text: "Un bon SaaS commence par une seule fonctionnalité, parfaitement exécutée." },
  { title: "Agents IA", text: "Commence petit : un seul workflow n8n automatisé vaut mieux que 10 agents mal configurés." },
  { title: "Debugging", text: "Quand ton code bug, copie l'erreur complète dans l'IA. Le contexte est la clé." },
  { title: "MVP", text: "Ton premier produit doit être embarrassant. Si t'en es fier, t'as trop attendu." },
  { title: "Base de données", text: "Supabase is all you need. Profites-en, c'est gratuit au début." },
  { title: "Design", text: "Utilise Tailwind. L'IA le connaît par cœur. Gagne des heures sur le CSS." },
  { title: "Déploiement", text: "Vercel + Supabase = stack de prod en 10min. Ne te prends pas la tête." },
  { title: "Automatisation", text: "Si tu fais une tâche manuelle 3 fois, automatise-la avec n8n." },
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
