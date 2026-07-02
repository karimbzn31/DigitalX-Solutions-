"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { CheckCircle, XCircle, Copy, RefreshCw, Shield } from "lucide-react";

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

interface PendingUser {
  id: string;
  email: string;
  name: string;
  initials: string;
  status: string;
  validation_code: string | null;
  created_at: string;
}

export default function AdminValidationsPage() {
  const [users, setUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("*")
      .in("status", ["pending", "active"])
      .order("created_at", { ascending: false });
    if (data) setUsers(data as PendingUser[]);
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleGenerateCode = async (userId: string) => {
    const code = generateCode();
    const { error } = await supabase
      .from("profiles")
      .update({ validation_code: code })
      .eq("id", userId);

    if (!error) {
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, validation_code: code } : u))
      );
    }
  };

  const handleCopyCode = (code: string, userId: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(userId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleActivate = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "active", validation_code: null })
      .eq("id", userId);

    if (!error) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  const handleBlock = async (userId: string) => {
    const { error } = await supabase
      .from("profiles")
      .update({ status: "blocked" })
      .eq("id", userId);

    if (!error) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-star-white">Validations</h1>
          <p className="text-sm text-mist mt-1">Gérer les comptes en attente de validation</p>
        </div>
        <button
          onClick={fetchUsers}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 text-mist hover:text-star-white hover:bg-white/10 transition-all text-sm"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Actualiser
        </button>
      </div>

      <NebulaCard className="p-6">
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-white/[0.06]">
          <div className="w-9 h-9 rounded-lg bg-violet/10 flex items-center justify-center">
            <Shield className="w-4 h-4 text-violet" />
          </div>
          <div>
            <p className="text-sm font-medium text-star-white">
              {users.filter((u) => u.status === "pending").length} en attente
            </p>
            <p className="text-xs text-mist">
              {users.filter((u) => u.status === "active").length} actifs
            </p>
          </div>
        </div>

        {loading ? (
          <p className="text-sm text-mist text-center py-8">Chargement...</p>
        ) : users.length === 0 ? (
          <p className="text-sm text-mist text-center py-8">Aucun utilisateur en attente.</p>
        ) : (
          <div className="space-y-3">
            {users.map((u) => (
              <div
                key={u.id}
                className="flex items-center justify-between gap-4 p-4 rounded-xl bg-void/50 border border-white/[0.06]"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-xs font-bold text-white shrink-0">
                    {u.initials || "?"}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-star-white font-medium truncate">{u.name || "—"}</p>
                    <p className="text-xs text-mist truncate">{u.email}</p>
                    {u.validation_code && (
                      <div className="flex items-center gap-2 mt-1">
                        <code className="text-xs bg-void px-2 py-0.5 rounded text-violet font-mono tracking-wider">
                          {u.validation_code}
                        </code>
                        <button
                          onClick={() => handleCopyCode(u.validation_code!, u.id)}
                          className="p-1 rounded hover:bg-white/5 text-mist hover:text-star-white transition-colors"
                        >
                          {copiedId === u.id ? (
                            <span className="text-[10px] text-emerald-400">Copié!</span>
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {u.status === "pending" && (
                    <>
                      {!u.validation_code ? (
                        <button
                          onClick={() => handleGenerateCode(u.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet/10 text-violet text-xs font-medium hover:bg-violet/20 transition-all"
                        >
                          Générer un code
                        </button>
                      ) : (
                        <button
                          onClick={() => handleActivate(u.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Activer
                        </button>
                      )}
                      <button
                        onClick={() => handleBlock(u.id)}
                        className="p-1.5 rounded-lg text-mist hover:text-rose hover:bg-rose/5 transition-all"
                        title="Bloquer"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>
                    </>
                  )}
                  {u.status === "active" && (
                    <span className="text-[11px] text-emerald-400 font-medium">Actif</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </NebulaCard>
    </div>
  );
}
