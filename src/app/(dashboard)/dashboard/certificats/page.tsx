"use client";
import { modules, currentUser } from "@/lib/mock-data";
import { Award, Download, CheckCircle, Lock, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CertificatsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-display font-semibold text-star-white">Certificats</h2>
        <p className="text-sm text-mist mt-1">Téléchargez vos certificats de réussite</p>
      </div>

      {/* Stats card */}
      <div className="bg-surface/70 backdrop-blur-sm border border-white/[0.07] rounded-xl p-5">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet/20 to-magenta/10 flex items-center justify-center">
            <Award className="w-7 h-7 text-violet" />
          </div>
          <div>
            <p className="text-2xl font-bold text-star-white">{currentUser.certificates} / {modules.length}</p>
            <p className="text-xs text-mist">Certificats obtenus</p>
          </div>
        </div>
        <div className="mt-4 h-2 rounded-full bg-white/5 overflow-hidden">
          <div className="h-full rounded-full bg-gradient-to-r from-violet to-magenta transition-all" style={{ width: `${(currentUser.certificates / modules.length) * 100}%` }} />
        </div>
      </div>

      {/* Certificate list */}
      <div className="space-y-4">
        {modules.map((mod) => {
          const isCompleted = mod.status === "completed";
          return (
            <div
              key={mod.id}
              className={cn(
                "bg-surface/70 backdrop-blur-sm border rounded-xl p-5 transition-all",
                isCompleted ? "border-violet/30 hover:border-violet/50" : "border-white/[0.07] opacity-60"
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
                    isCompleted ? "bg-gradient-to-br from-violet/20 to-magenta/10" : "bg-white/5"
                  )}>
                    <Award className={cn("w-6 h-6", isCompleted ? "text-violet" : "text-mist")} />
                  </div>
                  <div>
                    <h3 className={cn("font-display text-sm font-semibold", isCompleted ? "text-star-white" : "text-mist")}>
                      Module {mod.id} : {mod.title}
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
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-violet/10 text-violet text-xs font-medium hover:bg-violet/20 transition-all">
                        <Download className="w-3.5 h-3.5" />
                        PDF
                      </button>
                      <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-mist text-xs font-medium hover:text-star-white hover:bg-white/10 transition-all">
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </>
                  ) : (
                    <span className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-white/5 text-mist text-[11px] font-medium">
                      <Lock className="w-3.5 h-3.5" />
                      Verrouillé
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
