import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "fr" | "ar";

interface I18nState {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  dir: "ltr" | "rtl";
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      lang: "fr",
      setLang: (lang) => set({ lang, dir: lang === "ar" ? "rtl" : "ltr" }),
      toggleLang: () => {
        const next = get().lang === "fr" ? "ar" : "fr";
        set({ lang: next, dir: next === "ar" ? "rtl" : "ltr" });
      },
      dir: "ltr",
    }),
    { name: "dx-academy-lang" }
  )
);
