"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, FileText, Code, MessageSquare, Link as LinkIcon, Archive, Edit3, Trash2 } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { cn } from "@/lib/utils";

interface Module { id: string; title: string; }
interface Resource {
  id: string; module_id: string; type: string; title: string;
  description: string; url: string; content: string;
}

const resourceTypes = [
  { value: "pdf", label: "PDF", icon: FileText, color: "text-rose" },
  { value: "code", label: "Code", icon: Code, color: "text-emerald-400" },
  { value: "prompt", label: "Master Prompt", icon: MessageSquare, color: "text-violet" },
  { value: "link", label: "Lien", icon: LinkIcon, color: "text-cyan-soft" },
  { value: "zip", label: "Projet ZIP", icon: Archive, color: "text-amber-400" },
];

export default function AdminRessourcesPage() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Resource | null>(null);
  const [selectedModule] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [form, setForm] = useState({ module_id: "", type: "pdf", title: "", description: "", url: "", content: "" });

  const load = async () => {
    const [rRes, mRes] = await Promise.all([fetch("/api/admin/resources"), fetch("/api/admin/modules")]);
    setResources((await rRes.json()).resources || []);
    setModules((await mRes.json()).modules || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ module_id: selectedModule, type: selectedType || "pdf", title: "", description: "", url: "", content: "" });
    setShowModal(true);
  };

  const openEdit = (r: Resource) => {
    setEditing(r);
    setForm({ module_id: r.module_id, type: r.type, title: r.title, description: r.description || "", url: r.url || "", content: r.content || "" });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.module_id || !form.type) return;
    const url = editing ? `/api/admin/resources/${editing.id}` : "/api/admin/resources";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setShowModal(false); load(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette ressource ?")) return;
    await fetch(`/api/admin/resources/${id}`, { method: "DELETE" });
    load();
  };

  const filtered = resources.filter(r => {
    if (selectedModule && r.module_id !== selectedModule) return false;
    if (selectedType && r.type !== selectedType) return false;
    return true;
  });

  const getTypeInfo = (type: string) => resourceTypes.find(t => t.value === type) || resourceTypes[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Ressources</h1>
          <p className="text-white/50 text-sm mt-1">{resources.length} ressources · {modules.length} modules</p>
        </div>
        <button onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-soft to-violet text-white font-medium text-sm hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Ajouter une ressource
        </button>
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setSelectedType("")}
          className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
            !selectedType ? "bg-cyan-soft/10 text-cyan-soft border-cyan-soft/20" : "text-white/40 border-white/10 hover:text-white/60")}>
          Toutes
        </button>
        {resourceTypes.map(t => (
          <button key={t.value} onClick={() => setSelectedType(t.value)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border",
              selectedType === t.value ? "bg-cyan-soft/10 text-cyan-soft border-cyan-soft/20" : "text-white/40 border-white/10 hover:text-white/60")}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((r) => {
            const ti = getTypeInfo(r.type);
            const mod = modules.find(m => m.id === r.module_id);
            return (
              <NebulaCard key={r.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className={cn("w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0", ti.color)}>
                    <ti.icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white font-medium truncate">{r.title}</span>
                      <span className={cn("text-[10px] px-2 py-0.5 rounded-full border shrink-0", ti.color, "bg-white/5 border-white/10")}>
                        {ti.label}
                      </span>
                    </div>
                    {r.description && <div className="text-white/40 text-xs mt-1 line-clamp-2">{r.description}</div>}
                    <div className="flex items-center gap-2 mt-2">
                      {mod && <span className="text-[11px] text-white/30">{mod.title}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => openEdit(r)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-cyan-soft">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(r.id)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-rose">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </NebulaCard>
            );
          })}
          {filtered.length === 0 && <div className="col-span-2 text-center py-12 text-white/30 text-sm">Aucune ressource</div>}
        </div>
      )}

      <AnimatePresence>{showModal && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setShowModal(false)}>
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            onClick={e => e.stopPropagation()}
            className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#0a0e1a] p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">{editing ? "Modifier" : "Ajouter"} une ressource</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Module</label>
                  <select value={form.module_id} onChange={e => setForm({ ...form, module_id: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                    <option value="">Sélectionner</option>
                    {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Type</label>
                  <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                    {resourceTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-1.5">Titre</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm resize-none" />
              </div>
              {form.type === "prompt" ? (
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Contenu du prompt</label>
                  <textarea value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} rows={6}
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm resize-none font-mono text-xs" />
                </div>
              ) : (
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">
                    {form.type === "link" ? "URL" : "URL ou lien du fichier"}
                  </label>
                  <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
                </div>
              )}
            </div>
            <div className="flex gap-3 justify-end mt-6 pt-4 border-t border-white/5">
              <button onClick={() => setShowModal(false)} className="px-4 py-2 rounded-xl text-sm text-white/60 hover:text-white bg-white/5 hover:bg-white/10">Annuler</button>
              <button onClick={handleSave} className="px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-cyan-soft to-violet text-white hover:opacity-90">
                {editing ? "Modifier" : "Ajouter"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}
