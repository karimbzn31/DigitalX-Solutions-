"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function FloatingCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY;
      const maxScroll = Math.max(document.body.scrollHeight - 1500, 500);
      setVisible(scrollY > 200 && scrollY < maxScroll);
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-4 z-50"
        >
          <motion.div
            animate={{ boxShadow: [
              "0 0 20px rgba(124,92,255,0.3), 0 0 40px rgba(124,92,255,0.1)",
              "0 0 30px rgba(124,92,255,0.5), 0 0 60px rgba(124,92,255,0.2)",
              "0 0 20px rgba(124,92,255,0.3), 0 0 40px rgba(124,92,255,0.1)",
            ]}}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="rounded-full"
          >
            <Link
              href="/register"
              className="flex items-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-violet to-magenta text-star-white text-sm font-medium shadow-lg active:scale-95 transition-transform"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              Rejoindre
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
