import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function PATCH(req: Request) {
  try {
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
