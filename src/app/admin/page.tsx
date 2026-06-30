import { Users, BookOpen, BarChart3, TrendingUp } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold text-star-white">Vue d&apos;ensemble</h1>
        <p className="text-sm text-mist">Tableau de bord administrateur</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Étudiants", value: "1 200+" },
          { icon: BookOpen, label: "Modules", value: "6" },
          { icon: BarChart3, label: "Taux complétion", value: "67%" },
          { icon: TrendingUp, label: "Revenus", value: "—" },
        ].map((s) => (
          <NebulaCard key={s.label} className="p-5">
            <div className="w-9 h-9 bg-gradient-to-br from-violet/10 to-magenta/10 rounded-lg border border-violet/10 flex items-center justify-center mb-3">
              <s.icon className="w-4 h-4 text-violet" />
            </div>
            <p className="font-display text-2xl font-bold text-star-white">{s.value}</p>
            <p className="text-xs text-mist mt-0.5">{s.label}</p>
          </NebulaCard>
        ))}
      </div>

      <NebulaCard className="p-6">
        <h2 className="text-sm font-medium text-mist mb-4">Étudiants récents</h2>
        <p className="text-sm text-mist">Aucun étudiant récent à afficher.</p>
      </NebulaCard>
    </div>
  );
}
