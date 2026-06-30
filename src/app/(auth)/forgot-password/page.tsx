"use client";

import { useState } from "react";
import { NebulaButton } from "@/components/shared/NebulaButton";

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false);

  return (
    <div className="nebula-card p-8 rounded-[0.75rem]">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-star-white mb-2">Mot de passe oublié</h1>
        <p className="text-sm text-mist">
          {sent
            ? "Un email de réinitialisation vous a été envoyé."
            : "Entrez votre email et nous vous enverrons un lien de réinitialisation."}
        </p>
      </div>

      <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setSent(true); }}>
        <div className="space-y-2">
          <label className="text-sm text-mist">Email</label>
          <input
            type="email"
            placeholder="vous@email.com"
            className="w-full px-4 py-2.5 rounded-lg bg-void border border-white/10 text-star-white text-sm placeholder:text-mist/40 focus:outline-none focus:border-violet transition-colors"
          />
        </div>
        <NebulaButton className="w-full py-2.5">
          {sent ? "Email envoyé" : "Réinitialiser le mot de passe"}
        </NebulaButton>
      </form>
    </div>
  );
}
