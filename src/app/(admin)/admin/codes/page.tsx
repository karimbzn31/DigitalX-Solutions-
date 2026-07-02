"use client";

import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Copy, Check, X, Hash, Users, Tag, Clock, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { cn } from "@/lib/utils";
import { ACCESS_CODES, type AccessCode } from "@/lib/mock-admin";

function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function generateCode(): string {
  const prefix = "DX-";
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return prefix + code;
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  active: { label: "Actif", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15" },
  expired: { label: "Expiré", classes: "bg-rose/10 text-rose border-rose/15" },
  depleted: { label: "Épuisé", classes: "bg-amber-500/10 text-amber-400 border-amber-500/15" },
};

export default function AdminCodesPage() {
  const [codes, setCodes] = useState<AccessCode[]>(ACCESS_CODES);
  const [showGenerate, setShowGenerate] = useState(false);
  const [newCode, setNewCode] = useState(generateCode());
  const [newTag, setNewTag] = useState("");
  const [newMaxUses, setNewMaxUses] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback(async (code: string, id: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {}
  }, []);

  const handleGenerate = useCallback(() => {
    setCodes((prev) => [
      {
        id: `c${Date.now()}`,
        code: newCode,
        tag: newTag || "Sans tag",
        uses: 0,
        maxUses: newMaxUses ? parseInt(newMaxUses) : null,
        expiry: newExpiry ? new Date(newExpiry).toISOString() : null,
        status: "active",
      },
      ...prev,
    ]);
    setShowGenerate(false);
    setNewCode(generateCode());
    setNewTag("");
    setNewMaxUses("");
    setNewExpiry("");
  }, [newCode, newTag, newMaxUses, newExpiry]);

  const stats = {
    total: codes.length,
    active: codes.filter((c) => c.status === "active").length,
    totalUses: codes.reduce((a, c) => a + c.uses, 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Codes d&apos;accès</h1>
          <p className="text-white/50 text-sm mt-1">{stats.active} codes actifs · {stats.totalUses} utilisations</p>
        </div>
        <button
          onClick={() => setShowGenerate(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-soft to-violet text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          Générer un code
        </button>
      </div>

      {/* Mini KPI */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Hash, label: "Total codes", value: stats.total },
          { icon: CheckCircle, label: "Codes actifs", value: stats.active },
          { icon: Users, label: "Utilisations", value: stats.totalUses },
        ].map((kpi) => (
          <NebulaCard key={kpi.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <kpi.icon className="w-4 h-4 text-cyan-soft" />
              </div>
              <div>
                <div className="text-white/40 text-xs">{kpi.label}</div>
                <div className="text-white font-semibold text-lg">{kpi.value}</div>
              </div>
            </div>
          </NebulaCard>
        ))}
      </div>

      {/* Table */}
      <NebulaCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left px-4 py-3 text-white/40 font-medium">Code</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Tag</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Utilisations</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Expiration</th>
                <th className="text-left px-4 py-3 text-white/40 font-medium">Statut</th>
                <th className="px-4 py-3 text-white/40 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {codes.map((c) => (
                <tr key={c.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-white font-medium tracking-wider text-sm">{c.code}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-white/60 text-xs border border-white/5">
                      <Tag className="w-3 h-3" />
                      {c.tag}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full bg-cyan-soft transition-all"
                          style={{ width: `${c.maxUses ? Math.min(100, (c.uses / c.maxUses) * 100) : c.uses > 0 ? 100 : 0}%` }}
                        />
                      </div>
                      <span className="text-white/60 text-xs">
                        {c.uses}{c.maxUses ? `/${c.maxUses}` : ""}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs">{formatDate(c.expiry)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border", statusConfig[c.status].classes)}>
                      {c.status === "active" && <CheckCircle className="w-3 h-3" />}
                      {c.status === "expired" && <Clock className="w-3 h-3" />}
                      {c.status === "depleted" && <ShieldAlert className="w-3 h-3" />}
                      {statusConfig[c.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleCopy(c.code, c.id)}
                      className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-cyan-soft transition-colors"
                      title="Copier le code"
                    >
                      {copiedId === c.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </NebulaCard>

      {/* Generate Modal */}
      <AnimatePresence>
        {showGenerate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowGenerate(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0e1a] p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">Générer un code</h2>
                <button onClick={() => setShowGenerate(false)} className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Code */}
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Code</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono tracking-wider focus:outline-none focus:border-cyan-soft/50 transition-colors text-sm"
                    />
                    <button
                      onClick={() => setNewCode(generateCode())}
                      className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors"
                      title="Regénérer"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Tag */}
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Tag <span className="text-white/20">(optionnel)</span></label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Ex: Promotion &Eacute;t&eacute;"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-soft/50 transition-colors text-sm"
                  />
                </div>

                {/* Max uses */}
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Utilisations max <span className="text-white/20">(vide = illimité)</span></label>
                  <input
                    type="number"
                    min="1"
                    value={newMaxUses}
                    onChange={(e) => setNewMaxUses(e.target.value)}
                    placeholder="Ex: 20"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-soft/50 transition-colors text-sm"
                  />
                </div>

                {/* Expiry */}
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Date d&apos;expiration <span className="text-white/20">(optionnelle)</span></label>
                  <input
                    type="date"
                    value={newExpiry}
                    onChange={(e) => setNewExpiry(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-soft/50 transition-colors text-sm [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => setShowGenerate(false)}
                  className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                >
                  Annuler
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-soft to-violet text-white hover:opacity-90 transition-opacity"
                >
                  Générer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
