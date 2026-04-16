import { API_BASE_URL, apiFetch } from "../src/lib/api";
import type {
  AutoApplyConfig,
  AutoApplyStats,
  JobLeadDto,
  AppNotification,
  Page,
} from "../types/autoapply.types";

// ── Config ────────────────────────────────────────────────────────────────────

export async function getAutoApplyConfig(): Promise<AutoApplyConfig | null> {
  try {
    return await apiFetch(`${API_BASE_URL}/api/v1/autoapply/config`);
  } catch {
    return null;
  }
}

export async function saveAutoApplyConfig(config: Partial<AutoApplyConfig>): Promise<AutoApplyConfig> {
  return apiFetch(`${API_BASE_URL}/api/v1/autoapply/config`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });
}

// ── Scan ──────────────────────────────────────────────────────────────────────

export async function triggerScan(): Promise<{ started: boolean; message: string }> {
  return apiFetch(`${API_BASE_URL}/api/v1/autoapply/scan`, { method: "POST" });
}

// ── Leads ─────────────────────────────────────────────────────────────────────

export async function getJobLeads(page = 0, size = 20): Promise<Page<JobLeadDto>> {
  return apiFetch(`${API_BASE_URL}/api/v1/autoapply/leads?page=${page}&size=${size}`);
}

export async function getJobLead(leadId: string): Promise<JobLeadDto> {
  return apiFetch(`${API_BASE_URL}/api/v1/autoapply/leads/${encodeURIComponent(leadId)}`);
}

export async function markLeadApplied(leadId: string): Promise<JobLeadDto> {
  return apiFetch(`${API_BASE_URL}/api/v1/autoapply/leads/${encodeURIComponent(leadId)}/apply`, {
    method: "POST",
  });
}

export async function skipLead(leadId: string): Promise<void> {
  await apiFetch(`${API_BASE_URL}/api/v1/autoapply/leads/${encodeURIComponent(leadId)}/skip`, {
    method: "POST",
  });
}

export async function regenerateTemplate(leadId: string): Promise<JobLeadDto> {
  return apiFetch(`${API_BASE_URL}/api/v1/autoapply/leads/${encodeURIComponent(leadId)}/regenerate-template`, {
    method: "POST",
  });
}

export async function getAutoApplyStats(): Promise<AutoApplyStats> {
  return apiFetch(`${API_BASE_URL}/api/v1/autoapply/stats`);
}

// ── Notifications ─────────────────────────────────────────────────────────────

export async function getNotifications(page = 0, size = 30): Promise<Page<AppNotification>> {
  return apiFetch(`${API_BASE_URL}/api/v1/notifications?page=${page}&size=${size}`);
}

export async function getUnreadCount(): Promise<number> {
  const data = await apiFetch(`${API_BASE_URL}/api/v1/notifications/unread-count`);
  return data.count as number;
}

export async function markAllNotificationsRead(): Promise<void> {
  const token = localStorage.getItem("token");
  await fetch(`${API_BASE_URL}/api/v1/notifications/mark-all-read`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token ?? ""}` },
  });
}

/**
 * Opens an SSE connection to the backend and calls `onEvent` for each event.
 * Returns a cleanup function that closes the connection.
 */
export function subscribeToNotifications(onEvent: (event: MessageEvent) => void): () => void {
  const token = localStorage.getItem("token");
  // EventSource doesn't support custom headers natively; pass token as query param
  const url = `${API_BASE_URL}/api/v1/notifications/stream?token=${encodeURIComponent(token ?? "")}`;
  const source = new EventSource(url);
  source.onmessage = onEvent;
  source.addEventListener("JOB_FOUND", onEvent);
  source.addEventListener("EMAIL_SENT", onEvent);
  source.addEventListener("AUTO_APPLIED", onEvent);
  source.addEventListener("MANUAL_REQUIRED", onEvent);
  source.addEventListener("APPLY_FAILED", onEvent);
  source.addEventListener("DAILY_SUMMARY", onEvent);
  source.addEventListener("SCAN_COMPLETE", onEvent);
  return () => source.close();
}
