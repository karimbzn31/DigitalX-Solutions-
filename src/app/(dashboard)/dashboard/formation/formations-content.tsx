"use client";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/useTranslation";
import {
  Sparkles, ChevronRight, Layers, Star, Users, ArrowUpRight,
  CheckCircle, GraduationCap, Bot
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────
interface Formation {
  id: string;
  icon: string;
  title: string;
  tagline: string;
  description: string;
  color: { from: string; to: string };
  accent: string;
  features: string[];
  stats: { label: string; value: string }[];
  gradient: string;
}

// ─── Données des 6 formations ────────────────────────────────────────────
const FORMATIONS: Formation[] = [
  {
    id: "claude-code-jarvis",
    icon: "🤖",
    title: "Claude Code & JARVIS",
    tagline: "L'art du prompting et de l'orchestration IA",
    description:
      "Maîtrisez Claude Code et l'écosystème JARVIS pour coder 10× plus vite. Apprenez le routage intelligent, l'auto-learning, et la création d'assistants IA sur-mesure.",
    color: { from: "#7C5CFF", to: "#C45CFF" },
    accent: "violet",
    gradient: "from-violet/20 via-magenta/10 to-transparent",
    features: [
      "Prompt engineering avancé & agentic coding",
      "Routage multi-modèle & système JARVIS",
      "Auto-learning avec base de connaissance",
      "Workflows d'agents & MCP tools",
    ],
    stats: [
      { label: "Modules", value: "8" },
      { label: "Projets", value: "5" },
      { label: "Niveau", value: "Tous" },
    ],
  },
  {
    id: "vibe-coding",
    icon: "🎨",
    title: "Vibe Coding",
    tagline: "Du concept à l'écran, sans écrire une ligne",
    description:
      "Créez des applications complètes en langage naturel. Décrivez, itérez, déployez — l'IA génère le code. Le futur du développement est conversationnel.",
    color: { from: "#5CC9FF", to: "#7C5CFF" },
    accent: "cyan",
    gradient: "from-cyan-soft/20 via-violet/10 to-transparent",
    features: [
      "UI/UX générative par description",
      "Prototypage rapide & itérations",
      "Déploiement one-click",
      "Composants premium & animations",
    ],
    stats: [
      { label: "Modules", value: "6" },
      { label: "Projets", value: "8" },
      { label: "Niveau", value: "Débutant" },
    ],
  },
  {
    id: "agent-ia-autonome",
    icon: "🧠",
    title: "Agent IA Autonome",
    tagline: "Des agents qui travaillent pour vous, 24/7",
    description:
      "Concevez, déployez et gérez des agents IA autonomes capables d'exécuter des tâches complexes sans supervision. Du simple chatbot à l'agent multi-tâches.",
    color: { from: "#FF6FB8", to: "#C45CFF" },
    accent: "rose",
    gradient: "from-rose/20 via-magenta/10 to-transparent",
    features: [
      "Architecture d'agents & memory systems",
      "Outils & function calling",
      "Agents multi-tâches autonomes",
      "Déploiement & monitoring",
    ],
    stats: [
      { label: "Modules", value: "10" },
      { label: "Projets", value: "6" },
      { label: "Niveau", value: "Intermédiaire" },
    ],
  },
  {
    id: "n8n-automation",
    icon: "⚡",
    title: "n8n Automation Workflow",
    tagline: "Automatisez tout, sans code",
    description:
      "Maîtrisez n8n pour créer des workflows d'automatisation puissants. Connectez vos apps, intégrez l'IA, et construisez des pipelines de données visuels.",
    color: { from: "#FF4D4D", to: "#FF6FB8" },
    accent: "red",
    gradient: "from-red-500/15 via-rose/10 to-transparent",
    features: [
      "Workflows visuels & Webhooks",
      "Intégrations IA (OpenAI, Claude...)",
      "API, CRM, Email automation",
      "Déploiement production",
    ],
    stats: [
      { label: "Modules", value: "7" },
      { label: "Workflows", value: "12" },
      { label: "Niveau", value: "Tous" },
    ],
  },
  {
    id: "saas-creation",
    icon: "🚀",
    title: "SaaS — Création de A à Z",
    tagline: "Construisez votre empire SaaS",
    description:
      "De l'idée au lancement, créez votre SaaS complet. Stack moderne, auth, paiements, dashboard admin, et tout ce qu'il faut pour lancer votre produit en ligne.",
    color: { from: "#10B981", to: "#5CC9FF" },
    accent: "emerald",
    gradient: "from-emerald-400/15 via-cyan-soft/10 to-transparent",
    features: [
      "Stack Next.js + Supabase + Stripe",
      "Auth, rôles, permissions",
      "Dashboard admin & analytics",
      "Déploiement Vercel & scaling",
    ],
    stats: [
      { label: "Modules", value: "12" },
      { label: "Projets", value: "3" },
      { label: "Niveau", value: "Avancé" },
    ],
  },
  {
    id: "startup-zero",
    icon: "💡",
    title: "Créer une Startup de A à Z",
    tagline: "De l'idée au marché, le guide complet",
    description:
      "Tout ce qu'il faut savoir pour lancer sa startup en Algérie et dans le monde : idée, lean canvas, MVP, legal, fundraising, growth hacking, et scaling.",
    color: { from: "#F59E0B", to: "#FF4D4D" },
    accent: "amber",
    gradient: "from-amber-400/15 via-red-500/10 to-transparent",
    features: [
      "Lean Startup & Product-Market Fit",
      "Business model & stratégie pricing",
      "Legal, compta & fiscalité (Algérie)",
      "Growth hacking & fundraising",
    ],
    stats: [
      { label: "Modules", value: "9" },
      { label: "Études", value: "10" },
      { label: "Niveau", value: "Tous" },
    ],
  },
];

// ─── Composants ──────────────────────────────────────────────────────────

function HeroSection() {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-violet/30 via-magenta/10 to-void p-8 sm:p-12">
      {/* Effet de glow */}
      <div className="pointer-events-none absolute -top-40 -right-40 w-96 h-96 rounded-full bg-violet/20 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-40 w-80 h-80 rounded-full bg-magenta/15 blur-[100px]" />

      <div className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-violet/15 border border-violet/20 text-violet text-xs font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Catalogue 2026
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold tracking-tight">
            <span className="text-gradient">Nos Formations</span>
          </h1>
          <p className="mt-3 text-mist text-sm sm:text-base max-w-2xl leading-relaxed">
            Explorez notre catalogue de formations conçues pour faire de vous un expert en IA,
            automation, et création de startups. Chaque formation est 100% pratique & projet.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6"
        >
          <div className="flex items-center gap-2 text-xs text-mist">
            <Layers className="w-4 h-4 text-violet" />
            <span><strong className="text-star-white">{FORMATIONS.length}</strong> formations</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-mist">
            <GraduationCap className="w-4 h-4 text-cyan-soft" />
            <span>Certificat à la clé</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-mist">
            <Users className="w-4 h-4 text-emerald-400" />
            <span>Accès communauté privée</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function FormationCard({ formation, index }: { formation: Formation; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-xl border border-white/[0.07] bg-surface/70 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-violet/40"
    >
      {/* Bordure animée au hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at 50% -20%, ${formation.color.from}22, transparent 60%)`,
        }}
      />

      {/* Header gradient */}
      <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${formation.color.from}, ${formation.color.to})` }} />

      {/* Barre latérale gauche */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(180deg, ${formation.color.from}, ${formation.color.to})` }}
      />

      <div className="relative z-10 p-5 sm:p-6">
        {/* Icon + Tag */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${formation.color.from}25, ${formation.color.to}15)`,
                border: `1px solid ${formation.color.from}30`,
              }}
            >
              {formation.icon}
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-star-white">{formation.title}</h3>
              <p className="text-[11px] text-mist mt-0.5">{formation.tagline}</p>
            </div>
          </div>

          {/* Arrow indicator */}
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0"
            style={{
              background: isHovered ? `${formation.color.from}20` : "transparent",
              transform: isHovered ? "translateX(2px)" : "translateX(0)",
            }}
          >
            <ArrowUpRight className="w-4 h-4" style={{ color: formation.color.from }} />
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-mist leading-relaxed mb-4 line-clamp-2">
          {formation.description}
        </p>

        {/* Features */}
        <div className="space-y-1.5 mb-5">
          {formation.features.map((feat, i) => (
            <div key={i} className="flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: formation.color.from }} />
              <span className="text-[11px] text-mist/90">{feat}</span>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 py-3 border-t border-white/[0.06] mb-4">
          {formation.stats.map((stat, i) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-star-white">{stat.value}</span>
              <span className="text-[10px] text-mist">{stat.label}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/dashboard/formation/${formation.id}`}
          className="group/btn relative flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-xs font-semibold transition-all duration-300 overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${formation.color.from}, ${formation.color.to})`,
          }}
        >
          <span className="relative z-10 text-white">Découvrir la formation</span>
          <ChevronRight className="relative z-10 w-3.5 h-3.5 text-white group-hover/btn:translate-x-1 transition-transform" />
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
        </Link>
      </div>
    </motion.div>
  );
}

