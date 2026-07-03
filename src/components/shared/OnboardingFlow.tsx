"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { ArrowRight, Sparkles, Code, Bot, Rocket, Brain } from "lucide-react";

type Level = "debutant" | "intermediaire" | "avance";
type Goal = "startup" | "automatisation" | "ia" | "fullstack";
type Pace = "1h" | "3h" | "5h";

interface OnboardingData {
  level: Level | null;
  goal: Goal | null;
  pace: Pace | null;
}

const levels = [
  { id: "debutant" as Level, label: "Débutant", desc: "Je découvre le code et l'IA", icon: Brain },
  { id: "intermediaire" as Level, label: "Intermédiaire", desc: "J'ai déjà des bases en développement", icon: Code },
  { id: "avance" as Level, label: "Avancé", desc: "Je construis des projets complets", icon: Rocket },
];

const goals = [
  { id: "startup" as Goal, label: "Lancer ma startup", desc: "Créer mon SaaS et le lancer", icon: Rocket },
  { id: "automatisation" as Goal, label: "Automatiser", desc: "Créer des agents IA et workflows", icon: Bot },
  { id: "ia" as Goal, label: "Maîtriser l'IA", desc: "Comprendre et utiliser l'IA générative", icon: Brain },
  { id: "fullstack" as Goal, label: "Devenir Full Stack", desc: "Tout savoir du développement web", icon: Code },
];

const paces = [
  { id: "1h" as Pace, label: "Tranquille", desc: "1h par semaine", emoji: "🌱" },
  { id: "3h" as Pace, label: "Régulier", desc: "3h par semaine", emoji: "🌿" },
  { id: "5h" as Pace, label: "Intensif", desc: "5h+ par semaine", emoji: "🔥" },
];

const STEPS = [
  { key: "level", title: "Quel est ton niveau ?", emoji: "🎯" },
  { key: "goal", title: "Quel est ton objectif ?", emoji: "🚀" },
  { key: "pace", title: "Quel rythme pour toi ?", emoji: "⏱️" },
];

export function OnboardingFlow({ onComplete }: { onComplete: () => void }) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({ level: null, goal: null, pace: null });

  const currentStep = STEPS[step];
  const options = currentStep.key === "level" ? levels : currentStep.key === "goal" ? goals : paces;

  const select = (id: string) => {
    const newData = { ...data, [currentStep.key]: id };
    setData(newData);
    if (step < 2) {
      setStep(step + 1);
    } else {
      localStorage.setItem("dx-onboarding-done", "true");
      localStorage.setItem("dx-onboarding-data", JSON.stringify(newData));
      onComplete();
      router.refresh();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-void/95 backdrop-blur-xl flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <div
                key={s.key}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i <= step ? "bg-violet w-8" : "bg-white/10 w-6"
                }`}
              />
            ))}
          </div>
          <button
            onClick={() => { localStorage.setItem("dx-onboarding-done", "true"); onComplete(); }}
            className="text-xs text-mist hover:text-star-white transition-colors"
          >
            Passer
          </button>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="text-center mb-8">
              <span className="text-3xl mb-3 block">{currentStep.emoji}</span>
              <h2 className="text-xl font-display font-semibold text-star-white">{currentStep.title}</h2>
            </div>

            <div className="space-y-2">
              {(options as any[]).map((opt) => {
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.id}
                    onClick={() => select(opt.id)}
                    className={`flex items-center gap-4 w-full p-4 rounded-xl border text-left transition-all group hover:border-violet/40 ${
                      data[currentStep.key as keyof OnboardingData] === opt.id
                        ? "border-violet/50 bg-violet/10"
                        : "border-white/[0.07] bg-surface/70"
                    }`}
                  >
                    {Icon ? (
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-violet" />
                      </div>
                    ) : (
                      <span className="text-2xl">{opt.emoji}</span>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-star-white">{opt.label}</p>
                      <p className="text-xs text-mist">{opt.desc}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-violet opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
