"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Sparkles, Bot, Infinity, Users, Shield, Zap } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";

const plans = [
  {
    name: "Pro",
    desc: "Tout ce dont tu as besoin pour lancer ta startup avec l'IA",
    monthly: 3500,
    annual: 25000,
    popular: true,
    features: [
      "Accès complet aux 6 modules",
      "Assistant IA illimité",
      "Master Prompts exclusifs",
      "Communauté privée",
      "Certificats vérifiables",
      "Mises à jour à vie",
    ],
    icon: Zap,
  },
  {
    name: "Elite",
    desc: "Pour ceux qui veulent un accompagnement personnalisé",
    monthly: 8000,
    annual: 65000,
    popular: false,
    features: [
      "Tout du plan Pro",
      "Mentoring individuel (2h/mois)",
      "Templates SaaS premium",
      "Accès anticipé aux nouveautés",
      "Badge Elite communauté",
      "Session Q&A privée mensuelle",
    ],
    icon: Sparkles,
  },
];

const guarantees = [
  { icon: Shield, text: "Satisfait ou remboursé sous 7 jours" },
  { icon: Infinity, text: "Accès à vie au contenu" },
  { icon: Users, text: "Communauté 1 200+ membres" },
];

export function Pricing() {
  const [annual, setAnnual] = useState(true);

  return (
    <section id="pricing" className="py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Investissement"
          title="Un prix clair. Sans surprise."
          subtitle="Choisis le plan qui correspond à ton ambition. Pas d'engagement, tu peux annuler quand tu veux."
          className="mb-10 md:mb-16"
        />

        <div className="flex items-center justify-center gap-3 mb-10">
          <span className={`text-sm ${annual ? "text-mist" : "text-star-white font-medium"}`}>Mensuel</span>
          <button
            onClick={() => setAnnual(!annual)}
            className={`relative w-14 h-7 rounded-full transition-colors ${annual ? "bg-violet" : "bg-violet/40"}`}
          >
            <div className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-transform ${annual ? "left-8" : "left-1"}`} />
          </button>
          <span className={`text-sm ${annual ? "text-star-white font-medium" : "text-mist"}`}>
            Annuel
            <span className="ml-1.5 px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-medium">-40%</span>
          </span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {plans.map((plan, idx) => {
            const Icon = plan.icon;
            const price = annual ? plan.annual : plan.monthly;
            const period = annual ? "/an" : "/mois";

            return (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ delay: idx * 0.1 }}
                className={`relative rounded-xl overflow-hidden ${
                  plan.popular
                    ? "border-violet/40 bg-gradient-to-b from-violet/[0.08] to-transparent"
                    : "border-white/[0.07] bg-surface/70"
                } border backdrop-blur-sm`}
              >
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-violet via-magenta to-rose" />
                )}

                <div className="p-6 md:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-violet" />
                      </div>
                      <div>
                        <span className="text-lg font-display font-semibold text-star-white">{plan.name}</span>
                        {plan.popular && (
                          <span className="ml-2 px-2 py-0.5 rounded text-[10px] bg-violet/20 text-violet font-medium">Populaire</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-mist mb-6">{plan.desc}</p>

                  <div className="mb-6">
                    <span className="text-4xl font-display font-bold text-star-white">
                      {price.toLocaleString("fr-FR")} DZ
                    </span>
                    <span className="text-sm text-mist ml-1">{period}</span>
                  </div>

                  <Link
                    href="/register"
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl text-sm font-medium transition-all mb-6 ${
                      plan.popular
                        ? "bg-gradient-to-r from-violet to-magenta text-white hover:brightness-110"
                        : "bg-white/5 text-star-white border border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {plan.popular ? "Commencer maintenant" : "Choisir Elite"}
                  </Link>

                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-violet shrink-0 mt-0.5" />
                        <span className="text-sm text-mist">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-8">
          {guarantees.map((g) => {
            const GIcon = g.icon;
            return (
              <div key={g.text} className="flex items-center gap-1.5 text-xs text-mist">
                <GIcon className="w-3.5 h-3.5 text-violet" />
                {g.text}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
