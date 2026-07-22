"use client";

import { useTranslation } from "@/lib/useTranslation";
import { Languages } from "lucide-react";
import { cn } from "@/lib/utils";

export function LangSwitch({ collapsed = false }: { collapsed?: boolean }) {
  const { lang, toggleLang, isAr, t } = useTranslation();

  return (
    <button
      onClick={toggleLang}
      title={t("langue.switch")}
      className={cn(
        "flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all border",
        "hover:border-cyan-soft/40 hover:text-cyan-soft",
        isAr
          ? "bg-cyan-soft/10 text-cyan-soft border-cyan-soft/20"
          : "bg-white/5 text-mist border-white/10"
      )}
    >
      <Languages className={cn("w-3.5 h-3.5 shrink-0", isAr && "text-cyan-soft")} />
      {!collapsed && <span>{isAr ? "العربية" : "FR"}</span>}
    </button>
  );
}
