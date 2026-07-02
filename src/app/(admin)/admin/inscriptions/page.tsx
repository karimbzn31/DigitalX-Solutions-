"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Copy, Check, Search } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { cn } from "@/lib/utils";

interface PendingProfile {
  id: string;
  name: string;
  email: string;
  initials: string;
  status: string;
  created_at: string;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "DX-";
  for (let i = 0; i < 6; i++) code += chars[Math.floor(Math.random() * chars.length)];
  return code;
}

type FilterTab = "pending" | "approved" | "rejected" | "all";

const tabs: { key: FilterTab; label: string }[] = [
  { key: "pending", label: "En attente" },
  { key: "approved", label: "Approuvées" },
  { key: "rejected", label: "Refusées" },
  { key: "all", label: "Toutes" },
];

export default function AdminInscriptionsPage() {
  const [requests, setRequests] = useState<PendingProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterTab, setFilterTab] = useState<FilterTab>("pending");
  const [search, setSearch] = useState("");
  const [approveModal, setApproveModal] = useState<{ open: boolean; request: PendingProfile | null }>({ open: false, request: null });
  const [rejectModal, setRejectModal] = useState<{ open: boolean; request: PendingProfile | null }>({ open: false, request: null });
  const [generatedCode, setGeneratedCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [rejectError, setRejectError] = useState("");
  const [approveError, setApproveError] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/pending");
      const data = await res.json();
      if (!res.ok) {
        setRequests([]);
      } else {
        setRequests(data.requests || []);
      }
    } catch {
      setRequests([]);
    }
    setLoading(false);
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleApprove = async () => {
    const req = approveModal.request;
    if (!req) return;
    const code = generateCode();
    const res = await fetch("/api/admin/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: req.id, status: "active", validationCode: code }),
    });
    const data = await res.json();
    if (!res.ok) {
      setApproveError("Erreur : " + (data.error || "inconnue"));
      return;
    }
    setGeneratedCode(code);
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
  };

  const handleReject = async () => {
    const req = rejectModal.request;
    if (!req) return;
    setRejectError("");
    const res = await fetch("/api/admin/profile?userId=" + encodeURIComponent(req.id), {
      method: "DELETE",
    });
    const data = await res.json();
    if (!res.ok) {
      setRejectError(data.error || "Erreur lors de la suppression");
      return;
    }
    setRequests((prev) => prev.filter((r) => r.id !== req.id));
    setRejectModal({ open: false, request: null });
  };

  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(generatedCode); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  };

  const filtered = requests.filter((r) => {
    if (filterTab === "pending") return r.status === "pending";
    if (filterTab === "approved") return r.status === "active";
    if (filterTab === "rejected") return r.status === "blocked";
    return true;
  }).filter((r) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return r.name?.toLowerCase().includes(q) || r.email?.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Inscriptions</h1>
        <p className="text-white/50 text-sm mt-1">{requests.filter((r) => r.status === "pending").length} en attente</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-1 bg-white/5 rounded-xl p-1 border border-white/5">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setFilterTab(t.key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                filterTab === t.key ? "bg-cyan-soft/10 text-cyan-soft" : "text-white/40 hover:text-white/60"
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-soft/50 transition-colors text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-32">
          <div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((req) => (
            <NebulaCard key={req.id} className="p-5">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-soft/20 to-violet/20 border border-white/10 flex items-center justify-center text-sm font-semibold text-white shrink-0">
                  {req.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold">{req.name}</div>
                  <div className="text-white/40 text-sm">{req.email}</div>
                  <div className="text-white/30 text-xs mt-1">{formatDate(req.created_at)}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setApproveModal({ open: true, request: req })}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-colors text-sm font-medium"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approuver
                </button>
                <button
                  onClick={() => setRejectModal({ open: true, request: req })}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose/10 text-rose hover:bg-rose/20 border border-rose/20 transition-colors text-sm font-medium"
                >
                  <XCircle className="w-4 h-4" />
                  Refuser
                </button>
              </div>
            </NebulaCard>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-12 text-white/30 text-sm">
              Aucune demande trouvée
            </div>
          )}
        </div>
      )}

      {/* Approve Modal */}
      <AnimatePresence>
        {approveModal.open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setApproveModal({ open: false, request: null })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0e1a] p-6"
            >
              {!generatedCode ? (
                <>
                  <h2 className="text-lg font-semibold text-white mb-2">Approuver l&apos;inscription</h2>
                  <p className="text-white/50 text-sm mb-4">
                    Activer le compte de <strong className="text-white">{approveModal.request?.name}</strong>
                  </p>
                  {approveError && <div className="p-3 rounded-lg bg-rose/10 border border-rose/20 text-sm text-rose mb-4">{approveError}</div>}
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setApproveModal({ open: false, request: null })}
                      className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      onClick={handleApprove}
                      className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
                    >
                      Approuver & générer un code
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-4">
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                    <h2 className="text-lg font-semibold text-white">Compte activé !</h2>
                  </div>
                  <p className="text-white/50 text-sm mb-4">Code d&apos;accès généré pour {approveModal.request?.name} :</p>
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 mb-4">
                    <code className="flex-1 font-mono text-lg text-cyan-soft font-bold tracking-wider text-center">{generatedCode}</code>
                    <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-cyan-soft transition-colors">
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <button
                    onClick={() => { setApproveModal({ open: false, request: null }); setGeneratedCode(""); }}
                    className="w-full px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-soft to-violet text-white hover:opacity-90 transition-opacity"
                  >
                    Terminé
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reject Modal */}
      <AnimatePresence>
        {rejectModal.open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setRejectModal({ open: false, request: null })}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md rounded-2xl border border-white/10 bg-[#0a0e1a] p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-rose/10 border border-rose/20">
                  <XCircle className="w-5 h-5 text-rose" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-white">Refuser l&apos;inscription</h2>
                  <p className="text-white/50 text-sm">{rejectModal.request?.name}</p>
                </div>
              </div>
              <p className="text-white/60 text-sm mb-6">L&apos;utilisateur sera supprimé définitivement.</p>
              {rejectError && <div className="p-3 rounded-lg bg-rose/10 border border-rose/20 text-sm text-rose mb-4">{rejectError}</div>}
              <div className="flex gap-3 justify-end">
                <button onClick={() => setRejectModal({ open: false, request: null })} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Annuler</button>
                <button onClick={handleReject} className="px-4 py-2 rounded-xl text-sm font-medium bg-rose text-white hover:bg-rose/80 transition-colors">Supprimer définitivement</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
