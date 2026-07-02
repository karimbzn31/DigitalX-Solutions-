import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: pending, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("GET /api/admin/pending error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  console.log("DEBUG pending: count=" + (pending?.length ?? 0), "ids=" + JSON.stringify(pending?.map(p => p.id)));

  return new Response(JSON.stringify({ requests: pending || [] }), {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
