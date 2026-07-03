let sessionId: string | null = null;

function getSessionId(): string {
  if (!sessionId) {
    if (typeof window === "undefined") return "";
    let id = sessionStorage.getItem("dx-session-id");
    if (!id) {
      id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      sessionStorage.setItem("dx-session-id", id);
    }
    sessionId = id;
  }
  return sessionId;
}

export function track(event: string, data?: Record<string, unknown>) {
  if (typeof window === "undefined") return;

  const payload = {
    event,
    data: data || {},
    page: window.location.pathname,
    session_id: getSessionId(),
  };

  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/analytics/track", JSON.stringify(payload));
  } else {
    fetch("/api/analytics/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  }
}

export function trackPageView() {
  if (typeof window === "undefined") return;
  track("page_view");
}
