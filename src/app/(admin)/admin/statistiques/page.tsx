"use client";

import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Users, Video, Award, Download } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { cn } from "@/lib/utils";

const monthlyData = [
  { month: "Jan", inscriptions: 12, actifs: 8, certifies: 2 },
  { month: "Fév", inscriptions: 18, actifs: 14, certifies: 5 },
  { month: "Mar", inscriptions: 25, actifs: 20, certifies: 8 },
  { month: "Avr", inscriptions: 30, actifs: 26, certifies: 12 },
  { month: "Mai", inscriptions: 22, actifs: 18, certifies: 15 },
  { month: "Juin", inscriptions: 35, actifs: 30, certifies: 20 },
];

const weeklyViews = [
  { day: "Lun", vues: 145 },
  { day: "Mar", vues: 230 },
  { day: "Mer", vues: 180 },
  { day: "Jeu", vues: 310 },
  { day: "Ven", vues: 270 },
  { day: "Sam", vues: 120 },
  { day: "Dim", vues: 85 },
];

const moduleCompletion = [
  { name: "Vibe Coding 101", completions: 24, color: "#06b6d4" },
  { name: "API Mastery", completions: 18, color: "#6366f1" },
  { name: "Agents IA", completions: 12, color: "#ec4899" },
  { name: "Déploiement Cloud", completions: 15, color: "#f59e0b" },
  { name: "Bienvenue", completions: 30, color: "#22c55e" },
];

const engagementPie = [
  { name: "Très actif", value: 35, color: "#06b6d4" },
  { name: "Actif", value: 30, color: "#6366f1" },
  { name: "Peu actif", value: 20, color: "#f59e0b" },
  { name: "Inactif", value: 15, color: "#ef4444" },
];

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-white/10 bg-[#0a0e1a]/95 backdrop-blur-sm px-4 py-3 shadow-xl">
      <p className="text-white/50 text-xs mb-2">{label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
          <span className="text-white/70">{p.name}:</span>
          <span className="text-white font-medium">{p.value}</span>
        </div>
      ))}
    </div>
  );
};

export default function AdminStatistiquesPage() {
  const [period, setPeriod] = useState<"6m" | "1y">("6m");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Statistiques</h1>
          <p className="text-white/50 text-sm mt-1">Analyses et indicateurs clés de la plateforme</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-white/10 overflow-hidden">
            {(["6m", "1y"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  period === p ? "bg-cyan-soft/10 text-cyan-soft" : "text-white/40 hover:text-white/60 bg-transparent"
                )}
              >
                {p === "6m" ? "6 mois" : "1 an"}
              </button>
            ))}
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:border-white/20 transition-colors text-xs">
            <Download className="w-3.5 h-3.5" />
            Exporter
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: "Inscrits", value: "142", change: "+23%", up: true },
          { icon: TrendingUp, label: "Actifs", value: "96", change: "+12%", up: true },
          { icon: Video, label: "Vidéos vues", value: "3 420", change: "+18%", up: true },
          { icon: Award, label: "Certifiés", value: "62", change: "+8%", up: true },
        ].map((kpi) => (
          <NebulaCard key={kpi.label} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 rounded-lg bg-white/5 border border-white/5">
                <kpi.icon className="w-4 h-4 text-cyan-soft" />
              </div>
              <span className={cn("text-xs font-medium", kpi.up ? "text-emerald-400" : "text-rose")}>
                {kpi.change}
              </span>
            </div>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
            <div className="text-white/40 text-xs mt-0.5">{kpi.label}</div>
          </NebulaCard>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inscriptions / Actifs / Certifiés */}
        <NebulaCard className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Évolution des inscriptions</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  {["#06b6d4", "#6366f1", "#22c55e"].map((color, i) => (
                    <linearGradient key={i} id={`gradient-${i}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={color} stopOpacity={0} />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="inscriptions" stroke="#06b6d4" fill="url(#gradient-0)" strokeWidth={2} name="Inscriptions" />
                <Area type="monotone" dataKey="actifs" stroke="#6366f1" fill="url(#gradient-1)" strokeWidth={2} name="Actifs" />
                <Area type="monotone" dataKey="certifies" stroke="#22c55e" fill="url(#gradient-2)" strokeWidth={2} name="Certifiés" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </NebulaCard>

        {/* Vues hebdomadaires */}
        <NebulaCard className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Vidéos vues (cette semaine)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyViews}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="vues" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Vues" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NebulaCard>

        {/* Complétion par module */}
        <NebulaCard className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Complétion par module</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moduleCompletion} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completions" radius={[0, 4, 4, 0]} name="Certifiés">
                  {moduleCompletion.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NebulaCard>

        {/* Engagement */}
        <NebulaCard className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Répartition engagement</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={engagementPie} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {engagementPie.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold text-white">100%</span>
              <span className="text-white/40 text-xs">Total</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {engagementPie.map((e) => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                <span className="text-white/50">{e.name}</span>
                <span className="text-white/70 font-medium">{e.value}%</span>
              </div>
            ))}
          </div>
        </NebulaCard>
      </div>
    </div>
  );
}
