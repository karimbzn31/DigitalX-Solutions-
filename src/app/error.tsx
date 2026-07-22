"use client";
import { useTranslation } from "@/lib/useTranslation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-void flex flex-col items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-4">⚠️</div>
        <h1 className="text-xl font-display font-semibold text-star-white mb-2">Une erreur est survenue</h1>
        <p className="text-sm text-mist mb-8">
          {error.message || "Veuillez réessayer."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet to-magenta text-white text-sm font-medium hover:brightness-110 transition-all"
        >
          Réessayer
        </button>
      </div>
    </div>
  );
}
