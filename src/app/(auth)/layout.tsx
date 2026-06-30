"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-sm text-mist hover:text-star-white transition-colors z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Link>

      <Link href="/" className="absolute top-6 right-6 flex items-center gap-2 z-10">
        <svg width="24" height="24" viewBox="0 0 32 32" fill="none" className="text-violet">
          <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.15" />
          <text x="50%" y="55%" dominantBaseline="middle" textAnchor="middle" fill="#7C5CFF" fontSize="14" fontWeight="600" fontFamily="system-ui">DX</text>
        </svg>
        <span className="text-sm text-star-white hidden sm:inline">DigitalXSolutions</span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
        className="relative z-10 w-full max-w-md"
      >
        {children}
      </motion.div>
    </div>
  );
}
