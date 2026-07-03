import { NextResponse } from "next/server";
import { supabaseAdmin, getAuthenticatedUser } from "@/lib/api-auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await getAuthenticatedUser();

    const { error } = await supabaseAdmin.from("events").insert({
      user_id: user?.id || null,
      event: body.event,
      data: body.data || {},
      page: body.page || null,
      session_id: body.session_id || null,
    });

    if (error) {
      console.error("Analytics error:", error);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: true });
  }
}
