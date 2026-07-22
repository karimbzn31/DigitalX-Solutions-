"use client";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl font-display font-bold text-gradient mb-4">404</div>
        <h1 className="text-xl font-display font-semibold text-star-white mb-2">Page introuvable</h1>
        <p className="text-sm text-mist mb-8">
          La page que vous cherchez n&apos;existe pas ou a été déplacée.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet to-magenta text-white text-sm font-medium hover:brightness-110 transition-all"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    </div>
  );
}
