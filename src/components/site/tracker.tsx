"use client";

import { useEffect } from "react";

/**
 * Tracker analytics leggero e rispettoso della privacy:
 * - registra views (per carica pagina + navigazioni soft)
 * - registra click su CTA (data-track) e per sezione (section[id])
 * - invia via sendBeacon a /api/events, che firma e inoltra a Convex
 * Nessun cookie, nessun fingerprinting.
 */
export function Tracker() {
  useEffect(() => {
    const sentViews = new Set<string>();

    const send = (payload: Record<string, unknown>) => {
      try {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        if (!navigator.sendBeacon?.("/api/events", blob)) {
          void fetch("/api/events", { method: "POST", body: blob, keepalive: true });
        }
      } catch {
        // mai bloccare la pagina per analytics
      }
    };

    const trackView = (path: string) => {
      if (sentViews.has(path)) return;
      sentViews.add(path);
      send({ type: "view", path, ref: document.referrer || undefined });
    };

    trackView(window.location.pathname);

    // navigazioni soft (pushState/replaceState/popstate)
    const wrap = (name: "pushState" | "replaceState") => {
      const orig = history[name];
      history[name] = function (...args: Parameters<typeof history.pushState>) {
        orig.apply(history, args);
        trackView(window.location.pathname);
      };
    };
    wrap("pushState");
    wrap("replaceState");
    const onPop = () => trackView(window.location.pathname);
    window.addEventListener("popstate", onPop);

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target?.closest) return;
      const tracked = target.closest("[data-track]");
      const section = target.closest("section[id]");
      const label =
        tracked?.getAttribute("data-track") ??
        (section?.id ? section.id : null) ??
        undefined;
      send({ type: "click", path: window.location.pathname, label });
    };
    document.addEventListener("click", onClick);

    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}
