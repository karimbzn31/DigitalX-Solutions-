"use client";

import { motion } from "framer-motion";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { NebulaBadge } from "@/components/shared/NebulaBadge";
import { testimonials } from "@/lib/mock-data";
import { getInitials } from "@/lib/utils";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

export function Testimonials() {
  return (
    <section className="py-24 lg:py-32 bg-surface/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Témoignages"
          title="Ils ont déjà fait le saut."
          subtitle="Découvrez ce que nos apprenants disent de leur expérience."
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {testimonials.map((t) => (
            <motion.div key={t.id} variants={itemVariants}>
              <NebulaCard className="p-6 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet/20 to-magenta/20 border border-violet/20 flex items-center justify-center text-sm font-medium text-violet">
                    {getInitials(t.name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-star-white">{t.name}</p>
                    <p className="text-xs text-mist">{t.role}</p>
                  </div>
                </div>

                <div className="text-violet text-sm tracking-wider mb-3">★★★★★</div>

                <p className="text-sm text-star-white/80 leading-relaxed flex-1 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>

                <div className="mt-4">
                  <NebulaBadge variant="violet">{t.badge}</NebulaBadge>
                </div>
              </NebulaCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
