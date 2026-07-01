"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, Rocket, Bot, RefreshCw, Users } from "lucide-react";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NebulaCard } from "@/components/shared/NebulaCard";

const features = [
  { icon: Sparkles, title: "IA Gratuite & Illimitée", desc: "Modèles de pointe sans abonnement, accessibles à tout moment." },
  { icon: Zap, title: "Vibe Coding", desc: "Développez 10x plus vite avec l'IA générative et le pair programming." },
  { icon: Rocket, title: "Créer votre SaaS", desc: "De l'idée au produit en ligne. Stack technique, déploiement, scaling." },
  { icon: Bot, title: "Agent IA Personnel", desc: "Créez des agents intelligents pour automatiser vos tâches." },
  { icon: RefreshCw, title: "Mise à jour régulière", desc: "Contenu actualisé en continu pour suivre l'évolution rapide de l'IA." },
  { icon: Users, title: "Communauté active", desc: "Échangez avec d'autres apprenants et obtenez du support." },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Features() {
  return (
    <section id="formation" className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Ce qui vous attend"
          title="Une formation pensée pour ceux qui veulent construire"
          subtitle="Pas de théorie superflue. Chaque module vous amène à produire quelque chose de réel."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <motion.div
                key={f.title}
                variants={itemVariants}
                className={i === 0 ? "lg:col-span-2 lg:row-span-1" : ""}
              >
                <NebulaCard className="p-6 h-full group">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet/10 to-magenta/10 rounded-lg flex items-center justify-center mb-4 border border-violet/10 group-hover:border-violet/20 transition-colors">
                    <Icon className="w-5 h-5 text-violet" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-star-white mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-mist leading-relaxed">{f.desc}</p>
                </NebulaCard>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 scrollbar-none mt-4">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="snap-start shrink-0 w-[80vw]">
                <NebulaCard className="p-6 h-full group">
                  <div className="w-10 h-10 bg-gradient-to-br from-violet/10 to-magenta/10 rounded-lg flex items-center justify-center mb-4 border border-violet/10 group-hover:border-violet/20 transition-colors">
                    <Icon className="w-5 h-5 text-violet" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-star-white mb-2 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-mist leading-relaxed">{f.desc}</p>
                </NebulaCard>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
