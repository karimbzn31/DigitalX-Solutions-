import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: codes } = await supabaseAdmin
    .from("access_codes")
    .select("*")
    .order("created_at", { ascending: false });

  return Response.json({ codes: codes || [] });
}

export async function POST(req: Request) {
  const body = await req.json();
  const { code, tag, maxUses, expiry } = body;

  const { data, error } = await supabaseAdmin
    .from("access_codes")
    .insert({
      code,
      tag: tag || "Sans tag",
      max_uses: maxUses ? parseInt(maxUses) : null,
      expiry: expiry || null,
      status: "active",
    })
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ code: data });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, uses } = body;

  const { data, error } = await supabaseAdmin
    .from("access_codes")
    .update({ uses })
    .eq("id", id)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 400 });
  return Response.json({ code: data });
}
