"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store/useAppStore";
import { NebulaButton } from "@/components/shared/NebulaButton";
import { Sparkles, PartyPopper, Lock } from "lucide-react";

function Sparkle() {
  const style = {
    left: `${Math.random() * 100}%`,
    animationDelay: `${Math.random() * 3}s`,
    animationDuration: `${2 + Math.random() * 3}s`,
    fontSize: `${12 + Math.random() * 16}px`,
  };
  return (
    <div
      className="absolute animate-ping opacity-0 text-violet/40"
      style={{
        ...style,
        animation: `sparkle ${2 + Math.random() * 3}s ease-in-out ${Math.random() * 3}s infinite`,
      }}
    >
      ✦
    </div>
  );
}

export default function ValidationPage() {
  const router = useRouter();
  const setUser = useAppStore((s) => s.setUser);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) {
        router.push("/login");
        return;
      }
      setEmail(data.user.email || "");
      supabase.from("profiles").select("status").eq("id", data.user.id).single().then(({ data: profile }) => {
        if (profile?.status === "active") {
          router.push("/dashboard");
        }
      });
    });
  }, [router]);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) return;
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError("Vous devez \u00eatre connect\u00e9.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/auth/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, code: code.trim() }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Erreur lors de la v\u00e9rification du code.");
      return;
    }

    // Load profile into store
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (authUser) {
      const profRes = await fetch("/api/auth/profile");
      if (profRes.ok) {
        const { profile } = await profRes.json();
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
      }
    }

    router.push("/dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="text-center space-y-8">
      <style>{`
        @keyframes sparkle {
          0%, 100% { opacity: 0; transform: scale(0) rotate(0deg); }
          50% { opacity: 1; transform: scale(1) rotate(180deg); }
        }
      `}</style>

      <div className="relative overflow-hidden nebula-card p-8 md:p-10 rounded-[0.75rem]">
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <Sparkle key={i} />
          ))}
        </div>

        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-violet/20 via-magenta/10 to-rose/10 flex items-center justify-center mx-auto mb-6 border border-violet/20">
            <PartyPopper className="w-9 h-9 text-violet" />
          </div>

          <h1 className="font-display text-2xl md:text-3xl font-bold text-star-white mb-3">
            Bienvenue à <span className="bg-gradient-to-r from-violet via-magenta to-rose bg-clip-text text-transparent">DigitalXSolutions Academy</span>
          </h1>

          <p className="text-base text-mist max-w-md mx-auto leading-relaxed">
            Là où ton avenir t&apos;attend ✨
          </p>

          <div className="mt-8 p-5 rounded-xl bg-void/50 border border-white/[0.06]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-amber-400" />
              </div>
              <h2 className="text-sm font-semibold text-star-white">Compte en attente de validation</h2>
            </div>
            <p className="text-sm text-mist leading-relaxed">
              Ton compte <span className="text-star-white font-medium">{email}</span> a bien été créé mais n&apos;est pas encore actif.
              Une fois ton paiement confirmé, notre équipe te enverra un code de validation par email.
              Saisis-le ci-dessous pour activer ton accès à la formation. 🚀
            </p>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleValidate}>
            {error && (
              <div className="p-3 rounded-lg bg-rose/10 border border-rose/20 text-sm text-rose">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm text-mist">Code de validation</label>
              <input
                type="text"
                placeholder="Entrez votre code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg bg-void border border-white/10 text-star-white text-sm placeholder:text-mist/40 focus:outline-none focus:border-violet transition-colors text-center font-mono text-lg tracking-widest"
                maxLength={16}
              />
            </div>

            <NebulaButton className="w-full py-2.5" disabled={loading}>
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Validation...
                </span>
              ) : (
                "Activer mon compte"
              )}
            </NebulaButton>
          </form>

          <div className="mt-6">
            <button onClick={handleLogout} className="text-xs text-mist hover:text-rose transition-colors">
              Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
