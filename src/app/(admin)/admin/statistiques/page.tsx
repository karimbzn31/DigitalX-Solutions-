"use client";
import { useEffect, useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import { TrendingUp, Users, Video, Award } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { cn } from "@/lib/utils";

interface Stats {
  total: number; pending: number; active: number; blocked: number; admins: number;
  totalVideos: number; totalProgress: number;
  daily: { day: string; count: number }[];
  moduleCompletion: { name: string; completions: number; color: string }[];
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { name: string; color: string; value: number }[]; label?: string }) => {
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
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(r => r.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="flex justify-center py-12"><div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" /></div>;
  }

  const kpis = [
    { icon: Users, label: "Inscrits", value: stats?.total || 0, change: `+${stats?.active || 0} actifs`, up: true },
    { icon: TrendingUp, label: "En attente", value: stats?.pending || 0, change: `${stats?.blocked || 0} bloqués`, up: false },
    { icon: Video, label: "Vidéos", value: stats?.totalVideos || 0, change: `${stats?.totalProgress || 0} progrès`, up: true },
    { icon: Award, label: "Actifs", value: stats?.active || 0, change: `${stats?.admins || 0} admins`, up: true },
  ];

  const monthlyData = (stats?.daily || []).map((d) => ({
    day: d.day,
    inscriptions: d.count,
  }));

  const engagementPie = [
    { name: "Actifs", value: stats?.active || 0, color: "#06b6d4" },
    { name: "En attente", value: stats?.pending || 0, color: "#f59e0b" },
    { name: "Bloqués", value: stats?.blocked || 0, color: "#ef4444" },
    { name: "Admins", value: stats?.admins || 0, color: "#6366f1" },
  ];

  const totalAccounts = (stats?.active || 0) + (stats?.pending || 0) + (stats?.blocked || 0) + (stats?.admins || 0) || 1;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Statistiques</h1>
        <p className="text-white/50 text-sm mt-1">Données réelles de la plateforme</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NebulaCard className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Inscriptions (7 derniers jours)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="gradient-inscriptions" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="day" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="inscriptions" stroke="#06b6d4" fill="url(#gradient-inscriptions)" strokeWidth={2} name="Inscriptions" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </NebulaCard>

        <NebulaCard className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Complétion par module</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats?.moduleCompletion || []} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis type="number" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis dataKey="name" type="category" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 12 }} axisLine={false} tickLine={false} width={120} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="completions" radius={[0, 4, 4, 0]} name="Progrès">
                  {(stats?.moduleCompletion || []).map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </NebulaCard>

        <NebulaCard className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Répartition des comptes</h3>
          <div className="h-64 flex items-center justify-center relative">
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
            <div className="absolute flex flex-col items-center pointer-events-none">
              <span className="text-2xl font-bold text-white">{totalAccounts}</span>
              <span className="text-white/40 text-xs">Total</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {engagementPie.map((e) => (
              <div key={e.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: e.color }} />
                <span className="text-white/50">{e.name}</span>
                <span className="text-white/70 font-medium">{e.value}</span>
              </div>
            ))}
          </div>
        </NebulaCard>
      </div>
    </div>
  );
}
