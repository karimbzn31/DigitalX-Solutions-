import { NebulaCard } from "@/components/shared/NebulaCard";
import { NebulaBadge } from "@/components/shared/NebulaBadge";
import { modules } from "@/lib/mock-data";

export default function AdminFormationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-star-white">Formations</h1>
        <p className="text-sm text-mist">Gérez les modules de formation</p>
      </div>

      <div className="space-y-3">
        {modules.map((mod) => (
          <NebulaCard key={mod.id} className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <NebulaBadge variant="violet">Module {mod.id}</NebulaBadge>
              <h3 className="text-sm font-medium text-star-white">{mod.title}</h3>
            </div>
            <div className="text-right text-xs text-mist">
              <p>{mod.videos} vidéos</p>
              <p>{mod.duration}</p>
            </div>
          </NebulaCard>
        ))}
      </div>
    </div>
  );
}
