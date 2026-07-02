import { supabaseAdmin, requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { data: all, error } = await supabaseAdmin
    .from("profiles")
    .select("*");

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  const pending = (all || [])
    .filter((p) => p.status === "pending")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return Response.json({ requests: pending || [] }, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
