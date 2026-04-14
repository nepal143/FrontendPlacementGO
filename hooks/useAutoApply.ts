"use client";

import { useState, useEffect, useCallback } from "react";
import type {
  AutoApplyConfig,
  AutoApplyStats,
  JobLeadDto,
  AppNotification,
  Page,
} from "../types/autoapply.types";
import {
  getAutoApplyConfig,
  saveAutoApplyConfig,
  triggerScan,
  getJobLeads,
  markLeadApplied,
  skipLead,
  regenerateTemplate,
  getAutoApplyStats,
  getNotifications,
  getUnreadCount,
  markAllNotificationsRead,
  subscribeToNotifications,
} from "../services/autoapply.service";

export function useAutoApply() {
  const [config, setConfig] = useState<AutoApplyConfig | null>(null);
  const [stats, setStats] = useState<AutoApplyStats | null>(null);
  const [leadsPage, setLeadsPage] = useState<Page<JobLeadDto> | null>(null);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [scanPending, setScanPending] = useState(false);
  const [savingConfig, setSavingConfig] = useState(false);
  const [loadingLeads, setLoadingLeads] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  // ── Load initial data ─────────────────────────────────────────────────────

  const loadAll = useCallback(async () => {
    try {
      const [cfg, st, leads, notifs, uc] = await Promise.all([
        getAutoApplyConfig(),
        getAutoApplyStats(),
        getJobLeads(0),
        getNotifications(0),
        getUnreadCount(),
      ]);
      setConfig(cfg);
      setStats(st);
      setLeadsPage(leads);
      setNotifications(notifs.content);
      setUnreadCount(uc);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load");
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // ── SSE subscription ──────────────────────────────────────────────────────

  useEffect(() => {
    const cleanup = subscribeToNotifications((event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        const newNotif: AppNotification = {
          id: event.lastEventId || crypto.randomUUID(),
          type: data.type,
          title: data.title,
          message: data.message,
          metadata: data.metadata,
          isRead: false,
          createdAt: new Date().toISOString(),
        };
        setNotifications((prev) => [newNotif, ...prev]);
        setUnreadCount((c) => c + 1);
        // Refresh stats when new leads arrive
        if (data.type === "JOB_FOUND" || data.type === "EMAIL_SENT" || data.type === "MANUAL_REQUIRED") {
          getAutoApplyStats().then(setStats).catch(() => {});
          getJobLeads(0).then(setLeadsPage).catch(() => {});
        }
        // JOB_FOUND = scan complete
        if (data.type === "JOB_FOUND") {
          setScanPending(false);
        }
      } catch {
        // ignore malformed events
      }
    });
    return cleanup;
  }, []);

  // ── Actions ───────────────────────────────────────────────────────────────

  const updateConfig = useCallback(async (updates: Partial<AutoApplyConfig>) => {
    setSavingConfig(true);
    try {
      const saved = await saveAutoApplyConfig(updates);
      setConfig(saved);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save config");
    } finally {
      setSavingConfig(false);
    }
  }, []);

  const scan = useCallback(async () => {
    setScanning(true);
    setError(null);
    try {
      await triggerScan();
      // Scan is async on the backend — leads will arrive via SSE notifications.
      // Just mark scan as pending; JOB_FOUND event will clear it.
      setScanPending(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setScanning(false);
    }
  }, []);

  const applyToLead = useCallback(async (leadId: string) => {
    await markLeadApplied(leadId);
    const [st, leads] = await Promise.all([getAutoApplyStats(), getJobLeads(page)]);
    setStats(st);
    setLeadsPage(leads);
  }, [page]);

  const skipALead = useCallback(async (leadId: string) => {
    await skipLead(leadId);
    const [st, leads] = await Promise.all([getAutoApplyStats(), getJobLeads(page)]);
    setStats(st);
    setLeadsPage(leads);
  }, [page]);

  const regenTemplate = useCallback(async (leadId: string) => {
    const updated = await regenerateTemplate(leadId);
    setLeadsPage((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        content: prev.content.map((l) => (l.id === leadId ? updated : l)),
      };
    });
  }, []);

  const loadMoreLeads = useCallback(async (nextPage: number) => {
    setLoadingLeads(true);
    try {
      const leads = await getJobLeads(nextPage);
      setLeadsPage(leads);
      setPage(nextPage);
    } finally {
      setLoadingLeads(false);
    }
  }, []);

  const markAllRead = useCallback(async () => {
    await markAllNotificationsRead();
    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }, []);

  return {
    config,
    stats,
    leadsPage,
    notifications,
    unreadCount,
    scanning,
    scanPending,
    savingConfig,
    loadingLeads,
    error,
    page,
    updateConfig,
    scan,
    applyToLead,
    skipALead,
    regenTemplate,
    loadMoreLeads,
    markAllRead,
    reload: loadAll,
  };
}
