"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Globe, Smartphone, Rocket, Server, Palette, Wrench, ArrowRight } from "lucide-react";
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
    <section id="pricing" className="py-16 md:py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Prestation"
          title="Un projet. Une solution."
          subtitle="Vous avez une idée de site web, d'application ou de startup ? Je la transforme en produit concret, de la conception au déploiement."
          className="mb-10 md:mb-16"
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-3xl mx-auto"
        >
          <div
            className="relative rounded-xl md:rounded-[0.75rem] p-[1px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, #7C5CFF 0%, #C45CFF 50%, #FF6FB8 100%)" }}
          >
            <div className="bg-surface p-5 sm:p-6 md:p-10 rounded-xl md:rounded-[0.75rem] relative backdrop-blur-md">

              <div className="text-center mb-5 md:mb-8">
                <NebulaBadge variant="violet" className="px-3 md:px-4 py-1 text-[10px] md:text-xs">
                  ✦ Devis gratuit · Réponse sous 48h
                </NebulaBadge>
              </div>

              <div className="grid grid-cols-2 gap-2 md:gap-3 mb-5 md:mb-8">
                {services.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="flex flex-col items-center gap-1.5 p-2.5 md:p-3 rounded-lg bg-violet/[0.03] border border-white/[0.04] hover:border-violet/20 hover:bg-violet/[0.06] transition-colors"
                    >
                      <div className="w-8 h-8 md:w-9 md:h-9 rounded-lg bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center shrink-0">
                        <Icon className="w-3.5 h-3.5 md:w-4 md:h-4 text-violet" />
                      </div>
                      <span className="text-[11px] md:text-sm text-star-white font-medium leading-tight text-center">
                        {s.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-white/5 pt-3 md:pt-6 mb-4 md:mb-6">
                <p className="text-[10px] md:text-xs text-mist/60 text-center mb-2.5 md:mb-4">
                  Ce qui m&apos;engage avec vous
                </p>
                <div className="flex flex-wrap justify-center gap-1.5 md:gap-3">
                  {trustPoints.map((tp) => (
                    <span
                      key={tp}
                      className="inline-flex items-center gap-1 px-2 py-0.5 md:px-3 md:py-1 rounded-full bg-violet/[0.06] border border-white/[0.04] text-[10px] md:text-xs text-mist"
                    >
                      <span className="w-1 h-1 rounded-full bg-violet shrink-0" />
                      {tp}
                    </span>
                  ))}
                </div>
              </div>

              <div className="text-center mb-4 md:mb-6 pb-4 md:pb-6 border-b border-white/5">
                <p className="text-[10px] md:text-xs text-mist mb-0.5 md:mb-1">Investissement</p>
                <p className="font-display text-2xl md:text-4xl font-bold text-gradient">Nous contacter</p>
                <p className="text-[10px] md:text-xs text-mist mt-0.5 md:mt-2">
                  Devis personnalisé selon votre projet
                </p>
              </div>

              <Link href="/contact">
                <NebulaButton variant="primary" className="w-full text-sm md:text-base py-3 md:py-4 group">
                  Démarrer votre projet
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </NebulaButton>
              </Link>

              <p className="text-[10px] md:text-xs text-mist/50 text-center mt-3 md:mt-4">
                Paiement sécurisé · Accompagnement 7j/7
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
