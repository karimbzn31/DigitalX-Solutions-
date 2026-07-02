import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: all, error } = await supabaseAdmin
    .from("profiles")
    .select("*");

  if (error) {
    console.error("GET /api/admin/pending error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }

  const pending = (all || [])
    .filter((p) => p.status === "pending")
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return Response.json({ requests: pending || [] }, {
    headers: { "Cache-Control": "no-store, max-age=0" },
  });
}
