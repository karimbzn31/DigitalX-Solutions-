"use client";

import { useEffect, useState } from "react";
import { Users, UserPlus, AlertTriangle, CheckCircle, Shield } from "lucide-react";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { cn } from "@/lib/utils";

interface PendingReq {
  id: string;
  name: string;
  email: string;
  initials: string;
  status: string;
  created_at: string;
}

interface Stats {
  total: number;
  pending: number;
  active: number;
  blocked: number;
  admins: number;
  daily: { day: string; count: number }[];
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [pending, setPending] = useState<PendingReq[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/pending").then((r) => r.json()),
    ]).then(([statsData, pendingData]) => {
      setStats(statsData);
      setPending(pendingData.requests || []);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-6 h-6 border-2 border-cyan-soft border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const kpis = [
    { icon: Users, label: "Total inscrits", value: stats?.total || 0, color: "from-cyan-soft to-violet" },
    { icon: UserPlus, label: "En attente", value: stats?.pending || 0, color: "from-amber-400 to-orange-500", alert: (stats?.pending || 0) > 0 },
    { icon: CheckCircle, label: "Actifs", value: stats?.active || 0, color: "from-emerald-400 to-teal-500" },
    { icon: Shield, label: "Administrateurs", value: stats?.admins || 0, color: "from-violet to-magenta" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Vue d&apos;ensemble</h1>
        <p className="text-white/50 text-sm mt-1">Tableau de bord administrateur</p>
      </div>

      {stats && stats.pending > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm text-amber-200">
            <strong>{stats.pending}</strong> inscription{stats.pending > 1 ? "s" : ""} en attente de validation
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <NebulaCard key={kpi.label} className={cn("p-5", kpi.alert && "ring-1 ring-amber-500/30")}>
            <div className={cn("w-10 h-10 rounded-xl bg-gradient-to-br border border-white/10 flex items-center justify-center mb-3", kpi.color)}>
              <kpi.icon className="w-5 h-5 text-white" />
            </div>
            <div className="text-2xl font-bold text-white">{kpi.value}</div>
            <div className="text-white/40 text-sm">{kpi.label}</div>
          </NebulaCard>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <NebulaCard className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Inscriptions (7 derniers jours)</h3>
          <div className="flex items-end gap-2 h-32">
            {stats?.daily.map((d) => {
              const max = Math.max(...stats.daily.map((x) => x.count), 1);
              const h = (d.count / max) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] text-white/40">{d.count}</span>
                  <div className="w-full rounded-t-md bg-gradient-to-t from-cyan-soft/40 to-violet/40 transition-all" style={{ height: `${Math.max(h, 4)}%` }} />
                  <span className="text-[10px] text-white/30">{d.day}</span>
                </div>
              );
            })}
          </div>
        </NebulaCard>

        <NebulaCard className="p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Demandes récentes</h3>
          <div className="space-y-3">
            {pending.length === 0 && <p className="text-white/30 text-sm">Aucune demande en attente</p>}
            {pending.slice(0, 5).map((req) => (
              <div key={req.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-white/5 border border-white/5">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center text-xs font-semibold text-amber-400">
                  {req.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-sm font-medium truncate">{req.name}</div>
                  <div className="text-white/40 text-xs truncate">{req.email}</div>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/15">
                  En attente
                </span>
              </div>
            ))}
          </div>
        </NebulaCard>
      </div>
    </div>
  );
}
