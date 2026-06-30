"use client";

import { NebulaCard } from "@/components/shared/NebulaCard";
import { NebulaButton } from "@/components/shared/NebulaButton";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-star-white">Paramètres</h1>
        <p className="text-sm text-mist">Gérez votre compte et vos préférences</p>
      </div>

      <NebulaCard className="p-6 max-w-lg">
        <h2 className="text-sm font-medium text-mist mb-4">Informations personnelles</h2>
        <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-2">
            <label className="text-sm text-mist">Nom</label>
            <input
              type="text"
              defaultValue="Karim B."
              className="w-full px-3 py-2 rounded-lg bg-void border border-white/10 text-star-white text-sm focus:outline-none focus:border-violet transition-colors"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-mist">Email</label>
            <input
              type="email"
              defaultValue="karim@dx.academy"
              className="w-full px-3 py-2 rounded-lg bg-void border border-white/10 text-star-white text-sm focus:outline-none focus:border-violet transition-colors"
            />
          </div>
          <NebulaButton type="submit" className="py-2">Enregistrer</NebulaButton>
        </form>
      </NebulaCard>
    </div>
  );
}
