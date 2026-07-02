"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { NebulaButton } from "@/components/shared/NebulaButton";

export default function ValidationPage() {
  const router = useRouter();
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
      setError("Vous devez être connecté.");
      setLoading(false);
      return;
    }

    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("validation_code, status")
      .eq("id", user.id)
      .single();

    if (fetchError || !profile) {
      setError("Erreur lors de la vérification du code.");
      setLoading(false);
      return;
    }

    if (profile.status === "active") {
      router.push("/dashboard");
      return;
    }

    if (profile.validation_code !== code.trim()) {
      setError("Code invalide. Vérifiez votre code et réessayez.");
      setLoading(false);
      return;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ status: "active", validation_code: null })
      .eq("id", user.id);

    setLoading(false);

    if (updateError) {
      setError("Erreur lors de l'activation du compte.");
      return;
    }

    router.push("/dashboard");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div className="nebula-card p-8 rounded-[0.75rem]">
      <div className="text-center mb-8">
        <h1 className="font-display text-2xl font-bold text-star-white mb-2">Compte en attente</h1>
        <p className="text-sm text-mist">
          Votre compte <span className="text-star-white font-medium">{email}</span> est en attente de validation.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleValidate}>
        {error && (
          <div className="p-3 rounded-lg bg-rose/10 border border-rose/20 text-sm text-rose">
            {error}
          </div>
        )}

        <div className="bg-void/50 rounded-xl p-5 border border-white/[0.06] text-center space-y-3">
          <p className="text-sm text-mist">
            Un administrateur vous enverra un code de validation après confirmation de votre paiement.
          </p>
          <p className="text-xs text-mist/60">
            Vous avez reçu votre code ? Saisissez-le ci-dessous.
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-mist">Code de validation</label>
          <input
            type="text"
            placeholder="Entrez votre code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg bg-void border border-white/10 text-star-white text-sm placeholder:text-mist/40 focus:outline-none focus:border-violet transition-colors text-center font-mono text-lg tracking-widest"
            maxLength={8}
          />
        </div>

        <NebulaButton className="w-full py-2.5" disabled={loading}>
          {loading ? "Validation..." : "Activer mon compte"}
        </NebulaButton>
      </form>

      <div className="text-center mt-6">
        <button onClick={handleLogout} className="text-xs text-mist hover:text-rose transition-colors">
          Se déconnecter
        </button>
      </div>
    </div>
  );
}
