"use client";
import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, X, Video, Film, Edit3, Trash2 } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";

interface Module {
  id: string; title: string;
}

interface Video {
  id: string; module_id: string; title: string; description: string;
  url: string; duration: string; order_index: number;
}

export default function AdminVideosPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Video | null>(null);
  const [selectedModule, setSelectedModule] = useState("");
  const [form, setForm] = useState({ module_id: "", title: "", description: "", url: "", duration: "", order_index: 0 });

  const load = async () => {
    const [vRes, mRes] = await Promise.all([
      fetch("/api/admin/videos"),
      fetch("/api/admin/modules"),
    ]);
    const vData = await vRes.json();
    const mData = await mRes.json();
    setVideos(vData.videos || []);
    setModules(mData.modules || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ module_id: selectedModule, title: "", description: "", url: "", duration: "", order_index: videos.length });
    setShowModal(true);
  };

  const openEdit = (v: Video) => {
    setEditing(v);
    setForm({ module_id: v.module_id, title: v.title, description: v.description || "", url: v.url, duration: v.duration, order_index: v.order_index });
    setShowModal(true);
  };

  const handleSave = async () => {
    if (!form.title || !form.module_id) return;
    const url = editing ? `/api/admin/videos/${editing.id}` : "/api/admin/videos";
    const method = editing ? "PATCH" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) { setShowModal(false); load(); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer cette vidéo ?")) return;
    const res = await fetch(`/api/admin/videos/${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  const filtered = selectedModule ? videos.filter(v => v.module_id === selectedModule) : videos;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Vidéos</h1>
          <p className="text-white/50 text-sm mt-1">{videos.length} vidéos · {modules.length} modules</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedModule} onChange={e => setSelectedModule(e.target.value)}
            className="px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
            <option value="">Tous les modules</option>
            {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
          </select>
          <button onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-soft to-violet text-white font-medium text-sm hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Ajouter une vidéo
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((v) => {
            const mod = modules.find(m => m.id === v.module_id);
            return (
              <NebulaCard key={v.id} className="p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-violet/10 border border-violet/20 flex items-center justify-center">
                  <Film className="w-5 h-5 text-violet" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white font-medium truncate">{v.title}</div>
                  <div className="text-white/40 text-xs flex items-center gap-2 mt-0.5">
                    <span>{v.duration}</span>
                    {mod && <><span>·</span><span>{mod.title}</span></>}
                  </div>
                </div>
                <button onClick={() => openEdit(v)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-cyan-soft transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button onClick={() => handleDelete(v.id)} className="p-2 rounded-lg hover:bg-white/5 text-white/40 hover:text-rose transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </NebulaCard>
            );
          })}
          {filtered.length === 0 && <div className="text-center py-12 text-white/30 text-sm">Aucune vidéo</div>}
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
              <h2 className="text-lg font-semibold text-white">{editing ? "Modifier" : "Ajouter"} une vidéo</h2>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg hover:bg-white/5 text-white/40 hover:text-white"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-white/50 text-xs mb-1.5">Module</label>
                <select value={form.module_id} onChange={e => setForm({ ...form, module_id: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm">
                  <option value="">Sélectionner un module</option>
                  {modules.map(m => <option key={m.id} value={m.id}>{m.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-1.5">Titre</label>
                <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
              </div>
              <div>
                <label className="block text-white/50 text-xs mb-1.5">Description</label>
                <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={3}
                  className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">URL de la vidéo</label>
                  <input value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..."
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-white/50 text-xs mb-1.5">Durée</label>
                  <input value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="15:30"
                    className="w-full px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm" />
                </div>
              </div>
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
