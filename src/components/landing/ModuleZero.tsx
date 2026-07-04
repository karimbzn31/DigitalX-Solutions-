"use client";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { NebulaBadge } from "@/components/shared/NebulaBadge";

export function ModuleZero() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,92,255,0.06) 0%, transparent 60%)" }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bloc 1 — Hero centré */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <NebulaBadge variant="violet" className="mb-5 mx-auto w-fit">🚀 Pourquoi l&apos;IA ?</NebulaBadge>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-star-white tracking-tight leading-tight mb-5">
            L&apos;IA n&apos;est plus l&apos;avenir,{" "}
            <span className="text-gradient">c&apos;est le présent</span>
          </h2>
          <p className="text-base text-mist leading-relaxed max-w-2xl mx-auto mb-10">
            Chaque jour, des milliers d&apos;entreprises adoptent l&apos;IA pour créer plus vite, réduire les coûts et innover.
            Ceux qui ne la maîtrisent pas seront bientôt à la traîne.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            {[
              { icon: "🧠", text: "Le collaborateur le plus puissant du 21ème siècle" },
              { icon: "💰", text: "Gagnent 2 à 3 fois plus que les développeurs classiques" },
              { icon: "🇩🇿", text: "Un besoin énorme de talents IA en Algérie" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-3 text-sm text-mist">
                <span className="text-lg shrink-0">{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Bloc 2 — Vidéo centrée */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="max-w-3xl mx-auto mb-20"
        >
          <div className="nebula-glass rounded-2xl overflow-hidden shadow-2xl shadow-violet/10">
            <div className="aspect-video bg-gradient-to-br from-violet/20 via-magenta/10 to-rose/5 flex items-center justify-center relative group cursor-pointer">
              <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent" />
              <div className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-violet/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Play className="w-7 h-7 sm:w-8 sm:h-8 text-white ml-0.5" />
              </div>
              <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-violet/30 flex items-center justify-center text-[10px]">🎬</div>
                <span className="text-[10px] sm:text-xs text-white/70">Découvrez notre approche</span>
              </div>
            </div>
            <div className="p-4 bg-surface">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs text-mist">
                  <span className="text-violet font-medium">Presenté par Digital X Solutions</span>
                  <span>·</span>
                  <span>5 min</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bloc 3 — Pourquoi nous */}
        <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Colonne gauche : texte + bénéfices */}
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

          {/* Colonne droite : chiffrage 500 000 DA */}
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
