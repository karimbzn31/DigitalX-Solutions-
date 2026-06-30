"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, Smartphone, Rocket, Server, Palette, Wrench } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NebulaButton } from "@/components/shared/NebulaButton";
import { NebulaBadge } from "@/components/shared/NebulaBadge";

const services = [
  { icon: Globe, label: "Sites web & landing pages" },
  { icon: Smartphone, label: "Applications web & mobile" },
  { icon: Rocket, label: "MVP & prototypes startup" },
  { icon: Server, label: "APIs & back-end sur mesure" },
  { icon: Palette, label: "Design UI/UX moderne" },
  { icon: Wrench, label: "Déploiement & maintenance" },
];

const trustPoints = [
  "Accompagnement personnalisé",
  "Technologies modernes (Next.js, React, Node.js, IA...)",
  "Livraison rapide & itérative",
  "Support après-lancement",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Prestation"
          title="Un projet. Une solution."
          subtitle="Vous avez une idée de site web, d'application ou de startup ? Je la transforme en produit concret, de la conception au déploiement."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl mx-auto"
        >
          <div
            className="relative rounded-[0.75rem] p-[1px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, #7C5CFF 0%, #C45CFF 50%, #FF6FB8 100%)" }}
          >
            <div className="bg-surface p-8 md:p-10 rounded-[0.75rem] relative backdrop-blur-md">
              <div className="text-center mb-8">
                <NebulaBadge variant="violet" className="mb-4 px-4 py-1.5">✦ Devis gratuit · Réponse sous 48h</NebulaBadge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                {services.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="flex items-center gap-3 p-3 rounded-lg bg-violet/[0.03] border border-white/[0.04] hover:border-violet/20 hover:bg-violet/[0.06] transition-colors"
                    >
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-violet" />
                      </div>
                      <span className="text-sm text-star-white font-medium">{s.label}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/5 pt-6 mb-6">
                <p className="text-xs text-mist/60 text-center mb-4">Ce qui m&apos;engage avec vous</p>
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                  {trustPoints.map((tp) => (
                    <span key={tp} className="flex items-center gap-1.5 text-xs text-mist">
                      <span className="w-1 h-1 rounded-full bg-violet" />
                      {tp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center mb-6 pb-6 border-b border-white/5">
                <p className="text-xs text-mist mb-1">Investissement</p>
                <p className="font-display text-4xl font-bold text-gradient">Nous contacter</p>
                <p className="text-xs text-mist mt-2">Devis personnalisé selon votre projet</p>
              </div>

              <Link href="/contact">
                <NebulaButton variant="primary" className="w-full text-base py-4">
                  Démarrer votre projet →
                </NebulaButton>
              </Link>

              <p className="text-xs text-mist/50 text-center mt-4">
                Paiement sécurisé · Accompagnement 7j/7
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
