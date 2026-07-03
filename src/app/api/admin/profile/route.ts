import { supabaseAdmin, requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

const ALLOWED_UPDATE_FIELDS = ["status", "validationCode"] as const;

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const body = await req.json();
    const { userId, ...fields } = body;

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    for (const key of Object.keys(fields)) {
      if ((ALLOWED_UPDATE_FIELDS as readonly string[]).includes(key)) {
        const dbKey = key === "validationCode" ? "validation_code" : key;
        updates[dbKey] = fields[key];
      }
    }

    if (Object.keys(updates).length === 0) {
      return Response.json({ error: "Aucun champ valide à mettre à jour" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      console.error("PATCH /api/admin/profile error:", error.message);
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ profile: data });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("PATCH /api/admin/profile exception:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(userId);
    if (authError) {
      console.error("DELETE /api/admin/profile auth error:", authError.message);
      return Response.json({ error: authError.message }, { status: 500 });
    }

    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .delete()
      .eq("id", userId);
    if (profileError) {
      console.error("DELETE /api/admin/profile profile error:", profileError.message);
    }

    return Response.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("DELETE /api/admin/profile exception:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
