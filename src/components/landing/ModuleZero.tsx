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

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <NebulaBadge variant="violet" className="mb-4">🚀 Pourquoi l&apos;IA ?</NebulaBadge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-star-white tracking-tight leading-tight mb-4">
              L&apos;IA n&apos;est plus l&apos;avenir,{" "}
              <span className="text-gradient">c&apos;est le présent</span>
            </h2>
            <p className="text-sm text-mist leading-relaxed mb-6">
              Chaque jour, des milliers d&apos;entreprises adoptent l&apos;IA pour créer des produits plus vite, réduire les coûts et innover.
              Ceux qui ne la maîtrisent pas seront bientôt à la traîne.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { icon: "🧠", text: "L'IA génère du code, des apps et des designs en quelques minutes" },
                { icon: "💰", text: "Les développeurs IA gagnent 2 à 3 fois plus que les développeurs classiques" },
                { icon: "🇩🇿", text: "Le marché algérien a un besoin énorme de talents maîtrisant l'IA" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-mist">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl border border-violet/20 bg-violet/5">
              <p className="text-sm font-medium text-star-white mb-1">Pourquoi nous ?</p>
              <p className="text-xs text-mist leading-relaxed">
                On ne fait pas que de la théorie. Chaque module est conçu autour de projets concrets : tu construis, tu testes, tu lances.
                Tu sors de la formation avec un vrai portfolio et des compétences demandées par le marché.
              </p>
            </div>
          </motion.div>

          {/* Right: Video preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="nebula-glass rounded-2xl overflow-hidden">
              <div className="aspect-video bg-gradient-to-br from-violet/20 via-magenta/10 to-rose/5 flex items-center justify-center relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-t from-void/60 to-transparent" />
                <div className="relative z-10 w-16 h-16 rounded-full bg-violet/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 text-white ml-0.5" />
                </div>
                <div className="absolute bottom-3 left-3 z-10 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-violet/30 flex items-center justify-center text-[10px]">🎬</div>
                  <span className="text-[10px] text-white/70">Découvrez notre approche</span>
                </div>
              </div>
              <div className="p-4 bg-surface">
                <div className="flex items-center gap-2 text-xs text-mist">
                  <span className="text-violet font-medium">Presenté par Digital X Solutions</span>
                  <span>·</span>
                  <span>5 min</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
