"use client";
import { useState } from "react";
import { resources, modules } from "@/lib/mock-data";
import { Search, FileText, Code, File as FileIcon, Download } from "lucide-react";
import { cn } from "@/lib/utils";

const resourceTypeConfig = {
  prompt: { label: "Prompts", icon: FileText, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  code: { label: "Code", icon: Code, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  pdf: { label: "PDFs", icon: FileIcon, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  template: { label: "Templates", icon: FileIcon, color: "text-violet bg-violet/10 border-violet/20" },
};

export default function BibliothequePage() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  const filtered = resources.filter((r) => {
    if (typeFilter && r.type !== typeFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDownload = (title: string, content?: string, fileUrl?: string) => {
    if (fileUrl) {
      const a = document.createElement("a");
      a.href = fileUrl;
      a.download = fileUrl.split("/").pop() || title;
      a.click();
      return;
    }
    if (content) {
      const blob = new Blob([content], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">Bibliothèque</h2>
        <p className="text-sm text-mist mt-1">Ressources, prompts, templates et scripts pour vos projets</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
        <input
          type="text"
          placeholder="Rechercher une ressource..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface/70 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-star-white placeholder:text-mist focus:outline-none focus:border-violet/50 transition-colors"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setTypeFilter(null)}
          className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all border", !typeFilter ? "bg-violet text-white border-violet" : "bg-white/5 text-mist border-white/10 hover:text-star-white")}
        >Tout</button>
        {Object.entries(resourceTypeConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setTypeFilter(typeFilter === key ? null : key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5",
                typeFilter === key ? config.color + " border-current" : "bg-white/5 text-mist border-white/10 hover:text-star-white"
              )}
            >
              <Icon className="w-3 h-3" />
              {config.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r) => {
          const config = resourceTypeConfig[r.type];
          const Icon = config.icon;
          const mod = modules.find((m) => m.id === r.moduleId);
          return (
            <div key={r.id} className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-4 hover:border-violet/40 hover:-translate-y-0.5 transition-all duration-200 group">
              <div className="flex items-start gap-3">
                <div className={cn("w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border", config.color)}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn("inline-block px-1.5 py-0.5 rounded text-[9px] font-medium uppercase border", config.color)}>
                    {config.label}
                  </span>
                  <h3 className="text-sm font-medium text-star-white mt-1.5 leading-snug">{r.title}</h3>
                  <p className="text-[11px] text-mist mt-1 line-clamp-2">{r.description}</p>
                  {mod && <span className="inline-block text-[10px] text-violet mt-2">Module {mod.id} · {mod.titleShort}</span>}
                </div>
              </div>
              <button
                onClick={() => handleDownload(r.title, r.content, r.fileUrl)}
                className="flex items-center justify-center gap-1.5 w-full mt-3 py-1.5 rounded-lg bg-violet/10 text-violet text-[11px] font-medium hover:bg-violet/20 transition-colors"
              >
                <Download className="w-3 h-3" />
                Télécharger
              </button>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-sm text-mist">Aucune ressource trouvée</p>
        </div>
      )}
    </div>
  );
}
