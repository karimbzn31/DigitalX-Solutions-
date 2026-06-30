"use client";

import Link from "next/link";
import { NebulaButton } from "@/components/shared/NebulaButton";

export default function LoginPage() {
  return (
    <div className="nebula-card p-8 rounded-[0.75rem]">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-star-white mb-2">Se connecter</h1>
        <p className="text-sm text-mist">Accédez à votre espace de formation</p>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <label className="text-sm text-mist">Email</label>
          <input
            type="email"
            placeholder="vous@email.com"
            className="w-full px-4 py-2.5 rounded-lg bg-void border border-white/10 text-star-white text-sm placeholder:text-mist/40 focus:outline-none focus:border-violet transition-colors"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-mist">Mot de passe</label>
            <Link href="/forgot-password" className="text-xs text-violet hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            className="w-full px-4 py-2.5 rounded-lg bg-void border border-white/10 text-star-white text-sm placeholder:text-mist/40 focus:outline-none focus:border-violet transition-colors"
          />
        </div>
        <NebulaButton className="w-full py-2.5">Se connecter</NebulaButton>
      </form>

      <p className="text-center text-sm text-mist mt-6">
        Pas encore de compte ?{" "}
        <Link href="/register" className="text-violet hover:underline">
          S&apos;inscrire
        </Link>
      </p>
    </div>
  );
}
