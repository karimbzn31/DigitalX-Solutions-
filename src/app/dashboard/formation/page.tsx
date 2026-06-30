import { modules } from "@/lib/mock-data";
import { NebulaBadge } from "@/components/shared/NebulaBadge";
import { NebulaProgressBar } from "@/components/shared/NebulaProgressBar";

export default function FormationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-star-white">Ma Formation</h1>
        <p className="text-sm text-mist">Suivez les modules et vidéos de votre parcours</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {modules.map((mod) => {
          const statusLabel = mod.status === "completed" ? "Terminé" : mod.status === "in-progress" ? "En cours" : "Verrouillé";
          const statusVariant = mod.status === "completed" ? "success" as const : mod.status === "in-progress" ? "violet" as const : "default" as const;

          return (
            <div
              key={mod.id}
              className="nebula-card rounded-[0.75rem] p-5 transition-all duration-300 hover:shadow-nebula hover:-translate-y-1 group"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <NebulaBadge variant="violet" className="mb-2">Module {mod.id}</NebulaBadge>
                  <h3 className="font-display text-sm font-semibold text-star-white">{mod.title}</h3>
                </div>
              </div>

              {mod.description && (
                <p className="text-xs text-mist leading-relaxed mb-4 line-clamp-2">{mod.description}</p>
              )}

              <div className="flex items-center gap-3 text-xs text-mist mb-4">
                <span>{mod.videos} vidéos</span>
                <span>{mod.duration}</span>
              </div>

              <NebulaProgressBar value={mod.progress} className="mb-2" />

              <div className="flex items-center justify-between mt-2">
                <NebulaBadge variant={statusVariant}>{statusLabel}</NebulaBadge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
