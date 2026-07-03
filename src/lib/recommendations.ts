type Level = "debutant" | "intermediaire" | "avance";
type Goal = "startup" | "automatisation" | "ia" | "fullstack";
type Pace = "1h" | "3h" | "5h";

export interface OnboardingAnswers {
  level: Level;
  goal: Goal;
  pace: Pace;
}

const GOAL_MODULE_MAP: Record<Goal, string[]> = {
  startup: ["mod-saas", "mod-mindset", "mod-fullstack"],
  automatisation: ["mod-agent-ia", "mod-ia-senior", "mod-vibe-coding"],
  ia: ["mod-ia-senior", "mod-agent-ia", "mod-vibe-coding"],
  fullstack: ["mod-fullstack", "mod-vibe-coding", "mod-saas"],
};

const LEVEL_MODULE_MAP: Record<Level, string[]> = {
  debutant: ["mod-ia-senior", "mod-mindset"],
  intermediaire: ["mod-vibe-coding", "mod-fullstack", "mod-ia-senior"],
  avance: ["mod-saas", "mod-agent-ia", "mod-fullstack"],
};

export function getRecommendedModuleIds(answers: OnboardingAnswers): string[] {
  const byGoal = GOAL_MODULE_MAP[answers.goal] || [];
  const byLevel = LEVEL_MODULE_MAP[answers.level] || [];
  const combined = byGoal.concat(byLevel);
  return combined.filter((id, i) => combined.indexOf(id) === i);
}

export function getOnboardingData(): OnboardingAnswers | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("dx-onboarding-data");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as OnboardingAnswers;
  } catch {
    return null;
  }
}
