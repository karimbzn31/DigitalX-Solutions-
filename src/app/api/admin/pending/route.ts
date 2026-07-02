import { supabaseAdmin, requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET() {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { data: pending, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("status", "pending")
    .is("validation_code", null)
    .order("created_at", { ascending: false });

  if (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json({ requests: pending || [] }, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
