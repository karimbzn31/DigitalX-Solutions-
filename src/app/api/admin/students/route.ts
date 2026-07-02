import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
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
