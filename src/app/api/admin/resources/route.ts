import { supabaseAdmin, requireAdmin } from "@/lib/api-auth";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");

  let query = supabaseAdmin.from("resources").select("*");
  if (moduleId) query = query.eq("module_id", moduleId);
  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ resources: data || [] });
}

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  const body = await req.json();
  const { module_id, type, title, description, url, content, file_url, file_size } = body;

  if (!type || !title) {
    return NextResponse.json({ error: "type et titre requis" }, { status: 400 });
  }

  const validTypes = ["pdf", "code", "prompt", "file", "github", "skill"];
  if (!validTypes.includes(type)) {
    return NextResponse.json({ error: "Type invalide" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("resources")
    .insert({ module_id, type, title, description, url, content, file_url, file_size })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ resource: data });
}
