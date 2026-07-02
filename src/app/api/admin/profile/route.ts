import { supabaseAdmin, requireAdmin } from "@/lib/api-auth";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request) {
  const auth = await requireAdmin();
  if (auth.error) return auth.error;

  try {
    const { userId, status, validationCode } = await req.json();

    if (!userId) {
      return Response.json({ error: "Missing userId" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};
    if (validationCode) {
      // Approval: stocker le code sans activer le compte
      updates.validation_code = validationCode;
      updates.status = "pending";
    } else if (status) {
      updates.status = status;
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

    const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);

    if (error) {
      console.error("DELETE /api/admin/profile error:", error.message);
      return Response.json({ error: error.message }, { status: 500 });
    }
    return Response.json({ success: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("DELETE /api/admin/profile exception:", msg);
    return Response.json({ error: msg }, { status: 500 });
  }
}
