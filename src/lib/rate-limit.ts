import { supabaseAdmin } from "./api-auth";

export async function checkRateLimit(
  key: string,
  maxRequests: number = 10,
  windowMs: number = 60000
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.rpc("check_rate_limit", {
      p_key: key,
      p_max_requests: maxRequests,
      p_window_ms: windowMs,
    });

    if (error) {
      console.error("Rate limit RPC error:", error.message);
      return true;
    }

    return data ?? true;
  } catch (e) {
    console.error("Rate limit check error:", e);
    return true;
  }
}
