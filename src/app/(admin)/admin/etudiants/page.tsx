"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, SlidersHorizontal, ChevronDown, Eye, Ban, Trash2, X, Calendar, Clock, ShieldAlert, CheckCircle, XCircle, BookOpen, Video, Timer, ChevronLeft, ChevronRight } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { Modal } from "@/components/shared/Modal";
import { cn } from "@/lib/utils";

const PAGE_SIZE = 20;

interface StudentData {
  id: string;
  name: string;
  email: string;
  initials: string;
  status: string;
  is_admin: boolean;
  level: string;
  total_progress: number;
  time_spent: string;
  created_at: string;
  updated_at: string;
}

type SortField = "name" | "created_at" | "total_progress" | "updated_at";
type SortDir = "asc" | "desc";
type StatusFilter = "all" | "active" | "pending" | "blocked";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function formatDateShort(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 3600000) return "A l'instant";
  if (diff < 86400000) return `Il y a ${Math.floor(diff / 3600000)}h`;
  if (diff < 604800000) return `Il y a ${Math.floor(diff / 86400000)}j`;
  return formatDate(iso);
}

const statusStyles: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15",
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/15",
  blocked: "bg-rose/10 text-rose border-rose/15",
};

const statusLabels: Record<string, string> = {
  active: "Actif",
  pending: "En attente",
  blocked: "Bloqué",
};