function BottomCTA() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-xl border border-white/[0.07] bg-gradient-to-r from-violet/10 via-magenta/5 to-cyan-soft/10 p-6 sm:p-8 text-center"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/4 w-60 h-60 bg-violet/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-60 h-60 bg-cyan-soft/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10">
        <Star className="w-8 h-8 text-violet mx-auto mb-3" />
        <h3 className="text-lg font-display font-bold text-star-white">
          Une question sur nos formations ?
        </h3>
        <p className="text-xs text-mist mt-1 max-w-md mx-auto">
          Notre équipe et la communauté sont là pour vous guider dans votre choix
        </p>
        <div className="flex items-center justify-center gap-3 mt-5">
          <Link
            href="/dashboard/communaute"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-violet/10 border border-violet/20 text-violet text-xs font-medium hover:bg-violet/20 transition-colors"
          >
            <Users className="w-3.5 h-3.5" />
            Rejoindre la communauté
          </Link>
          <Link
            href="/dashboard/ai"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-mist text-xs font-medium hover:text-star-white hover:bg-white/10 transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            Demander à DigitalX IA
          </Link>
        </div>
      </div>
    </motion.section>
  );
}

// ─── Page principale ─────────────────────────────────────────────────────
export default function FormationsContent() {
  return (
    <div className="space-y-8 sm:space-y-10">
      {/* Hero */}
      <HeroSection />

      {/* Grille des formations */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
        {FORMATIONS.map((formation, index) => (
          <FormationCard key={formation.id} formation={formation} index={index} />
        ))}
      </div>

      {/* Bottom CTA */}
      <BottomCTA />
    </div>
  );
}
