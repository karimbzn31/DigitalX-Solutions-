import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request) {
  const { userId, status, validationCode } = await req.json();

  if (!userId || !status) {
    return Response.json({ error: "Missing userId or status" }, { status: 400 });
  }

  const updates: Record<string, unknown> = { status };
  if (validationCode) {
    updates.validation_code = validationCode;
  }

  const { data, error } = await supabaseAdmin
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ profile: data });
}

export async function DELETE(req: Request) {
  const { userId } = await req.json();

  if (!userId) {
    return Response.json({ error: "Missing userId" }, { status: 400 });
  }

  // Delete from auth (this cascades to profiles)
  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true });
}
