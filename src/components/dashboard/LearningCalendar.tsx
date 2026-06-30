export function LearningCalendar() {
  const days = ["L", "M", "M", "J", "V", "S", "D"];
  const currentMonth = "Juin 2026";
  const today = 15;

  const activeDays = [3, 5, 8, 10, 12, 15];
  const totalDays = 30;

  return (
    <div className="nebula-card rounded-[0.75rem] p-5">
      <h3 className="text-sm font-medium text-star-white mb-3">{currentMonth}</h3>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {days.map((d) => (
          <span key={d} className="text-[10px] text-mist text-center font-medium">{d}</span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: totalDays }, (_, i) => {
          const day = i + 1;
          const isActive = activeDays.includes(day);
          const isToday = day === today;

          return (
            <div
              key={day}
              className={[
                "aspect-square rounded-md flex items-center justify-center text-[11px] transition-all",
                isToday
                  ? "bg-violet text-star-white font-bold"
                  : isActive
                  ? "bg-violet/15 text-violet"
                  : "text-mist/40",
              ].join(" ")}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5 text-[10px] text-mist">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-violet/15" />
          Activité
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded bg-violet" />
          Aujourd&apos;hui
        </span>
      </div>
    </div>
  );
}
