"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppStore } from "@/store/useAppStore";
import { NebulaButton } from "@/components/shared/NebulaButton";

export default function RegisterPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    setUser({ name, initials, email, isAdmin: false });
    router.push("/dashboard");
  };

  return (
    <div className="nebula-card p-8 rounded-[0.75rem]">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-star-white mb-2">Créer un compte</h1>
        <p className="text-sm text-mist">Rejoignez DigitalXSolutions Academy</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <label className="text-sm text-mist">Nom complet</label>
          <input
            type="text"
            placeholder="Votre nom"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-void border border-white/10 text-star-white text-sm placeholder:text-mist/40 focus:outline-none focus:border-violet transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-mist">Email</label>
          <input
            type="email"
            placeholder="vous@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-void border border-white/10 text-star-white text-sm placeholder:text-mist/40 focus:outline-none focus:border-violet transition-colors"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-mist">Mot de passe</label>
          <input
            type="password"
            placeholder="Minimum 8 caractères"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-void border border-white/10 text-star-white text-sm placeholder:text-mist/40 focus:outline-none focus:border-violet transition-colors"
          />
        </div>
        <NebulaButton className="w-full py-2.5">Créer mon compte</NebulaButton>
      </form>

      <p className="text-center text-sm text-mist mt-6">
        Déjà un compte ?{" "}
        <Link href="/login" className="text-violet hover:underline">
          Se connecter
        </Link>
      </p>
    </div>
  );
}
