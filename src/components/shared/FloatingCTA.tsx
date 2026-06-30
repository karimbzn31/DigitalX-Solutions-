"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 100 && window.scrollY < document.body.scrollHeight - 1000);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div
      className={`fixed bottom-24 md:bottom-8 right-4 z-40 md:hidden transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      <Link
        href="/register"
        className="flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-violet to-magenta text-star-white text-sm font-medium shadow-lg shadow-violet/25 active:scale-95 transition-transform"
      >
        Rejoindre
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}
