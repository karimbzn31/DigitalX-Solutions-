"use client";
import { useState, useEffect, type ComponentType } from "react";
import { Search, FileText, Code, File as FileIcon, GitBranch, FolderOpen, ExternalLink, Zap, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface Resource {
  id: string; module_id: string; type: string; title: string;
  description: string; url: string; content: string;
  file_url: string; file_size: number;
}

interface Module { id: string; title: string; title_short: string; }

const resourceTypeConfig: Record<string, { label: string; icon: ComponentType<{ className?: string }>; color: string }> = {
  skill: {
    label: "Skills JARVIS",
    icon: Zap,
    color: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  },
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

function SkillsHero() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-yellow-500/20 bg-gradient-to-br from-yellow-500/10 via-amber-500/5 to-transparent p-5">
      <div className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-yellow-500/10 blur-[80px]" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-amber-400/10 blur-[60px]" />

      <div className="relative z-10 flex items-start gap-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-lg shadow-yellow-500/20 shrink-0">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-display font-bold text-star-white">⚡ Skills JARVIS</h3>
            <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          <p className="text-xs text-mist leading-relaxed">
            Fichiers d&apos;instructions prêts à l&apos;emploi pour Claude Code. Téléchargez, placez dans votre projet,
            et activez des super-pouvoirs : routage intelligent, auto-learning, skills avancés et plus encore.
          </p>
        </div>
      </div>
    </div>
  );
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
    if (r.file_url) {
      window.open(r.file_url, "_blank");
      return;
    }
    if (r.url) {
      window.open(r.url, "_blank");
      return;
    }
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
    if (r.type === "skill") return "⚡ Télécharger le Skill";
    if (r.file_url) return "Ouvrir";
    if (r.type === "github") return "Voir sur GitHub";
    if (r.url) return "Ouvrir";
    if (r.content) return "Copier";
    return "Ouvrir";
  };

  const isSkillFilter = typeFilter === "skill";

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
          className={cn("px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
            !typeFilter ? "bg-violet text-white border-violet" : "bg-white/5 text-mist border-white/10 hover:text-star-white")}>Tout</button>
        {Object.entries(resourceTypeConfig).map(([key, config]) => {
          const Icon = config.icon;
          const isSkill = key === "skill";
          return (
            <button key={key} onClick={() => setTypeFilter(typeFilter === key ? null : key)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border flex items-center gap-1.5",
                typeFilter === key
                  ? config.color + " border-current"
                  : isSkill
                    ? "bg-yellow-500/5 text-yellow-400/60 border-yellow-500/10 hover:text-yellow-400 hover:border-yellow-500/30"
                    : "bg-white/5 text-mist border-white/10 hover:text-star-white"
              )}>
              <Icon className={cn("w-3 h-3", isSkill && typeFilter !== key && "opacity-60")} /> {config.label}
            </button>
          );
        })}
      </div>

      {/* Skills JARVIS Hero */}
      {isSkillFilter && <SkillsHero />}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((r) => {
          const config = resourceTypeConfig[r.type] || resourceTypeConfig.prompt;
          const Icon = config.icon;
          const mod = modules.find((m) => m.id === r.module_id);
          const isSkill = r.type === "skill";
          return (
            <div key={r.id} className={cn(
              "group rounded-xl p-4 transition-all duration-200",
              isSkill
                ? "bg-yellow-500/5 border border-yellow-500/15 hover:border-yellow-400/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-yellow-500/10"
                : "bg-surface/70 backdrop-blur-sm border border-white/[0.07] hover:border-violet/40 hover:-translate-y-0.5"
            )}>
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-9 h-9 rounded-lg flex items-center justify-center shrink-0 border",
                  isSkill
                    ? "bg-yellow-500/15 border-yellow-500/25 text-yellow-400"
                    : config.color
                )}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className={cn(
                    "inline-block px-1.5 py-0.5 rounded text-[9px] font-medium uppercase border",
                    isSkill
                      ? "bg-yellow-500/15 text-yellow-400 border-yellow-500/25"
                      : config.color
                  )}>
                    {isSkill ? "⚡ SKILL JARVIS" : config.label}
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
                className={cn(
                  "flex items-center justify-center gap-1.5 w-full mt-3 py-1.5 rounded-lg text-[11px] font-medium transition-all",
                  isSkill
                    ? "bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-500/20 hover:from-yellow-500/30 hover:to-amber-500/30"
                    : "bg-violet/10 text-violet hover:bg-violet/20"
                )}>
                {isSkill ? (
                  <><Zap className="w-3 h-3" /> ⚡ Télécharger le Skill</>
                ) : (
                  <><ExternalLink className="w-3 h-3" /> {getButtonLabel(r)}</>
                )}
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
