"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";

export function FloatingCTA() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.05, 0.85, 0.95], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.05, 0.85, 0.95], [20, 0, 0, 20]);

  return (
    <motion.div
      style={{ opacity, y }}
      className="fixed bottom-24 md:bottom-8 right-4 z-40 md:hidden"
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
    </motion.div>
  );
}
