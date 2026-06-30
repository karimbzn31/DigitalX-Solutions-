import { NebulaCard } from "@/components/shared/NebulaCard";
import { NebulaBadge } from "@/components/shared/NebulaBadge";

const students = [
  { name: "Amine K.", email: "amine@email.com", status: "active" as const, progress: 78 },
  { name: "Sarah B.", email: "sarah@email.com", status: "active" as const, progress: 45 },
  { name: "Yacine B.", email: "yacine@email.com", status: "inactive" as const, progress: 92 },
];

export default function StudentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-star-white">Étudiants</h1>
        <p className="text-sm text-mist">Gérez les inscriptions et les accès</p>
      </div>

      <NebulaCard className="p-4 overflow-hidden">
        <table className="w-full text-sm nebula-table">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-3 text-xs text-mist font-medium px-3">Nom</th>
              <th className="text-left py-3 text-xs text-mist font-medium px-3">Email</th>
              <th className="text-left py-3 text-xs text-mist font-medium px-3">Statut</th>
              <th className="text-left py-3 text-xs text-mist font-medium px-3">Progression</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.email} className="border-b border-white/5 last:border-0">
                <td className="py-3 text-sm text-star-white px-3">{s.name}</td>
                <td className="py-3 text-sm text-mist px-3">{s.email}</td>
                <td className="py-3 px-3">
                  <NebulaBadge variant={s.status === "active" ? "violet" : "default"}>
                    {s.status}
                  </NebulaBadge>
                </td>
                <td className="py-3 px-3">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 nebula-progress max-w-[100px]">
                      <div className="nebula-progress-bar" style={{ width: `${s.progress}%` }} />
                    </div>
                    <span className="text-xs text-mist">{s.progress}%</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </NebulaCard>
    </div>
  );
}
