import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data: pending } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .eq("status", "pending")
    .order("created_at", { ascending: false });

  return Response.json({ requests: pending || [] });
}
