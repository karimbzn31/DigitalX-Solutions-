import { supabaseAdmin, requireAdmin } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");

  let query = supabaseAdmin.from("videos").select("*");
  if (moduleId) query = query.eq("module_id", moduleId);
  query = query.order("order_index", { ascending: true });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ videos: data || [] });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await req.json();
  const { module_id, title, description, url, duration, order_index } = body;

  if (!module_id || !title) {
    return NextResponse.json({ error: "module_id et titre requis" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("videos")
    .insert({ module_id, title, description, url, duration, order_index })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ video: data });
}
