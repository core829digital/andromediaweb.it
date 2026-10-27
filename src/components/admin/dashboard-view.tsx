"use client";

import { useCallback, useEffect, useState } from "react";
import { readClient } from "./read-client";
import { StatCard, TimelineChart, HBars, type SeriesPoint } from "./charts";
import { Icon } from "@/components/icons";
import { eventsPurge } from "@/app/admin/write-actions";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface Summary {
  viewsToday: number;
  clicksToday: number;
  views7: number;
  clicks7: number;
  views30: number;
  clicks30: number;
  ctr30: number;
  total: number;
}

export function DashboardView() {
  const [days, setDays] = useState<7 | 30>(30);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [series, setSeries] = useState<SeriesPoint[]>([]);
  const [topPaths, setTopPaths] = useState<Array<{ path: string; count: number }>>([]);
  const [topLabels, setTopLabels] = useState<Array<{ label: string; count: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const c = readClient();
    if (!c) {
      setLoading(false);
      return;
    }
    try {
      const [s, ts, tp, tl] = await Promise.all([
        c.query("events:summary" as any, {}) as Promise<Summary>,
        c.query("events:timeseries" as any, { days }) as Promise<SeriesPoint[]>,
        c.query("events:topPaths" as any, { days, limit: 8 }) as Promise<Array<{ path: string; count: number }>>,
        c.query("events:topLabels" as any, { days, limit: 8 }) as Promise<Array<{ label: string; count: number }>>,
      ]);
      setSummary(s ?? null);
      setSeries(ts ?? []);
      setTopPaths(tp ?? []);
      setTopLabels(tl ?? []);
    } catch {
      // dati non disponibili
    } finally {
      setLoading(false);
    }
  }, [days]);

  useEffect(() => {
    void load();
  }, [load]);

  async function purge() {
    if (!confirm("Eliminare gli eventi più vecchi di 90 giorni?")) return;
    setBusy(true);
    await eventsPurge();
    await load();
    setBusy(false);
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-2xl uppercase">Dashboard — statistiche del sito</h2>
        <div className="flex items-center gap-2">
          {([7, 30] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={cn(
                "h-9 border px-4 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors",
                days === d ? "border-foreground text-foreground" : "border-border text-muted-foreground hover:text-foreground"
              )}
            >
              {d} giorni
            </button>
          ))}
          <button
            onClick={purge}
            disabled={busy}
            title="Elimina eventi più vecchi di 90 giorni"
            className="flex h-9 items-center gap-2 border border-border px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground disabled:opacity-50"
          >
            <Icon name="trash" size={12} /> Pulizia
          </button>
        </div>
      </div>

      {loading ? (
        <p className="micro-label p-16 text-center">Caricamento statistiche…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard label="Views oggi" value={summary?.viewsToday ?? 0} hint="giorni correnti" />
            <StatCard label="Click oggi" value={summary?.clicksToday ?? 0} hint="CTA e sezioni" />
            <StatCard label={`Views ${days}gg`} value={days === 7 ? (summary?.views7 ?? 0) : (summary?.views30 ?? 0)} hint="visualizzazioni" />
            <StatCard
              label="CTR"
              value={(summary?.ctr30 ?? 0) + "%"}
              hint={`click su ${summary?.views30 ?? 0} views (30gg)`}
            />
          </div>

          <div className="border border-border p-6">
            <p className="micro-label mb-6">Timeline — visualizzazioni e click</p>
            <TimelineChart data={series} />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="border border-border p-6">
              <p className="micro-label mb-6">Pagine più viste ({days}gg)</p>
              <HBars items={topPaths.map((p) => ({ label: p.path, count: p.count }))} emptyLabel="Nessuna visita registrata." />
            </div>
            <div className="border border-border p-6">
              <p className="micro-label mb-6">Click per zona ({days}gg)</p>
              <HBars items={topLabels.map((l) => ({ label: l.label, count: l.count }))} emptyLabel="Nessun click registrato." />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
