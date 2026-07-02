"use client";
import { useState, useEffect } from "react";
import { Award, Download, CheckCircle, Lock, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Mod {
  id: string; title: string; title_short: string; videos: number;
  duration: string; progress: number; status: string;
}

export default function CertificatsPage() {
  const [modules, setModules] = useState<Mod[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/student/modules")
      .then(r => r.json())
      .then(data => { setModules(data.modules || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleDownloadPDF = (moduleTitle: string) => {
    const element = document.createElement("a");
    const content = `Certificat de réussite - ${moduleTitle}\nFélicitations pour avoir complété ce module !\n\nDigitalXSolutions Academy`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    element.href = url;
    element.download = `certificat-${moduleTitle.toLowerCase().replace(/\s+/g, "-")}.txt`;
    element.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = async (moduleTitle: string) => {
    const text = `🎓 Je viens de terminer le module "${moduleTitle}" sur DigitalXSolutions Academy !`;
    if (navigator.share) {
      await navigator.share({ title: "Mon certificat", text }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(text);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-20"><div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" /></div>;
  }

  const completedCount = modules.filter((m) => m.status === "completed").length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">Certificats</h2>
        <p className="text-sm text-mist mt-1">Téléchargez vos certificats de réussite</p>
      </div>

      <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center">
            <Award className="w-7 h-7 text-violet" />
          </div>
          <div>
            <p className="text-2xl font-bold text-star-white">{completedCount} / {modules.length}</p>
            <p className="text-xs text-mist">Certificats obtenus</p>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-violet to-magenta transition-all" style={{ width: `${modules.length > 0 ? (completedCount / modules.length) * 100 : 0}%` }} />
        </div>
      </div>

      <div className="space-y-4">
        {modules.map((mod) => {
          const isCompleted = mod.status === "completed";
          return (
            <div key={mod.id} className={cn("bg-surface/70 backdrop-blur-sm border rounded-xl p-5 transition-all", isCompleted ? "border-violet/30 hover:border-violet/50" : "border-white/[0.07] opacity-60")}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center shrink-0", isCompleted ? "bg-gradient-to-br from-violet/20 to-magenta/10" : "bg-white/5")}>
                    <Award className={cn("w-6 h-6", isCompleted ? "text-violet" : "text-mist")} />
                  </div>
                  <div>
                    <h3 className={cn("font-display text-sm font-semibold", isCompleted ? "text-star-white" : "text-mist")}>
                      Module : {mod.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-[11px] text-mist">{mod.videos} vidéos</span>
                      <span className="text-[11px] text-mist">{mod.duration}</span>
                    </div>
                    {isCompleted && (
                      <div className="flex items-center gap-1.5 mt-1.5">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-[11px] text-emerald-400 font-medium">Complété à 100%</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {isCompleted ? (
                    <>
                      <button onClick={() => handleDownloadPDF(mod.title)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet/10 text-violet text-xs font-medium hover:bg-violet/20 transition-all">
                        <Download className="w-3.5 h-3.5" /> PDF
                      </button>
                      <button onClick={() => handleShare(mod.title)}
                        className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-mist text-xs font-medium hover:text-star-white hover:bg-white/10 transition-all">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-mist text-[11px] font-medium">
                      <Lock className="w-3.5 h-3.5" /> Verrouillé
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
