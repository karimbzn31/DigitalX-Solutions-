"use client";

import { useState } from "react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { NebulaButton } from "@/components/shared/NebulaButton";
import { NebulaBadge } from "@/components/shared/NebulaBadge";
import { useNotificationStore } from "@/store/useNotificationStore";
import { Plus, Send } from "lucide-react";

export default function AnnouncementsPage() {
  const addNotification = useNotificationStore((s) => s.addNotification);
  const [items, setItems] = useState([
    { id: "a1", title: "Bienvenue à la formation", status: "published" as const },
    { id: "a2", title: "Module Vibe Coding disponible", status: "published" as const },
    { id: "a3", title: "Session Q&A en direct", status: "draft" as const },
  ]);
  const [title, setTitle] = useState("");
  const [showForm, setShowForm] = useState(false);

  const addAnnouncement = () => {
    if (!title.trim()) return;
    const newItem = { id: `a${Date.now()}`, title: title.trim(), status: "draft" as const };
    setItems([newItem, ...items]);
    setTitle("");
    setShowForm(false);
  };

  const publish = (id: string) => {
    setItems((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: "published" as const } : a))
    );
    const item = items.find((a) => a.id === id);
    if (item) {
      addNotification({
        type: "info",
        title: "Nouvelle annonce",
        message: item.title,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-star-white">Annonces</h1>
          <p className="text-sm text-mist">Créez et gérez les annonces</p>
        </div>
        <NebulaButton size="sm" onClick={() => setShowForm(true)}>
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Nouvelle annonce
        </NebulaButton>
      </div>

      {showForm && (
        <NebulaCard className="p-4">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addAnnouncement(); if (e.key === "Escape") setShowForm(false); }}
            placeholder="Titre de l'annonce..."
            className="w-full bg-surface border border-white/10 rounded-lg px-4 py-3 text-sm text-star-white placeholder:text-mist/30 outline-none focus:border-violet transition-colors mb-3"
            autoFocus
          />
          <div className="flex items-center gap-2 justify-end">
            <NebulaButton variant="ghost" size="sm" onClick={() => setShowForm(false)}>
              Annuler
            </NebulaButton>
            <NebulaButton size="sm" onClick={addAnnouncement}>
              Ajouter
            </NebulaButton>
          </div>
        </NebulaCard>
      )}

      <div className="space-y-2">
        {items.map((a) => (
          <NebulaCard key={a.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-sm text-star-white">{a.title}</span>
              <NebulaBadge variant={a.status === "published" ? "violet" : "default"}>
                {a.status === "published" ? "Publié" : "Brouillon"}
              </NebulaBadge>
            </div>
            <div className="flex items-center gap-2">
              {a.status === "draft" && (
                <button
                  onClick={() => publish(a.id)}
                  className="flex items-center gap-1.5 text-xs text-violet hover:text-rose transition-colors"
                >
                  <Send className="w-3 h-3" />
                  Publier
                </button>
              )}
              <button className="text-xs text-mist hover:text-star-white transition-colors">
                Modifier
              </button>
            </div>
          </NebulaCard>
        ))}
      </div>
    </div>
  );
}
