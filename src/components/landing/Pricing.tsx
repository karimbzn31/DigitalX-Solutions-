"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NebulaButton } from "@/components/shared/NebulaButton";
import { NebulaBadge } from "@/components/shared/NebulaBadge";

const features = [
  "Tous les modules",
  "40+ heures de vidéo",
  "Codes sources inclus",
  "Exercices pratiques",
  "Mises à jour à vie",
  "Assistant IA intégré",
  "Certificat de complétion",
  "Accès à la communauté",
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Investissement"
          title="Un accès. Une transformation."
          subtitle="Pas d'abonnement. Un investissement unique pour accéder à l'ensemble de la formation."
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          className="max-w-lg mx-auto"
        >
          <div
            className="relative rounded-[0.75rem] p-[1px] overflow-hidden"
            style={{ background: "linear-gradient(135deg, #7C5CFF 0%, #C45CFF 50%, #FF6FB8 100%)" }}
          >
            <div className="bg-surface p-8 rounded-[0.75rem] relative backdrop-blur-md">
              <div className="text-center mb-6">
                <NebulaBadge variant="violet" className="mb-4 px-4 py-1.5">✦ Accès complet · Toute la formation</NebulaBadge>
              </div>

              <ul className="space-y-3 mb-8">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-star-white">
                    <span className="text-violet">✦</span>
                    {f}
                  </li>
                ))}
              </ul>

              <div className="text-center mb-6">
                <p className="text-xs text-mist mb-1">Investissement unique</p>
                <p className="font-display text-4xl font-bold text-gradient">Nous contacter</p>
                <p className="text-xs text-mist mt-2">Paiement sécurisé · Accès immédiat</p>
              </div>

              <Link href="/contact">
                <NebulaButton variant="secondary" className="w-full">Nous contacter →</NebulaButton>
              </Link>

              <p className="text-xs text-mist/50 text-center mt-4">Paiement sécurisé · Accès immédiat</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
