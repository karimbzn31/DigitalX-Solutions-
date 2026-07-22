"use client";

import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { useTranslation } from "@/lib/useTranslation";
import type { TranslationKey } from "@/lib/translations";

export function Footer() {
  const { t, isAr } = useTranslation();

  const footerLinks = {
    formation: [
      { label: t("footer.iaGratuite"), href: "/#modules" },
      { label: t("footer.vibeCoding"), href: "/#modules" },
      { label: t("footer.saas"), href: "/#modules" },
      { label: t("footer.agentsIA"), href: "/#modules" },
      { label: t("footer.noCode"), href: "/#modules" },
      { label: t("footer.startup"), href: "/#modules" },
    ],
    ressources: [
      { label: t("footer.blog"), href: "/blog" },
      { label: t("footer.faq"), href: "/#faq" },
      { label: t("footer.contact"), href: "/contact" },
      { label: t("footer.aPropos"), href: "/#about" },
    ],
    legal: [
      { label: t("footer.cgu"), href: "/legal" },
      { label: t("footer.mentionsLegales"), href: "/legal" },
      { label: t("footer.contact"), href: "/contact" },
    ],
  };
  return (
    <footer className="border-t border-white/5 bg-void">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Logo size={28} />
              <span className={`${isAr ? "font-arabic" : "font-display"} text-star-white font-semibold`}>DX Academy</span>
            </Link>
            <p className={`text-sm text-mist leading-relaxed mb-6 ${isAr ? "font-arabic" : ""}`}>
              {t("footer.tagline")}
            </p>
            <div className="flex items-center gap-4">
              {[
                { name: "LinkedIn", href: "#" },
                { name: "Twitter", href: "#" },
                { name: "YouTube", href: "#" },
              ].map((s) => (
                <Link
                  key={s.name}
                  href={s.href}
                  className="text-sm text-mist hover:text-violet transition-colors"
                >
                  {s.name}
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-medium text-mist capitalize mb-4">
                {t(`footer.${title}` as TranslationKey)}
              </h3>
              <ul className="space-y-3">
                {links.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-mist hover:text-star-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-mist">
            &copy; {new Date().getFullYear()} DigitalXSolutions Academy
          </p>
          <p className={`text-xs text-mist ${isAr ? "font-arabic" : ""}`}>
            {t("footer.faitAlgerie")}
          </p>
        </div>
      </div>
    </footer>
  );
}
