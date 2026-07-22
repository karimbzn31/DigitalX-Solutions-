"use client";

import { useI18nStore, type Lang } from "@/store/useI18nStore";
import { fr, ar, type TranslationKey } from "@/lib/translations";

const dictionaries: Record<Lang, Record<TranslationKey, string>> = { fr, ar };

export function useTranslation() {
  const lang = useI18nStore((s) => s.lang);
  const setLang = useI18nStore((s) => s.setLang);
  const toggleLang = useI18nStore((s) => s.toggleLang);
  const dict = dictionaries[lang];

  function t(key: TranslationKey, vars?: Record<string, string | number>): string {
    let text = dict[key] ?? fr[key] ?? key;
    if (vars) {
      for (const [k, v] of Object.entries(vars)) {
        text = text.replace(`{${k}}`, String(v));
      }
    }
    return text;
  }

  return { t, lang, setLang, toggleLang, isAr: lang === "ar", isFr: lang === "fr" };
}
