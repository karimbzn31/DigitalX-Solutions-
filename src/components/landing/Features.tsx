"use client";

import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap, Rocket, Bot, RefreshCw, Users } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { useTranslation } from "@/lib/useTranslation";
import { MagneticCard } from "@/components/shared/MagneticCard";

const FEATURE_KEYS = [
  { icon: Sparkles, titleKey: "features.f1t" as const, descKey: "features.f1d" as const },
  { icon: Zap, titleKey: "features.f2t" as const, descKey: "features.f2d" as const },
  { icon: Rocket, titleKey: "features.f3t" as const, descKey: "features.f3d" as const },
  { icon: Bot, titleKey: "features.f4t" as const, descKey: "features.f4d" as const },
  { icon: RefreshCw, titleKey: "features.f5t" as const, descKey: "features.f5d" as const },
  { icon: Users, titleKey: "features.f6t" as const, descKey: "features.f6d" as const },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

function FeatureCard({ icon: Icon, title, desc }: { icon: React.ElementType; title: string; desc: string }) {
  return (
    <MagneticCard className="p-6 h-full">
      <div className="w-10 h-10 bg-gradient-to-br from-violet/10 to-magenta/10 rounded-lg flex items-center justify-center mb-4 border border-violet/10 transition-colors">
        <Icon className="w-5 h-5 text-violet" />
      </div>
      <h3 className="font-display text-lg font-semibold text-star-white mb-2 tracking-tight">{title}</h3>
      <p className="text-sm text-mist leading-relaxed">{desc}</p>
    </MagneticCard>
  );
}

export function Features() {
  const { t, isAr } = useTranslation();

  const features = FEATURE_KEYS.map((f) => ({
    icon: f.icon,
    title: t(f.titleKey),
    desc: t(f.descKey),
  }));
  return (
    <section id="formation" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow={t("features.eyebrow")}
          title={t("features.titre")}
          subtitle={t("features.sousTitre")}
        />

        {/* Desktop: grille */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={itemVariants}
              className={i === 0 ? "lg:col-span-2 lg:row-span-1" : ""}
            >
              <FeatureCard icon={f.icon} title={f.title} desc={f.desc} />
            </motion.div>
          ))}
        </motion.div>

        {/* Mobile: scroll horizontal */}
        <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-none mt-4">
          {features.map((f) => (
            <div key={f.title} className="snap-start shrink-0 w-[80vw]">
              <FeatureCard icon={f.icon} title={f.title} desc={f.desc} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
