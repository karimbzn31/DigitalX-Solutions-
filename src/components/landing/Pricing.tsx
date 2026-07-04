"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Crown } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const features = [
  { icon: "📚", text: "Accès complet à toutes nos formations" },
  { icon: "🤖", text: "DigitalX AI — ton assistant IA qui code, raisonne et construit pour toi" },
  { icon: "👥", text: "Communauté privée de 1 200+ membres actifs" },
  { icon: "📖", text: "Bibliothèque : documents, prompts, GitHub, projets" },
  { icon: "🎓", text: "Certificat officiel DigitalX Solutions Academy" },
  { icon: "💬", text: "Support 7j/7 — on répond toujours" },
  { icon: "🔄", text: "Mises à jour gratuites à vie" },
  { icon: "🚀", text: "Accès anticipé aux nouveautés" },
];

const guarantees = [
  "Satisfait ou remboursé sous 7 jours",
  "Aucun engagement — annule quand tu veux",
  "Paiement unique — pas d'abonnement",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-16 md:py-24 lg:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Investissement"
          title="Un accès complet. Un seul prix."
          subtitle="Pas de plans compliqués. Tu paies une fois, tu as tout."
          className="mb-10 md:mb-16"
        />

        {/* Carte pricing principale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden border-violet/40 bg-gradient-to-b from-violet/[0.08] to-transparent"
        >
          {/* Barre colorée en haut */}
          <div className="h-1 bg-gradient-to-r from-violet via-magenta to-rose" />

          <div className="p-6 sm:p-8 lg:p-10">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet/30 to-magenta/10 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-violet" />
                </div>
                <div>
                  <span className="text-xl font-display font-bold text-star-white">DigitalX Academy</span>
                  <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-violet/20 text-violet font-medium">
                    Accès Complet
                  </span>
                </div>
              </div>
            </div>

            <p className="text-sm text-mist mb-8 max-w-xl">
              Tu ne payes pas juste une formation. Tu obtiens un accès à tout notre écosystème :
              formations, assistant IA, communauté, bibliothèque et support. Le tout pour construire ta propre startup.
            </p>

            {/* Prix */}
            <div className="flex items-end gap-4 mb-8">
              <div>
                <span className="text-5xl sm:text-6xl font-display font-bold text-gradient leading-none">
                  12 000 DA
                </span>
              </div>
              <div className="flex items-center gap-2 pb-1.5">
                <span className="text-xl text-mist/40 line-through font-display font-medium">45 000 DA</span>
                <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">
                  -73%
                </span>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-violet to-magenta text-white font-medium hover:brightness-110 transition-all mb-8"
            >
              Accéder maintenant
            </Link>

            {/* Séparateur */}
            <div className="h-px bg-white/[0.07] mb-8" />

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 gap-x-8 gap-y-4 mb-8">
              {features.map((f) => (
                <div key={f.text} className="flex items-start gap-3">
                  <span className="text-lg mt-0.5 shrink-0">{f.icon}</span>
                  <span className="text-sm text-mist">{f.text}</span>
                </div>
              ))}
            </div>

            {/* Séparateur */}
            <div className="h-px bg-white/[0.07] mb-6" />

            {/* Garanties */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {guarantees.map((g) => (
                <div key={g} className="flex items-center gap-2 text-xs text-mist">
                  <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  {g}
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
