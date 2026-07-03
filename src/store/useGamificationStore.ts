import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Badge = {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlockedAt?: Date;
};

type GamificationState = {
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  badges: Badge[];
  addXp: (amount: number) => void;
  checkStreak: () => void;
  unlockBadge: (badge: Badge) => void;
};

const LEVEL_THRESHOLDS = [
  { level: 1, xp: 0, title: "Apprenti IA" },
  { level: 2, xp: 500, title: "Vibe Coder" },
  { level: 3, xp: 1500, title: "Agent Builder" },
  { level: 4, xp: 3500, title: "Full Stack" },
  { level: 5, xp: 7000, title: "Fondateur" },
  { level: 6, xp: 12000, title: "Architecte IA" },
];

export const ALL_BADGES: Badge[] = [
  { id: "first-video", name: "Premier pas", icon: "🎬", description: "Regarde ta première vidéo" },
  { id: "streak-3", name: "Régulier", icon: "🔥", description: "3 jours de suite" },
  { id: "streak-7", name: "Motivé", icon: "⚡", description: "7 jours de suite" },
  { id: "streak-30", name: "Inarrêtable", icon: "💪", description: "30 jours de suite" },
  { id: "module-1", name: "Module IA", icon: "🧠", description: "Termine le module 1" },
  { id: "module-all", name: "Diplômé", icon: "🎓", description: "Termine tous les modules" },
  { id: "helper", name: "Membre actif", icon: "🤝", description: "Aide 5 membres dans la communauté" },
  { id: "social", name: "Ambassadeur", icon: "📢", description: "Partage ta progression" },
];

export function getLevelTitle(xp: number): string {
  const level = LEVEL_THRESHOLDS.slice().reverse().find((t) => xp >= t.xp);
  return level?.title || "Apprenti IA";
}

export function getLevel(xp: number): number {
  const level = LEVEL_THRESHOLDS.slice().reverse().find((t) => xp >= t.xp);
  return level?.level || 1;
}

export function getNextLevelXp(xp: number): number {
  const currentLevel = getLevel(xp);
  const next = LEVEL_THRESHOLDS.find((t) => t.level === currentLevel + 1);
  return next ? next.xp : LEVEL_THRESHOLDS[LEVEL_THRESHOLDS.length - 1].xp;
}

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: "",
      badges: [],

      addXp: (amount) =>
        set((state) => {
          const newXp = state.xp + amount;
          return { xp: newXp, level: getLevel(newXp) };
        }),

      checkStreak: () => {
        const today = new Date().toDateString();
        const { lastActiveDate, streak } = get();
        if (lastActiveDate === today) return;

        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = lastActiveDate === yesterday ? streak + 1 : 1;
        const xpBonus = newStreak > 1 ? newStreak * 10 : 0;

        set({ streak: newStreak, lastActiveDate: today });
        if (xpBonus > 0) {
          get().addXp(xpBonus);
        }
      },

      unlockBadge: (badge) =>
        set((state) => {
          if (state.badges.find((b) => b.id === badge.id)) return state;
          return {
            badges: [...state.badges, { ...badge, unlockedAt: new Date() }],
          };
        }),
    }),
    { name: "dx-academy-gamification" }
  )
);
