"use client";
import { motion } from "framer-motion";
import { NebulaBadge } from "@/components/shared/NebulaBadge";

const words = ["Transformez", "vos idées", "en startup grâce à l'IA"];

const wordVariants = {
  hidden: { y: 40, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const, delay: i * 0.12 },
  }),
};

export function ModuleZero() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,92,255,0.06) 0%, transparent 60%)" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bloc 1 — Titre + description centrés */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <NebulaBadge variant="violet" className="mb-5 mx-auto w-fit">✨ DigitalX Solutions Academy</NebulaBadge>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[0.95] text-center max-w-4xl mx-auto mb-6">
            {words.map((word, i) => (
              <motion.span
                key={word}
                custom={i}
                initial="hidden"
                animate="visible"
                variants={wordVariants}
                className="block text-star-white"
              >
                {i === 2 ? (
                  <span className="text-gradient">{word}</span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </h1>
          <p className="text-base sm:text-lg text-mist text-center max-w-2xl mx-auto leading-relaxed">
            Maîtrisez l&apos;Intelligence Artificielle, le Vibe Coding et le développement SaaS.
            <br />
            Construisez des produits réels. Lancez votre startup.
          </p>
        </motion.div>

        {/* Séparateur visuel */}
        <div className="max-w-3xl mx-auto mb-20">
          <div className="h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
        </div>

        {/* Bloc 3 — Pourquoi nous */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="p-6 sm:p-8 rounded-2xl border border-white/[0.07] bg-surface/60"
          >
            <p className="text-lg sm:text-xl font-display font-bold text-star-white mb-3">Pourquoi nous ?</p>
            <p className="text-sm text-mist leading-relaxed mb-6">
              On ne fait pas que de la théorie. Ici, tu apprends en construisant des vrais projets.
              Tu en sors avec des compétences qui te rapportent de l&apos;argent, pas juste un certificat.
            </p>
            <p className="text-sm font-medium text-star-white mb-4">Ce que tu obtiens gratuitement :</p>
            <div className="space-y-4">
              {[
                { icon: "🤖", title: "Modèles IA puissants", desc: "Accès gratuit à des modèles comme Claude Code grâce à notre stratégie" },
                { icon: "🧩", title: "Agents IA autonomes", desc: "Crée des agents qui travaillent pour toi 24h/24" },
                { icon: "⚙️", title: "Automatisation complète", desc: "Maîtrise N8N, Instagram, Facebook, WhatsApp" },
                { icon: "🚀", title: "Lance tes propres SaaS", desc: "Apprends à créer, déployer et monétiser" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <span className="text-xl mt-0.5 shrink-0">{item.icon}</span>
                  <div>
                    <p className="text-sm font-medium text-star-white">{item.title}</p>
                    <p className="text-xs text-mist">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: 0.45 }}
            className="flex items-center justify-center"
          >
            <div className="w-full p-8 sm:p-10 rounded-2xl bg-gradient-to-br from-violet/20 via-violet/10 to-magenta/10 border border-violet/30 text-center">
              <p className="text-sm text-mist mb-3">Imagines une fois nos formations terminées...</p>
              <p className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-gradient leading-none mb-4">
                500 000 DA
              </p>
              <p className="text-sm text-mist leading-relaxed">
                Des projets qui te rapportent un revenu réel. Pas de la théorie, des résultats.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
