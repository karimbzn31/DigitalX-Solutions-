"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NebulaButton } from "@/components/shared/NebulaButton";

export function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden bg-void">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at center, rgba(124,92,255,0.08) 0%, transparent 70%)" }}
      />
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-sm text-mist/50 mb-8">
            ——— ✦ ———
          </p>

          <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[0.9] whitespace-pre-line text-star-white">
            {"Prêt à construire\n"}
            <span className="text-gradient">le futur</span>
            {" ?"}
          </h2>

          <p className="mt-6 text-base text-mist max-w-xl mx-auto leading-relaxed">
            Rejoignez plus de 1 200 apprenants qui transforment leurs idées en startups avec l&apos;IA.
          </p>

          <div className="mt-10">
            <Link href="#pricing">
              <NebulaButton size="lg" className="px-10 py-4 text-base">
                Commencer maintenant →
              </NebulaButton>
            </Link>
          </div>

          <p className="mt-6 text-sm text-mist">
            Algérie · Et au-delà
          </p>
        </motion.div>
      </div>
    </section>
  );
}
