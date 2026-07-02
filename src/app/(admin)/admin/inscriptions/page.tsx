"use client";

import { useState, useCallback, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, Copy, Mail, Search, X } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { cn } from "@/lib/utils";
import { PENDING_REQUESTS, type PendingRequest } from "@/lib/mock-admin";

type FilterTab = "pending" | "approved" | "rejected" | "all";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 10; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

const tabs: { key: FilterTab; label: string }[] = [
  { key: "pending", label: "En attente" },
  { key: "approved", label: "Approuvées" },
  { key: "rejected", label: "Refusées" },
  { key: "all", label: "Toutes" },
];

export default function AdminInscriptionsPage() {
  const [filterTab, setFilterTab] = useState<FilterTab>("pending");
  const [requests, setRequests] = useState<PendingRequest[]>(PENDING_REQUESTS);
  const [approveModal, setApproveModal] = useState<{ open: boolean; request: PendingRequest | null }>({
    open: false,
    request: null,
  });
  const [rejectModal, setRejectModal] = useState<{ open: boolean; request: PendingRequest | null }>({
    open: false,
    request: null,
  });
  const [rejectReason, setRejectReason] = useState("");
  const [successView, setSuccessView] = useState<{ show: boolean; code: string; name: string }>({
    show: false,
    code: "",
    name: "",
  });
  const [copied, setCopied] = useState(false);

  const filtered = requests.filter((r) => (filterTab === "all" ? true : r.status === filterTab));

  const statusCounts = {
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };

  const handleApprove = useCallback(() => {
    const code = generateAccessCode();
    setSuccessView({ show: true, code, name: approveModal.request?.name ?? "" });
    setRequests((prev) =>
      prev.map((r) => (r.id === approveModal.request?.id ? { ...r, status: "approved" as const } : r))
    );
    setCopied(false);
  }, [approveModal.request]);

  const handleReject = useCallback(() => {
    if (!rejectModal.request) return;
    setRequests((prev) =>
      prev.map((r) => (r.id === rejectModal.request?.id ? { ...r, status: "rejected" as const } : r))
    );
    setRejectModal({ open: false, request: null });
    setRejectReason("");
  }, [rejectModal.request]);

  const handleHold = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "pending" as const } : r))
    );
  }, []);

  const handleCopyCode = useCallback(async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, []);

  const closeApproveModal = useCallback(() => {
    setApproveModal({ open: false, request: null });
    setSuccessView({ show: false, code: "", name: "" });
    setCopied(false);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl font-bold text-star-white tracking-tight">Demandes d&apos;inscription</h1>
        <p className="text-sm text-mist mt-1">Gérez les demandes d&apos;accès à la plateforme</p>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border",
              filterTab === tab.key
                ? "bg-violet/20 text-violet border-violet/25 shadow-[0_0_20px_-8px_rgba(124,92,255,0.3)]"
                : "bg-transparent text-mist border-white/5 hover:text-star-white hover:border-white/10"
            )}
          >
            {tab.label}
            {tab.key !== "all" && (
              <span className="ml-1.5 text-xs opacity-60">({statusCounts[tab.key]})</span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <NebulaCard className="p-8 !bg-surface/70">
            <div className="flex flex-col items-center justify-center text-center py-8">
              <div className="w-14 h-14 rounded-2xl bg-violet/5 flex items-center justify-center mb-4">
                <Search className="w-6 h-6 text-mist" />
              </div>
              <p className="text-sm text-mist">Aucune demande {filterTab !== "all" ? filterTab : ""}</p>
            </div>
          </NebulaCard>
        ) : (
          filtered.map((req) => (
            <NebulaCard key={req.id} className="p-5 !bg-surface/70">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-[0_0_20px_-4px_rgba(124,92,255,0.3)]">
                  {req.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="min-w-0">
                      <h3 className="text-sm font-semibold text-star-white">{req.name}</h3>
                      <p className="text-xs text-mist">{req.email}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {req.status === "pending" && (
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/15">
                          En attente
                        </span>
                      )}
                      {req.status === "approved" && (
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/15">
                          Approuvé
                        </span>
                      )}
                      {req.status === "rejected" && (
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-rose/10 text-rose border border-rose/15">
                          Refusé
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2 text-xs text-mist">
                    <span>📅 {formatDate(req.createdAt)}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span>🎯 {req.plan}</span>
                  </div>
                  {req.message && (
                    <p className="mt-2 text-xs text-mist italic bg-void/30 rounded-lg p-3 border border-white/[0.04]">
                      &ldquo;{req.message}&rdquo;
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5">
                    {req.status === "pending" && (
                      <>
                        <button
                          onClick={() => setApproveModal({ open: true, request: req })}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-xs font-medium hover:bg-emerald-500/20 transition-all"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          Approuver
                        </button>
                        <button
                          onClick={() => {
                            setRejectReason("");
                            setRejectModal({ open: true, request: req });
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose/10 text-rose text-xs font-medium hover:bg-rose/20 transition-all"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          Refuser
                        </button>
                      </>
                    )}
                    {req.status !== "pending" && (
                      <button
                        onClick={() => handleHold(req.id)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-violet/10 text-violet text-xs font-medium hover:bg-violet/20 transition-all"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        Mettre en attente
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </NebulaCard>
          ))
        )}
      </div>

      <AnimatePresence>
        {approveModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget && !successView.show) closeApproveModal(); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md"
            >
              <NebulaCard className="p-6 !bg-surface border border-white/10 shadow-nebula" hover={false}>
                {!successView.show ? (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-lg font-semibold text-star-white">
                        Approuver l&apos;inscription
                      </h2>
                      <button
                        onClick={closeApproveModal}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-mist hover:text-star-white hover:bg-white/5 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-violet/5 border border-violet/10">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-sm font-bold text-white shrink-0">
                        {approveModal.request?.initials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-star-white">{approveModal.request?.name}</p>
                        <p className="text-xs text-mist">{approveModal.request?.email}</p>
                      </div>
                    </div>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                          <CheckCircle className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                          <p className="text-xs text-star-white font-medium">Accès à :</p>
                          <p className="text-xs text-mist">● Toute la formation</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-violet/5 border border-violet/10">
                        <div className="w-8 h-8 rounded-lg bg-violet/10 flex items-center justify-center">
                          <Mail className="w-4 h-4 text-violet" />
                        </div>
                        <div>
                          <p className="text-xs text-star-white font-medium">Code d&apos;accès unique</p>
                          <p className="text-xs text-mist">Un code sera généré et envoyé à l&apos;utilisateur</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-end gap-3">
                      <button
                        onClick={closeApproveModal}
                        className="px-4 py-2 rounded-lg text-sm text-mist hover:text-star-white hover:bg-white/5 transition-all"
                      >
                        ANNULER
                      </button>
                      <button
                        onClick={handleApprove}
                        className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-medium hover:from-emerald-400 hover:to-emerald-500 transition-all shadow-lg shadow-emerald-500/20"
                      >
                        ✓ APPROUVER & ENVOYER
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-center py-2">
                      <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center mx-auto mb-4">
                        <CheckCircle className="w-8 h-8 text-emerald-400" />
                      </div>
                      <h2 className="font-display text-lg font-semibold text-star-white mb-1">
                        Inscription approuvée ✓
                      </h2>
                      <p className="text-sm text-mist mb-5">
                        Code d&apos;accès pour <span className="text-star-white font-medium">{successView.name}</span>
                      </p>
                      <div className="bg-void rounded-xl border border-white/5 p-4 mb-5">
                        <p className="font-mono text-2xl font-bold tracking-[0.25em] text-violet select-all">
                          {successView.code}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopyCode(successView.code)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-violet/10 text-violet text-sm font-medium hover:bg-violet/20 transition-all mb-5"
                      >
                        <Copy className="w-4 h-4" />
                        {copied ? "Copié !" : "Copier le code"}
                      </button>
                      <p className="text-[11px] text-mist">Fermeture automatique dans 3 secondes...</p>
                    </div>
                    <AutoClose onClose={closeApproveModal} delay={3000} />
                  </>
                )}
              </NebulaCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {rejectModal.open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-void/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) { setRejectModal({ open: false, request: null }); setRejectReason(""); } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md"
            >
              <NebulaCard className="p-6 !bg-surface border border-white/10 shadow-nebula" hover={false}>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-display text-lg font-semibold text-star-white">
                    Refuser l&apos;inscription
                  </h2>
                  <button
                    onClick={() => { setRejectModal({ open: false, request: null }); setRejectReason(""); }}
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-mist hover:text-star-white hover:bg-white/5 transition-all"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center gap-3 mb-5 p-3 rounded-xl bg-rose/5 border border-rose/10">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet to-magenta flex items-center justify-center text-sm font-bold text-white shrink-0">
                    {rejectModal.request?.initials}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-star-white">{rejectModal.request?.name}</p>
                    <p className="text-xs text-mist">{rejectModal.request?.email}</p>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="block text-xs text-mist font-medium mb-2">Raison (optionnelle)</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Expliquez pourquoi cette demande est refusée..."
                    rows={3}
                    className="w-full bg-void rounded-xl border border-white/5 p-3 text-sm text-star-white placeholder:text-mist/50 resize-none focus:outline-none focus:border-rose/30 focus:ring-1 focus:ring-rose/20 transition-all"
                  />
                </div>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => { setRejectModal({ open: false, request: null }); setRejectReason(""); }}
                    className="px-4 py-2 rounded-lg text-sm text-mist hover:text-star-white hover:bg-white/5 transition-all"
                  >
                    ANNULER
                  </button>
                  <button
                    onClick={handleReject}
                    className="px-5 py-2 rounded-lg bg-gradient-to-r from-rose to-rose/80 text-white text-sm font-medium hover:from-rose/90 hover:to-rose/70 transition-all shadow-lg shadow-rose/20"
                  >
                    REFUSER
                  </button>
                </div>
              </NebulaCard>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function AutoClose({ onClose, delay }: { onClose: () => void; delay: number }) {
  useEffect(() => {
    const timer = setTimeout(onClose, delay);
    return () => clearTimeout(timer);
  }, [onClose, delay]);

  return null;
}
