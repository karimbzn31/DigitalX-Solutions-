"use client";

import { Users, Clock, UserPlus, TrendingUp, AlertTriangle, CheckCircle, MessageSquare, FileText } from "lucide-react";
import Link from "next/link";
import { NebulaCard } from "@/components/shared/NebulaCard";
import { cn } from "@/lib/utils";
import { ADMIN_USER, PENDING_REQUESTS, RECENT_ACTIVITIES, DAILY_REGISTRATIONS, STUDENTS } from "@/lib/mock-admin";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function isThisWeek(iso: string): boolean {
  const now = new Date();
  const date = new Date(iso);
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  return date >= weekAgo;
}

const activityConfig: Record<string, { icon: typeof Users; color: string; bg: string }> = {
  inscription: { icon: UserPlus, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  validation: { icon: CheckCircle, color: "text-cyan-soft", bg: "bg-cyan-500/10" },
  progression: { icon: TrendingUp, color: "text-violet", bg: "bg-violet/10" },
  certificat: { icon: FileText, color: "text-amber-400", bg: "bg-amber-500/10" },
  message: { icon: MessageSquare, color: "text-rose", bg: "bg-rose/10" },
};

const statusConfig: Record<string, { label: string; classes: string }> = {
  completed: { label: "Terminé", classes: "bg-emerald-500/10 text-emerald-400 border-emerald-500/15" },
  pending: { label: "En attente", classes: "bg-amber-500/10 text-amber-400 border-amber-500/15" },
  warning: { label: "Attention", classes: "bg-rose/10 text-rose border-rose/15" },
};

export default function AdminOverviewPage() {
  const activeStudents = STUDENTS.filter((s) => s.status === "active").length;
  const pendingCount = PENDING_REQUESTS.filter((r) => r.status === "pending").length;
  const newThisWeek = STUDENTS.filter((s) => isThisWeek(s.enrolledAt)).length;
  const avgProgress = Math.round(STUDENTS.reduce((acc, s) => acc + s.progress, 0) / STUDENTS.length);
  const maxCount = Math.max(...DAILY_REGISTRATIONS.map((d) => d.count));

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-3xl font-bold text-star-white tracking-tight">
          Panneau de contrôle 👑
        </h1>
        <p className="text-sm text-mist mt-1">
          Bienvenue, <span className="text-star-white font-medium">{ADMIN_USER.name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <NebulaCard className="p-5 !bg-surface/70">
          <div className="w-10 h-10 rounded-xl bg-violet/10 flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-violet" />
          </div>
          <p className="font-display text-3xl font-bold text-star-white">{activeStudents}</p>
          <p className="text-xs text-mist mt-0.5">Total étudiants actifs</p>
        </NebulaCard>

        <NebulaCard className="p-5 !bg-surface/70">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center mb-3">
            <Clock className="w-5 h-5 text-amber-400" />
          </div>
          <p className="font-display text-3xl font-bold text-star-white">{pendingCount}</p>
          <p className="text-xs text-mist mt-0.5">Demandes en attente</p>
        </NebulaCard>

        <NebulaCard className="p-5 !bg-surface/70">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-3">
            <UserPlus className="w-5 h-5 text-emerald-400" />
          </div>
          <p className="font-display text-3xl font-bold text-star-white">{newThisWeek}</p>
          <p className="text-xs text-mist mt-0.5">Nouveaux inscrits cette semaine</p>
        </NebulaCard>

        <NebulaCard className="p-5 !bg-surface/70">
          <div className="w-10 h-10 rounded-xl bg-magenta/10 flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5 text-magenta" />
          </div>
          <p className="font-display text-3xl font-bold text-star-white">{avgProgress}%</p>
          <p className="text-xs text-mist mt-0.5">Taux de complétion moyen</p>
        </NebulaCard>
      </div>

      {pendingCount > 0 && (
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/15 p-5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.06),transparent_60%)] pointer-events-none" />
          <div className="relative z-10 flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-star-white">
                  {pendingCount} demande{pendingCount > 1 ? "s" : ""} d&apos;inscription attendent votre validation.
                </p>
                <p className="text-xs text-mist mt-0.5">Elles seront automatiquement supprimées après 7 jours.</p>
              </div>
            </div>
            <Link
              href="/admin/inscriptions"
              className="shrink-0 px-4 py-2 rounded-lg bg-amber-500/15 text-amber-400 text-sm font-medium hover:bg-amber-500/25 transition-all"
            >
              Voir les demandes →
            </Link>
          </div>
        </div>
      )}

      <NebulaCard className="p-6 !bg-surface/70 overflow-hidden">
        <h2 className="font-display text-lg font-semibold text-star-white mb-4">Dernières activités</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm nebula-table">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left py-3 pr-4 text-xs text-mist font-medium">Action</th>
                <th className="text-left py-3 pr-4 text-xs text-mist font-medium">Utilisateur</th>
                <th className="text-left py-3 pr-4 text-xs text-mist font-medium">Date</th>
                <th className="text-left py-3 text-xs text-mist font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_ACTIVITIES.map((activity) => {
                const config = activityConfig[activity.type];
                const stat = statusConfig[activity.status];
                const Icon = config.icon;
                return (
                  <tr key={activity.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", config.bg)}>
                          <Icon className={cn("w-4 h-4", config.color)} />
                        </div>
                        <span className="text-star-white">{activity.details}</span>
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      <div>
                        <p className="text-star-white text-sm">{activity.user.name}</p>
                        <p className="text-xs text-mist">{activity.user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-mist text-xs whitespace-nowrap">{formatDate(activity.date)}</td>
                    <td className="py-3">
                      <span className={cn("inline-flex text-[11px] font-medium px-2.5 py-1 rounded-full border", stat.classes)}>
                        {stat.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </NebulaCard>

      <NebulaCard className="p-6 !bg-surface/70">
        <h2 className="font-display text-lg font-semibold text-star-white mb-6">Inscriptions cette semaine</h2>
        <div className="grid grid-cols-7 gap-3 items-end h-[140px]">
          {DAILY_REGISTRATIONS.map((d) => {
            const height = maxCount > 0 ? (d.count / maxCount) * 120 : 0;
            return (
              <div key={d.day} className="flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-xs font-medium text-mist">{d.count}</span>
                <div
                  className="w-full rounded-md bg-gradient-to-t from-violet to-magenta transition-all duration-500"
                  style={{ height: `${Math.max(height, 4)}px` }}
                />
                <span className="text-[11px] text-mist font-medium">{d.day}</span>
              </div>
            );
          })}
        </div>
      </NebulaCard>
    </div>
  );
}