export default function AdminEtudiantsPage() {
  const [students, setStudents] = useState<StudentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortField, setSortField] = useState<SortField>("created_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(0);

  useEffect(() => {
    fetch("/api/admin/students")
      .then((r) => r.json())
      .then((data) => { setStudents(data.students || []); setLoading(false); });
  }, []);

  const handleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) { setSortDir((d) => (d === "asc" ? "desc" : "asc")); return prev; }
      setSortDir("asc");
      return field;
    });
  }, []);

  const handleAction = async (action: string) => {
    const student = selectedStudent;
    if (!student) return;
    if (action === "delete") {
      await fetch(`/api/admin/profile?userId=${encodeURIComponent(student.id)}`, {
        method: "DELETE",
      });
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
    } else {
      const newStatus = student.status === "blocked" ? "active" : "blocked";
      const res = await fetch("/api/admin/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: student.id, status: newStatus }),
      });
      if (res.ok) {
        setStudents((prev) => prev.map((s) => (s.id === student.id ? { ...s, status: newStatus } : s)));
      }
    }
    setShowSuspendModal(false);
    setShowDeleteModal(false);
  };

  const filtered = useMemo(() => {
    let list = [...students];
    if (statusFilter !== "all") {
      const map: Record<string, string[]> = { active: ["active"], pending: ["pending"], blocked: ["blocked"] };
      list = list.filter((s) => (map[statusFilter] || []).includes(s.status));
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((s) => s.name?.toLowerCase().includes(q) || s.email?.toLowerCase().includes(q));
    }
    list.sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortField === "name") return (a.name || "").localeCompare(b.name || "") * dir;
      if (sortField === "total_progress") return ((a.total_progress || 0) - (b.total_progress || 0)) * dir;
      const aDate = new Date(a[sortField] || 0).getTime();
      const bDate = new Date(b[sortField] || 0).getTime();
      return (aDate - bDate) * dir;
    });
    return list;
  }, [students, search, statusFilter, sortField, sortDir]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = useMemo(() => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), [filtered, page]);

  // Reset to page 0 when filters change
  useEffect(() => setPage(0), [search, statusFilter, sortField, sortDir]);

  const SortIcon = ({ field }: { field: SortField }) => (
    <ChevronDown className={cn("w-3 h-3 transition-transform", sortField === field && (sortDir === "desc" ? "rotate-180" : ""), sortField !== field && "opacity-30")} />
  );

  if (loading) {
    return <div className="flex items-center justify-center h-64"><div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Étudiants</h1>
          <p className="text-white/50 text-sm mt-1">{students.length} inscrits (dont {filtered.length} filtrés)</p>
        </div>
        <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white/70 hover:text-white hover:border-cyan-soft/30 transition-colors text-sm">
          <SlidersHorizontal className="w-4 h-4" />
          Filtres
        </button>
      </div>

      {/* Filters panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <NebulaCard className="p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input type="text" placeholder="Rechercher par nom ou email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 focus:outline-none focus:border-cyan-soft/50 transition-colors text-sm" />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {(["all", "active", "pending", "blocked"] as StatusFilter[]).map((s) => (
                    <button key={s} onClick={() => setStatusFilter(s)} className={cn("px-3 py-2 rounded-lg text-xs font-medium transition-colors border", statusFilter === s ? "bg-cyan-soft/10 text-cyan-soft border-cyan-soft/30" : "bg-white/5 text-white/50 border-white/10 hover:text-white/70")}>
                      {s === "all" ? "Tous" : statusLabels[s] || s}
                    </button>
                  ))}
                </div>
              </div>
            </NebulaCard>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Table */}
      <NebulaCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                {[
                  { key: "name" as SortField, label: "Étudiant" },
                  { key: "created_at" as SortField, label: "Inscription" },
                  { key: "total_progress" as SortField, label: "Progression" },
                  { key: "updated_at" as SortField, label: "Dernière activité" },
                ].map((col) => (
                  <th key={col.key} onClick={() => handleSort(col.key)} className="text-left px-4 py-3 text-white/40 font-medium cursor-pointer hover:text-white/60 transition-colors">
                    <div className="flex items-center gap-1">{col.label} <SortIcon field={col.key} /></div>
                  </th>
                ))}
                <th className="text-left px-4 py-3 text-white/40 font-medium">Statut</th>
                <th className="px-4 py-3 text-white/40 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paged.map((student) => (
                <tr key={student.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-soft/20 to-violet/20 border border-white/10 flex items-center justify-center text-xs font-semibold text-white/70">{student.initials || "?"}</div>
                      <div>
                        <div className="text-white font-medium">{student.name || "Sans nom"}</div>
                        <div className="text-white/40 text-xs">{student.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60">{formatDate(student.created_at)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 max-w-[100px] h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div className={cn("h-full rounded-full transition-all", (student.total_progress || 0) >= 80 ? "bg-emerald-400" : (student.total_progress || 0) >= 40 ? "bg-cyan-soft" : "bg-amber-400")} style={{ width: `${student.total_progress || 0}%` }} />
                      </div>
                      <span className="text-white/60 text-xs w-8 text-right">{student.total_progress || 0}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-white/60 text-xs">{formatDateShort(student.updated_at)}</td>
                  <td className="px-4 py-3">
                    <span className={cn("inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border", statusStyles[student.status] || "bg-white/5 text-white/50")}>
                      {student.status === "active" && <CheckCircle className="w-3 h-3" />}
                      {student.status === "pending" && <Clock className="w-3 h-3" />}
                      {student.status === "blocked" && <ShieldAlert className="w-3 h-3" />}
                      {statusLabels[student.status] || student.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => { setSelectedStudent(student); setShowViewModal(true); }} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-cyan-soft transition-colors" title="Voir détails"><Eye className="w-4 h-4" /></button>
                      <button onClick={() => { setSelectedStudent(student); setShowSuspendModal(true); }} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-amber-400 transition-colors" title={student.status === "blocked" ? "Réactiver" : "Suspendre"}><Ban className="w-4 h-4" /></button>
                      <button onClick={() => { setSelectedStudent(student); setShowDeleteModal(true); }} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-rose transition-colors" title="Supprimer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/5">
            <span className="text-xs text-white/40">
              {(page * PAGE_SIZE) + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} / {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(totalPages, 7) }).map((_, i) => {
                // Show pages around current
                const start = Math.max(0, Math.min(page - 3, totalPages - 7));
                const pageNum = start + i;
                if (pageNum >= totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={cn(
                      "w-7 h-7 rounded-lg text-xs transition-colors",
                      pageNum === page ? "bg-violet text-white" : "text-white/40 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {pageNum + 1}
                  </button>
                );
              })}
              <button
                onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-lg hover:bg-white/5 text-white/40 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {filtered.length === 0 && <div className="text-center py-12 text-white/30 text-sm">Aucun étudiant trouvé</div>}
      </NebulaCard>

      {/* View Modal */}
      {selectedStudent && (
        <Modal open={showViewModal} onClose={() => setShowViewModal(false)} title="Détails étudiant" subtitle={selectedStudent.email}>
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/5">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-cyan-soft/20 to-violet/20 border border-white/10 flex items-center justify-center text-lg font-semibold text-white">{selectedStudent.initials || "?"}</div>
            <div><div className="text-white font-semibold text-lg">{selectedStudent.name || "Sans nom"}</div><div className="text-white/50 text-sm">{selectedStudent.email}</div></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Calendar, label: "Inscrit le", value: formatDate(selectedStudent.created_at) },
              { icon: BookOpen, label: "Niveau", value: selectedStudent.level || "N/A" },
              { icon: Video, label: "Progression", value: `${selectedStudent.total_progress || 0}%` },
              { icon: Timer, label: "Temps passé", value: selectedStudent.time_spent || "0h" },
              { icon: Clock, label: "Dernière activité", value: formatDateShort(selectedStudent.updated_at) },
              { icon: selectedStudent.is_admin ? CheckCircle : XCircle, label: "Admin", value: selectedStudent.is_admin ? "Oui" : "Non", iconColor: selectedStudent.is_admin ? "text-emerald-400" : "text-white/40" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center gap-2 text-white/40 text-xs mb-1"><item.icon className={cn("w-3.5 h-3.5", (item as typeof item & { iconColor?: string }).iconColor)} />{item.label}</div>
                <div className="text-white text-sm font-medium">{item.value}</div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Suspend Modal */}
      {selectedStudent && (
        <Modal
          open={showSuspendModal}
          onClose={() => setShowSuspendModal(false)}
          title={selectedStudent.status === "blocked" ? "Réactiver l'étudiant" : "Suspendre l'étudiant"}
          subtitle={selectedStudent.name}
          icon={<Ban className="w-5 h-5 text-amber-400" />}
          iconBg="bg-amber-500/10 border-amber-500/20"
          footer={
            <>
              <button onClick={() => setShowSuspendModal(false)} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Annuler</button>
              <button onClick={() => handleAction("toggle")} className={cn("px-4 py-2 rounded-xl text-sm font-medium transition-colors", selectedStudent.status === "blocked" ? "bg-emerald-500 text-white hover:bg-emerald-600" : "bg-amber-500 text-white hover:bg-amber-600")}>{selectedStudent.status === "blocked" ? "Réactiver" : "Suspendre"}</button>
            </>
          }
        >
          <p className="text-white/60 text-sm">
            {selectedStudent.status === "blocked"
              ? "L'étudiant aura de nouveau accès à la plateforme."
              : "L'étudiant perdra l'accès à la plateforme."}
          </p>
        </Modal>
      )}

      {/* Delete Modal */}
      {selectedStudent && (
        <Modal
          open={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          title="Supprimer l'étudiant"
          subtitle={selectedStudent.name}
          icon={<Trash2 className="w-5 h-5 text-rose" />}
          iconBg="bg-rose/10 border-rose/20"
          footer={
            <>
              <button onClick={() => setShowDeleteModal(false)} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10 transition-colors">Annuler</button>
              <button onClick={() => handleAction("delete")} className="px-4 py-2 rounded-xl text-sm font-medium bg-rose text-white hover:bg-rose/80 transition-colors">Supprimer définitivement</button>
            </>
          }
        >
          <p className="text-white/60 text-sm">Cette action est irréversible. Toutes les données de <strong className="text-white">{selectedStudent.name}</strong> seront définitivement supprimées.</p>
        </Modal>
      )}
    </div>
  );
}
