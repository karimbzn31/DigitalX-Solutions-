"use client";
import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface StatsData {
  days: { label: string; videos: number; minutes: number }[];
}

function generateMockData(): StatsData {
  const days = [];
  for (let i = 7; i >= 0; i--) {
    days.push({
      label: i === 0 ? "Ajd" : `J-${i}`,
      videos: Math.floor(Math.random() * 4),
      minutes: Math.floor(Math.random() * 60) + 10,
    });
  }
  return { days };
}

interface StatsChartProps {
  data?: StatsData;
}

export function StatsChart({ data }: StatsChartProps) {
  const [chartData, setChartData] = useState<StatsData | null>(null);
  const [activeView, setActiveView] = useState<"videos" | "minutes">("videos");

  useEffect(() => {
    if (data) {
      setChartData(data);
    } else {
      setChartData(generateMockData());
    }
  }, [data]);

  const totals = useMemo(() => {
    if (!chartData) return { videos: 0, minutes: 0 };
    return {
      videos: chartData.days.reduce((s, d) => s + d.videos, 0),
      minutes: chartData.days.reduce((s, d) => s + d.minutes, 0),
    };
  }, [chartData]);

  if (!chartData) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl border border-white/[0.07] bg-surface/70 backdrop-blur-sm p-4 sm:p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-star-white">Activité récente</h3>
          <p className="text-[11px] text-mist mt-0.5">7 derniers jours</p>
        </div>
        <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
          <button
            onClick={() => setActiveView("videos")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              activeView === "videos"
                ? "bg-violet/20 text-violet"
                : "text-mist hover:text-star-white"
            }`}
          >
            Vidéos
          </button>
          <button
            onClick={() => setActiveView("minutes")}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${
              activeView === "minutes"
                ? "bg-violet/20 text-violet"
                : "text-mist hover:text-star-white"
            }`}
          >
            Temps
          </button>
        </div>
      </div>

      <div className="h-44 sm:h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData.days} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorVideos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorMinutes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#C45CFF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#C45CFF" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9C93B8", fontSize: 10 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#9C93B8", fontSize: 10 }}
            />
            <Tooltip
              contentStyle={{
                background: "#110D1F",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "#F4F1FA",
              }}
              labelStyle={{ color: "#9C93B8" }}
            />
            <Area
              type="monotone"
              dataKey={activeView === "videos" ? "videos" : "minutes"}
              stroke={activeView === "videos" ? "#7C5CFF" : "#C45CFF"}
              strokeWidth={2}
              fill={`url(#${activeView === "videos" ? "colorVideos" : "colorMinutes"})`}
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-6 mt-2 pt-3 border-t border-white/5">
        <div className="text-center">
          <p className="text-lg font-bold text-star-white">{totals.videos}</p>
          <p className="text-[10px] text-mist">Vidéos cette semaine</p>
        </div>
        <div className="w-px h-8 bg-white/5" />
        <div className="text-center">
          <p className="text-lg font-bold text-star-white">{Math.round(totals.minutes / 60 * 10) / 10}h</p>
          <p className="text-[10px] text-mist">Temps cette semaine</p>
        </div>
      </div>
    </motion.div>
  );
}
