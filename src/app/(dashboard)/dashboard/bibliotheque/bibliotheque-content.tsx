"use client";
import { useState, useEffect, type ComponentType } from "react";
import { Search, FileText, Code, File as FileIcon, Download, GitBranch, FolderOpen, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface Resource {
  id: string; module_id: string; type: string; title: string;
  description: string; url: string; content: string;
  file_url: string; file_size: number;
}

interface Module { id: string; title: string; title_short: string; }

const resourceTypeConfig: Record<string, { label: string; icon: ComponentType<{ className?: string }>; color: string }> = {
  prompt: { label: "Master Prompts", icon: FileText, color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" },
  file: { label: "Fichiers", icon: FolderOpen, color: "text-violet bg-violet/10 border-violet/20" },
  pdf: { label: "PDFs", icon: FileIcon, color: "text-rose-400 bg-rose-500/10 border-rose-500/20" },
  github: { label: "github", icon: GitBranch, color: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  code: { label: "Code", icon: Code, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
};

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "";
  if (bytes < 1024) return `${bytes} o`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} Ko`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
}

export default function BibliothequeContent() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/student/resources").then(r => r.json()),
      fetch("/api/student/modules").then(r => r.json()),
    ]).then(([resData, modData]) => {
      setResources(resData.resources || []);
      setModules(modData.modules || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = resources.filter((r) => {
    if (typeFilter && r.type !== typeFilter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase()) && !r.description.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleAccess = (r: Resource) => {
    // 1. Fichier uploadé (Supabase Storage)
    if (r.file_url) {
      if (r.type === "pdf" || r.type === "file") {
        // PDF/fichier → ouvre dans un nouvel onglet (téléchargement)
        window.open(r.file_url, "_blank");
      } else {
        // Autres fichiers → ouvre dans un nouvel onglet
        window.open(r.file_url, "_blank");
      }
      return;
    }
    // 2. Lien externe (GitHub, URL)
    if (r.url) {
      window.open(r.url, "_blank");
      return;
    }
    // 3. Contenu texte (prompt, code)
    if (r.content) {
      const ext = r.type === "code" ? ".txt" : ".md";
      const blob = new Blob([r.content], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${r.title.toLowerCase().replace(/\s+/g, "-")}${ext}`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const getButtonLabel = (r: Resource): string => {
    if (r.file_url) return "Télécharger";
    if (r.type === "github") return "Voir sur GitHub";
    if (r.url) return "Ouvrir";
    if (r.content) return "Copier";
    return "Télécharger";
  };

  const getButtonIcon = (r: Resource) => {
    if (r.type === "github" || r.url) return ExternalLink;
    return Download;
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">Bibliothèque</h2>
        <p className="text-sm text-mist mt-1">Ressources, prompts, templates et scripts pour nos étudiants</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-mist" />
        <input type="text" placeholder="Rechercher une ressource..." value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-surface/70 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-star-white placeholder:text-mist focus:outline-none focus:border-violet/50 transition-colors" />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => setTypeFilter(null)}
          className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all border", !typeFilter ? "bg-violet text-white border-violet" : "bg-white/5 text-mist border-white/10 hover:text-star-white")}>Tout</button>
        {Object.entries(resourceTypeConfig).map(([key, config]) => {
          const Icon = config.icon;
          return (
            <button key={key} onClick={() => setTypeFilter(typeFilter === key ? null : key)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5",
                typeFilter === key ? config.color + " border-current" : "bg-white/5 text-mist border-white/10 hover:text-star-white")}>
              <Icon className="w-3 h-3" /> {config.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r) => {
          const config = resourceTypeConfig[r.type] || resourceTypeConfig.prompt;
          const Icon = config.icon;
          const mod = modules.find((m) => m.id === r.module_id);
          const ButtonIcon = getButtonIcon(r);
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
                  <h3 className="text-sm font-medium text-star-white mt-1.5 leading-snug flex items-center gap-2">
                    {r.title}
                    {r.file_url && r.file_size > 0 && (
                      <span className="text-[9px] text-mist font-normal shrink-0">
                        ({formatFileSize(r.file_size)})
                      </span>
                    )}
                  </h3>
                  <p className="text-[11px] text-mist mt-1 line-clamp-2">{r.description}</p>
                  {mod && <span className="inline-block text-[10px] text-violet mt-2">Module · {mod.title_short}</span>}
                </div>
              </div>
              <button onClick={() => handleAccess(r)}
                className="flex items-center justify-center gap-1.5 w-full mt-3 py-1.5 rounded-lg bg-violet/10 text-violet text-[11px] font-medium hover:bg-violet/20 transition-colors">
                <ButtonIcon className="w-3 h-3" />
                {getButtonLabel(r)}
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
