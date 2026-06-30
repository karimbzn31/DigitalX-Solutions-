"use client";

import Link from "next/link";

const footerLinks = {
  formation: [
    { label: "IA Gratuite", href: "/#modules" },
    { label: "Vibe Coding", href: "/#modules" },
    { label: "SaaS", href: "/#modules" },
    { label: "Agents IA", href: "/#modules" },
    { label: "No Code", href: "/#modules" },
    { label: "Startup", href: "/#modules" },
  ],
  ressources: [
    { label: "Blog", href: "/blog" },
    { label: "FAQ", href: "/#faq" },
    { label: "Contact", href: "/contact" },
    { label: "À propos", href: "/#about" },
  ],
  legal: [
    { label: "CGU", href: "/legal" },
    { label: "Mentions légales", href: "/legal" },
    { label: "Contact", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-void">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none" className="text-violet">
                <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.15" />
                <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#7C5CFF" fontSize="14" fontWeight="600" fontFamily="system-ui">DX</text>
              </svg>
              <span className="font-display text-star-white font-semibold">DX Academy</span>
            </Link>
            <p className="text-sm text-mist leading-relaxed mb-6">
              Transformez vos idées en startup grâce à l&apos;IA.
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
                {title}
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
          <p className="text-xs text-mist">
            Fait en Algérie · Ambition mondiale
          </p>
        </div>
      </div>
    </footer>
  );
}
