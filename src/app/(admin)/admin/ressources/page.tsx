"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, FileText, Code, File as FileIcon, GitBranch, FolderOpen, Edit3, Trash2, Upload, Download, Check } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { cn } from "@/lib/utils";

interface Module { id: string; title: string; }
interface Resource {
  id: string; module_id: string; type: string; title: string;
  description: string; url: string; content: string; file_url: string; file_size: number;
}

const resourceTypes = [
  { value: "pdf", label: "PDF", icon: FileIcon, color: "text-rose" },
  { value: "code", label: "Code", icon: Code, color: "text-emerald-400" },
  { value: "prompt", label: "Master Prompt", icon: FileText, color: "text-violet" },
  { value: "file", label: "Fichier", icon: FolderOpen, color: "text-cyan-soft" },
  { value: "github", label: "GitHub", icon: GitBranch, color: "text-orange-400" },
] as const;

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function AdminRessourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [selectedModule, setSelectedModule] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    module_id: "", type: "pdf", title: "", description: "",
    url: "", content: "", file_url: "", file_size: 0,
  });

  const load = async () => {
    const [rRes, mRes] = await Promise.all([
      fetch("/api/admin/resources"),
      fetch("/api/admin/modules"),
    ]);
    setResources((await rRes.json()).resources || []);
    setModules((await mRes.json()).modules || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({
      module_id: selectedModule, type: selectedType || "pdf",
      title: "", description: "", url: "", content: "", file_url: "", file_size: 0,
    });
    setShowModal(true);
  };

  const openEdit = (r: Resource) => {
    setEditing(r);
    setForm({
      module_id: r.module_id, type: r.type, title: r.title,
      description: r.description || "", url: r.url || "",
      content: r.content || "", file_url: r.file_url || "", file_size: r.file_size || 0,
    });
    setShowModal(true);
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({
          ...prev,
          file_url: data.url,
          file_size: data.fileSize,
          title: prev.title || data.fileName.replace(/\.[^/.]+$/, ""),
        }));
      } else {
        alert(data.error || "Erreur lors de l'upload");
      }
    } catch {
      alert("Erreur lors de l'upload");
    }
    setUploading(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.type) {
      alert("Titre et type sont requis");
      return;
    }

    // Pour les types qui nécessitent soit un fichier, soit une URL, soit du contenu
    if (form.type === "file" && !form.file_url && !form.url) {
      alert("Veuillez uploader un fichier ou ajouter une URL");
      return;
    }
    if (form.type === "github" && !form.url) {
      alert("Veuillez ajouter l'URL GitHub");
      return;
    }
    if (form.type === "prompt" && !form.content && !form.file_url) {
      alert("Veuillez ajouter le contenu du prompt ou uploader un fichier");
      return;
    }

    // Convertir module_id vide en null (évite l'erreur UUID)
    const payload = { ...form, module_id: form.module_id || null };

    const url = editing ? `/api/admin/resources/${editing.id}` : "/api/admin/resources";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setShowModal(false);
      load();
    } else {
      const data = await res.json();
      alert(data.error || "Erreur lors de l'enregistrement");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette ressource ?")) return;
    await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = resources.filter((r) => {
    if (selectedModule && r.module_id !== selectedModule) return false;
    if (selectedType && r.type !== selectedType) return false;
    return true;
  });

  const getTypeInfo = (type: string) =>
    resourceTypes.find((t) => t.value === type) || resourceTypes[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ressources</h1>
          <p className="text-white/50 text-sm mt-1">
            {resources.length} ressources · {modules.length} modules
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-soft to-violet text-white font-medium text-sm hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" /> Ajouter une ressource
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedType("")}
          className={cn(
            "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
            !selectedType
              ? "bg-cyan-soft/10 text-cyan-soft border-cyan-soft/20"
              : "text-white/40 border-white/10 hover:text-white/60"
          )}
        >
          Toutes
        </button>
        {resourceTypes.map((t) => (
          <button
            key={t.value}
            onClick={() => setSelectedType(t.value)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
              selectedType === t.value
                ? "bg-cyan-soft/10 text-cyan-soft border-cyan-soft/20"
                : "text-white/40 border-white/10 hover:text-white/60"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Liste des ressources */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => {
            const ti = getTypeInfo(r.type);
            const mod = modules.find((m) => m.id === r.module_id);
            const Icon = ti.icon;
            return (
              <NebulaCard key={r.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0",
                      ti.color
                    )}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium truncate">{r.title}</span>
                      <span
                        className={cn(
                          "text-[10px] px-2 py-0.5 rounded-full border shrink-0",
                          ti.color,
                          "bg-white/5 border-white/10"
                        )}
                      >
                        {ti.label}
                      </span>
                    </div>
                    {r.description && (
                      <div className="text-white/40 text-xs mt-1 line-clamp-2">
                        {r.description}
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {mod && <span className="text-[11px] text-white/30">{mod.title}</span>}
                      {r.file_url && (
                        <span className="text-[10px] text-cyan-soft/60">
                          📎 {formatFileSize(r.file_size)}
                        </span>
                      )}
                      {r.url && r.type === "github" && (
                        <span className="text-[10px] text-orange-400/60">🐙 GitHub</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEdit(r)}
                      className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-cyan-soft"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(r.id)}
                      className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-rose"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </NebulaCard>
            );
          })}
          {filtered.length === 0 && (
            <div className="col-span-2 text-center py-12 text-white/30 text-sm">
              Aucune ressource
            </div>
          )}
        </div>
      )}

      {/* Modal Ajout/Modification */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0e1a] p-6 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-white">
                  {editing ? "Modifier" : "Ajouter"} une ressource
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Module + Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5">Module</label>
                    <select
                      value={form.module_id}
                      onChange={(e) => setForm({ ...form, module_id: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                    >
                      <option value="">Sélectionner</option>
                      {modules.map((m) => (
                        <option key={m.id} value={m.id}>
                          {m.title}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => {
                        setForm({
                          ...form,
                          type: e.target.value,
                          url: "",
                          content: "",
                          file_url: "",
                          file_size: 0,
                        });
                      }}
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                    >
                      {resourceTypes.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Titre */}
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Titre</label>
                  <input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                    placeholder="Titre de la ressource"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm resize-none"
                    placeholder="Courte description..."
                  />
                </div>

                {/* Upload de fichier */}
                {(form.type === "file" || form.type === "pdf" || form.type === "code") && (
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5">
                      Uploader un fichier
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        onChange={handleUpload}
                        disabled={uploading}
                        accept={
                          form.type === "pdf"
                            ? ".pdf"
                            : form.type === "code"
                            ? ".js,.ts,.tsx,.py,.html,.css,.json,.yaml,.yml,.md,.sql"
                            : undefined
                        }
                        className="w-full px-3 py-8 rounded-xl bg-white/5 border border-dashed border-white/10 text-white/60 text-xs text-center cursor-pointer hover:border-cyan-soft/30 transition-colors file:hidden"
                        style={{
                          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.2)' stroke-width='2'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/%3E%3Cpolyline points='17 8 12 3 7 8'/%3E%3Cline x1='12' y1='3' x2='12' y2='15'/%3E%3C/svg%3E")`,
                          backgroundRepeat: "no-repeat",
                          backgroundPosition: "center 20px",
                          backgroundSize: "24px",
                        }}
                        onClick={(e) => {
                          // Réinitialiser pour permettre le re-upload
                          (e.target as HTMLInputElement).value = "";
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <span className="text-xs text-white/40 mt-8">
                          {uploading
                            ? "Upload en cours..."
                            : "Cliquez pour sélectionner un fichier"}
                        </span>
                      </div>
                    </div>

                    {/* Fichier uploadé */}
                    {form.file_url && (
                      <div className="mt-2 flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-soft/10 border border-cyan-soft/20 text-xs">
                        <Check className="w-3.5 h-3.5 text-cyan-soft" />
                        <span className="text-white/70 flex-1 truncate">
                          Fichier uploadé
                        </span>
                        {form.file_size > 0 && (
                          <span className="text-white/40">
                            {formatFileSize(form.file_size)}
                          </span>
                        )}
                        <button
                          onClick={() =>
                            setForm({ ...form, file_url: "", file_size: 0 })
                          }
                          className="text-rose/60 hover:text-rose ml-1"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Contenu du prompt */}
                {form.type === "prompt" && (
                  <>
                    <div>
                      <label className="block text-white/50 text-xs mb-1.5">
                        Uploader un fichier prompt
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          onChange={handleUpload}
                          disabled={uploading}
                          accept=".md,.txt"
                          className="w-full px-3 py-6 rounded-xl bg-white/5 border border-dashed border-white/10 text-white/60 text-xs text-center cursor-pointer hover:border-cyan-soft/30 transition-colors file:hidden"
                          style={{
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='rgba(255,255,255,0.2)' stroke-width='2'%3E%3Cpath d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4'/%3E%3Cpolyline points='17 8 12 3 7 8'/%3E%3Cline x1='12' y1='3' x2='12' y2='15'/%3E%3C/svg%3E")`,
                            backgroundRepeat: "no-repeat",
                            backgroundPosition: "center 12px",
                            backgroundSize: "20px",
                          }}
                          onClick={(e) => {
                            (e.target as HTMLInputElement).value = "";
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <span className="text-xs text-white/40 mt-6">
                            ou uploader un fichier .md ou .txt
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-white/50 text-xs mb-1.5">
                        Ou écrire le contenu du prompt
                      </label>
                      <textarea
                        value={form.content}
                        onChange={(e) => setForm({ ...form, content: e.target.value })}
                        rows={6}
                        className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm resize-none font-mono text-xs"
                        placeholder="Collez le contenu du prompt ici..."
                      />
                    </div>
                  </>
                )}

                {/* URL (GitHub ou autre) */}
                {(form.type === "github" || form.type === "file") && !form.file_url && (
                  <div>
                    <label className="block text-white/50 text-xs mb-1.5">
                      {form.type === "github" ? "URL GitHub" : "URL (alternative)"}
                    </label>
                    <input
                      value={form.url}
                      onChange={(e) => setForm({ ...form, url: e.target.value })}
                      placeholder={
                        form.type === "github"
                          ? "https://github.com/..."
                          : "https://..."
                      }
                      className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/5">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10"
                >
                  Annuler
                </button>
                <button
                  onClick={handleSave}
                  disabled={uploading}
                  className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-soft to-violet text-white hover:opacity-90 disabled:opacity-50"
                >
                  {uploading ? "Upload..." : editing ? "Modifier" : "Ajouter"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
