"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Check, Loader2, Play } from "lucide-react";
import { NebulaButton } from "@/components/shared/NebulaButton";
import { NebulaBadge } from "@/components/shared/NebulaBadge";

export function ModuleZero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Erreur");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(124,92,255,0.06) 0%, transparent 60%)" }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Video preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <NebulaBadge variant="violet" className="mb-4">Module 0 · Gratuit</NebulaBadge>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-star-white tracking-tight leading-tight mb-4">
              Commencez par le{" "}
              <span className="text-gradient">Module 0</span>
            </h2>
            <p className="text-sm text-mist leading-relaxed mb-6">
              1 vidéo d&apos;introduction exclusive pour comprendre comment l&apos;IA transforme le développement web.
              Aucune carte bancaire requise.
            </p>

            <div className="space-y-3 mb-8">
              {[
                { icon: "🎯", text: "Comprenez le Vibe Coding en 15 minutes" },
                { icon: "⚡", text: "Stack technique : Next.js + Supabase + IA" },
                { icon: "🇩🇿", text: "Exemples concrets adaptés au marché algérien" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm text-mist">
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>

            {/* Email capture */}
            {status === "success" ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              >
                <Check className="w-5 h-5 shrink-0" />
                <div>
                  <p className="text-sm font-medium">Module 0 débloqué !</p>
                  <p className="text-xs text-emerald-400/70">Vérifiez votre boîte mail pour accéder à la vidéo.</p>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-white/5 border border-white/10 text-sm text-star-white placeholder:text-mist/50 focus:outline-none focus:border-violet/50 transition-colors"
                  />
                </div>
                <NebulaButton type="submit" disabled={status === "loading"} className="shrink-0">
                  {status === "loading" ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5" />
                      Accéder gratuitement
                    </>
                  )}
                </NebulaButton>
              </form>
            )}

            {status === "error" && (
              <p className="text-xs text-rose mt-2">Une erreur est survenue. Réessayez.</p>
            )}

            <p className="text-[11px] text-mist/50 mt-3">🔒 Vos données ne seront jamais partagées. Désabonnement à tout moment.</p>
          </motion.div>

          {/* Right: Visual preview */}
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
                  <span className="text-[10px] text-white/70">Aperçu · 14:32</span>
                </div>
              </div>
              <div className="p-4 bg-surface">
                <div className="flex items-center gap-2 text-xs text-mist">
                  <span className="text-violet font-medium">Module 0 · Gratuit</span>
                  <span>·</span>
                  <span>1 vidéo</span>
                  <span>·</span>
                  <span>15 min</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
