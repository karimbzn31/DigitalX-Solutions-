"use client";

import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";
import { NebulaButton } from "@/components/shared/NebulaButton";
import { useTranslation } from "@/lib/useTranslation";

export default function LoginPage() {
  const { t, isAr } = useTranslation();
  const setUser = useAppStore((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email || !password) return;
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const res = await fetch("/api/auth/profile");

    if (!res.ok) {
      await supabase.auth.signOut();
      await supabase.auth.signOut();
      setError(t("error.profilIntrouvable"));
      setLoading(false);
      return;
    }

    const { profile } = await res.json();

    setUser({
      id: profile.id,
      name: profile.name,
      initials: profile.initials,
      email: profile.email,
      isAdmin: profile.is_admin,
      status: profile.status,
      level: profile.level,
      totalProgress: profile.total_progress,
      videosWatched: profile.videos_watched,
      totalVideos: profile.total_videos,
      timeSpent: profile.time_spent,
      certificates: profile.certificates,
      joinedAt: profile.created_at,
    });

    if (profile?.status === "blocked") {
      await supabase.auth.signOut();
      setError("Votre compte a été bloqué.");
      return;
    }

    if (profile?.status === "pending") {
      window.location.href = "/validation";
      return;
    }

    // Navigation forcée → évite le cache Next.js côté client
    window.location.href = profile.is_admin ? "/admin" : "/dashboard";
  };

  return (
    <div className="nebula-card p-8 rounded-[0.75rem]">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-star-white mb-2">{t("login.bienvenue")}</h1>
        <p className="text-sm text-mist">{t("login.subtitle")}</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 rounded-lg bg-rose/10 border border-rose/20 text-sm text-rose">
            {error}
          </div>
        )}
        <div className="space-y-2">
          <label className="text-sm text-mist">{t("login.email")}</label>
          <input
            type="email"
            placeholder="email@exemple.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-void border border-white/10 text-star-white text-sm placeholder:text-mist/40 focus:outline-none focus:border-violet transition-colors"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm text-mist">{t("login.password")}</label>
            <Link href="/forgot-password" className="text-xs text-violet hover:underline">
              {t("login.mdpOublie")}
            </Link>
          </div>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-void border border-white/10 text-star-white text-sm placeholder:text-mist/40 focus:outline-none focus:border-violet transition-colors"
          />
        </div>
        <NebulaButton className="w-full py-2.5" disabled={loading}>
          {loading ? t("common.chargement") : t("login.connecter")}
        </NebulaButton>
      </form>

      <p className="text-center text-sm text-mist mt-6">
        {t("login.pasCompte")}{" "}
        <Link href="/register" className="text-violet hover:underline">
          {t("login.inscrire")}
        </Link>
      </p>
    </div>
  );
}
