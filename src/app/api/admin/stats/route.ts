import { supabaseAdmin, requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const { data: profiles } = await supabaseAdmin.from("profiles").select("*");

  const total = profiles?.length || 0;
  const pending = profiles?.filter((p) => p.status === "pending").length || 0;
  const active = profiles?.filter((p) => p.status === "active").length || 0;
  const blocked = profiles?.filter((p) => p.status === "blocked").length || 0;
  const admins = profiles?.filter((p) => p.is_admin).length || 0;

  // Daily registrations (last 7 days)
  const daily: { day: string; count: number }[] = [];
  const days = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dayStart = new Date(d);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(d);
    dayEnd.setHours(23, 59, 59, 999);
    const count = profiles?.filter((p) => {
      const c = new Date(p.created_at);
      return c >= dayStart && c <= dayEnd;
    }).length || 0;
    daily.push({ day: days[d.getDay()], count });
  }

  return Response.json({
    total,
    pending,
    active,
    blocked,
    admins,
    daily,
  });
}
