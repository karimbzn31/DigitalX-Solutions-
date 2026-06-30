import { cn } from "@/lib/utils";

export function ActivityChart() {
  const weekData = [3, 7, 2, 5, 9, 4, 6];

  return (
    <div className="nebula-card rounded-[0.75rem] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-star-white">Activité</h3>
        <div className="flex items-center gap-3">
          {["7 jours", "30 jours"].map((tab) => (
            <button key={tab} className={cn("text-[10px] px-2 py-0.5 rounded-full transition-colors", tab === "7 jours" ? "bg-violet/20 text-violet" : "text-mist hover:text-star-white")}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-end gap-1.5 h-24 mb-1">
        {weekData.map((v, i) => {
          const max = Math.max(...weekData, 1);
          const pct = (v / max) * 100;
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full rounded-sm bg-gradient-to-t from-violet to-magenta transition-all duration-500"
                style={{ height: `${Math.max(pct, 4)}%` }}
              />
            </div>
          );
        })}
      </div>

      <div className="flex justify-between text-[10px] text-mist">
        {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
    </div>
  );
}
