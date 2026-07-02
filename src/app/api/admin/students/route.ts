import { supabaseAdmin, requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth.error) return auth.error;

  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET /api/admin/students error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
  return new Response(JSON.stringify({ students: profiles || [] }), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
