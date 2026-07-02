"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Copy, Check, X, Hash, Users, Tag, Clock, ShieldAlert, CheckCircle, RefreshCw } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { cn } from "@/lib/utils";

interface AccessCode {
  id: string;
  code: string;
  tag: string;
  uses: number;
  max_uses: number | null;
  expiry: string | null;
  status: string;
}

function formatDate(iso: string | null): string {
  if (!iso) return "\u2014";
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return "DX-" + Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}

const statusConfig: Record<string, { label: string; classes: string }> = {
  active: { label: "Actif", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15" },
  expired: { label: "Expir\u00e9", classes: "bg-rose/10 text-rose border-rose/15" },
  depleted: { label: "\u00c9puis\u00e9", classes: "bg-amber-500/10 text-amber-400 border-amber-500/15" },
};

export default function AdminCodesPage() {
  const [codes, setCodes] = useState<AccessCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerate, setShowGenerate] = useState(false);
  const [newCode, setNewCode] = useState(generateCode());
  const [newTag, setNewTag] = useState("");
  const [newMaxUses, setNewMaxUses] = useState("");
  const [newExpiry, setNewExpiry] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/access-codes")
      .then((r) => r.json())
      .then((data) => { setCodes(data.codes || []); setLoading(false); });
  }, []);

  const handleCopy = async (code: string, id: string) => {
    try { await navigator.clipboard.writeText(code); setCopiedId(id); setTimeout(() => setCopiedId(null), 2000); } catch {}
  };

  const handleGenerate = async () => {
    const res = await fetch("/api/admin/access-codes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: newCode, tag: newTag, maxUses: newMaxUses, expiry: newExpiry }),
    });
    if (res.ok) {
      const data = await res.json();
      setCodes((prev) => [data.code, ...prev]);
      setShowGenerate(false);
      setNewCode(generateCode());
      setNewTag("");
      setNewMaxUses("");
      setNewExpiry("");
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" /></div>;
  }

  const stats = {
    total: codes.length,
    active: codes.filter((c) => c.status === "active").length,
    totalUses: codes.reduce((a, c) => a + (c.uses || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div><h1 className="text-2xl font-bold text-white">Codes d&apos;acc&egrave;s</h1><p className="text-white/50 text-sm mt-1">{stats.active} codes actifs &middot; {stats.totalUses} utilisations</p></div>
        <button onClick={() => setShowGenerate(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-soft to-violet text-white font-medium text-sm hover:opacity-90 transition-opacity"><Plus className="w-4 h-4" /> G&eacute;n&eacute;rer un code</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {[{ icon: Hash, label: "Total codes", value: stats.total }, { icon: CheckCircle, label: "Codes actifs", value: stats.active }, { icon: Users, label: "Utilisations", value: stats.totalUses }].map((kpi) => (
          <NebulaCard key={kpi.label} className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5"><kpi.icon className="w-4 h-4 text-cyan-soft" /></div>
              <div><div className="text-white/40 text-xs">{kpi.label}</div><div className="text-white font-semibold text-lg">{kpi.value}</div></div>
            </div>
          </NebulaCard>
        ))}
      </div>

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
                  <td className="px-4 py-3"><span className="font-mono text-white font-medium tracking-wider text-sm">{c.code}</span></td>
                  <td className="px-4 py-3"><span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 text-white/60 text-xs border border-white/5"><Tag className="w-3 h-3" />{c.tag || "Sans tag"}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[80px] h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className="h-full rounded-full bg-cyan-soft transition-all" style={{ width: `${c.max_uses ? Math.min(100, (c.uses / c.max_uses) * 100) : c.uses > 0 ? 100 : 0}%` }} />
                      </div>
                      <span className="text-white/60 text-xs">{c.uses}{c.max_uses ? `/${c.max_uses}` : ""}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs">{formatDate(c.expiry)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border", (statusConfig[c.status] || statusConfig.active).classes)}>
                      {(c.status === "active" || !c.status) && <CheckCircle className="w-3 h-3" />}
                      {c.status === "expired" && <Clock className="w-3 h-3" />}
                      {c.status === "depleted" && <ShieldAlert className="w-3 h-3" />}
                      {(statusConfig[c.status] || statusConfig.active).label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleCopy(c.code, c.id)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-cyan-soft transition-colors">
                      {copiedId === c.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {codes.length === 0 && <div className="text-center py-12 text-white/30 text-sm">Aucun code d&apos;acc&egrave;s</div>}
      </NebulaCard>

      <AnimatePresence>{showGenerate && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowGenerate(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} onClick={(e) => e.stopPropagation()} className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0e1a] p-6">
            <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-semibold text-white">G&eacute;n&eacute;rer un code</h2><button onClick={() => setShowGenerate(false)} className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white transition-colors"><X className="w-5 h-5" /></button></div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs mb-1.5">Code</label>
                <div className="flex gap-2">
                  <input type="text" value={newCode} onChange={(e) => setNewCode(e.target.value)} className="flex-1 px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono tracking-wider focus:outline-none focus:border-cyan-soft/50 transition-colors text-sm" />
                  <button onClick={() => setNewCode(generateCode())} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors"><RefreshCw className="w-4 h-4" /></button>
                </div>
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-1.5">Tag <span className="text-white/20">(optionnel)</span></label>
                <input type="text" value={newTag} onChange={(e) => setNewTag(e.target.value)} placeholder="Ex: Promotion" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-soft/50 transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-1.5">Utilisations max <span className="text-white/20">(vide = illimit&eacute;)</span></label>
                <input type="number" min="1" value={newMaxUses} onChange={(e) => setNewMaxUses(e.target.value)} placeholder="Ex: 50" className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-soft/50 transition-colors text-sm" />
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-1.5">Date d&apos;expiration <span className="text-white/20">(optionnelle)</span></label>
                <input type="date" value={newExpiry} onChange={(e) => setNewExpiry(e.target.value)} className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-soft/50 transition-colors text-sm [color-scheme:dark]" />
              </div>
            </div>
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/5">
              <button onClick={() => setShowGenerate(false)} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Annuler</button>
              <button onClick={handleGenerate} className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-soft to-violet text-white hover:opacity-90 transition-opacity">G&eacute;n&eacute;rer</button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
