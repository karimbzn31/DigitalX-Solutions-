"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { NebulaButton } from "@/components/shared/NebulaButton";
import { useTranslation } from "@/lib/useTranslation";

function CTAFloatingParticles() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full"
          style={{
            width: 2 + (i % 3) * 2,
            height: 2 + (i % 3) * 2,
            background: i % 2 === 0 ? "rgba(124,92,255,0.3)" : "rgba(196,92,255,0.2)",
            left: `${8 + i * 11}%`,
            top: `${15 + (i % 4) * 18}%`,
          }}
          animate={{
            y: [0, -30 - i * 5, 0],
            x: [0, (i % 2 === 0 ? 1 : -1) * (10 + i * 2), 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5 + i,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
        />
      ))}
    </div>
  );
}

function CTAGrid() {
  return (
    <div
      className="absolute inset-0 pointer-events-none opacity-[0.015]"
      style={{
        backgroundImage: `
          linear-gradient(rgba(124,92,255,1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124,92,255,1) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    />
  );
}

export function CTASection() {
  const { t } = useTranslation();
  return (
    <section className="relative py-32 overflow-hidden bg-void">
      {/* Background glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, rgba(124,92,255,0.10) 0%, rgba(196,92,255,0.05) 30%, transparent 70%)",
        }}
      />
      <CTAGrid />
      <CTAFloatingParticles />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-center gap-3 mb-8">
            <span className="h-px w-12 bg-gradient-to-r from-transparent to-violet/50" />
            <span className="text-xs text-mist/50 tracking-widest uppercase">{t("cta.action")}</span>
            <span className="h-px w-12 bg-gradient-to-l from-transparent to-violet/50" />
          </div>

          <h2 className="font-display text-5xl md:text-7xl font-bold tracking-tight leading-[0.9] whitespace-pre-line text-star-white">
            {t("cta.titre1") + "\n"}
            <span className="text-gradient text-glow">{t("cta.titre2")}</span>
            {t("cta.titre3")}
          </h2>

          <p className="mt-6 text-base text-mist max-w-xl mx-auto leading-relaxed">
            Rejoignez plus de <strong className="text-star-white">1 200 apprenants</strong> qui transforment
            leurs idées en startups avec l&apos;IA.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register">
              <NebulaButton size="lg" className="px-10 py-4 text-base nebula-glow">
                {t("cta.btn")}
              </NebulaButton>
            </Link>
            <Link href="/contact">
              <NebulaButton variant="secondary" size="lg" className="px-10 py-4 text-base">
                {t("cta.contact")}
              </NebulaButton>
            </Link>
          </div>

          <p className="mt-6 text-sm text-mist">
            {t("cta.footer")}
          </p>
        </motion.div>
      </div>
    </section>
  );
}
