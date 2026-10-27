"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

/* ========================= Linea temporale ========================= */

export interface SeriesPoint {
  day: string;
  views: number;
  clicks: number;
}

/** Grafico a linea/area SVG per la timeline views+clicks. */
export function TimelineChart({
  data,
  className,
}: {
  data: SeriesPoint[];
  className?: string;
}) {
  const W = 640;
  const H = 220;
  const PAD_L = 34;
  const PAD_R = 10;
  const PAD_T = 14;
  const PAD_B = 26;

  const { max, viewsPath, viewsArea, clicksPath, ticks, xFor, yFor } = useMemo(() => {
    const maxV = Math.max(4, ...data.map((d) => Math.max(d.views, d.clicks)));
    const max = Math.ceil(maxV / 4) * 4;
    const n = Math.max(data.length, 2);
    const xFor = (i: number) => PAD_L + (i * (W - PAD_L - PAD_R)) / (n - 1);
    const yFor = (v: number) => PAD_T + (1 - v / max) * (H - PAD_T - PAD_B);

    const line = (get: (d: SeriesPoint) => number) =>
      data.map((d, i) => `${i === 0 ? "M" : "L"}${xFor(i).toFixed(1)} ${yFor(get(d)).toFixed(1)}`).join(" ");
    const viewsPath = line((d) => d.views);
    const clicksPath = line((d) => d.clicks);
    const viewsArea =
      data.length > 0
        ? `${viewsPath} L${xFor(data.length - 1).toFixed(1)} ${(H - PAD_B).toFixed(1)} L${PAD_L} ${(H - PAD_B).toFixed(1)} Z`
        : "";
    const ticks = [0, max / 2, max];
    return { max, viewsPath, viewsArea, clicksPath, ticks, xFor, yFor };
  }, [data]);

  if (data.length === 0) {
    return <p className="micro-label p-8 text-center">Nessun dato ancora — la timeline si riempirà man mano.</p>;
  }

  return (
    <figure className={cn("w-full", className)}>
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Timeline visualizzazioni e click">
        {/* griglia */}
        {ticks.map((t, i) => (
          <g key={i}>
            <line x1={PAD_L} x2={W - PAD_R} y1={yFor(t)} y2={yFor(t)} stroke="currentColor" strokeOpacity={0.12} strokeDasharray={i === 0 ? undefined : "2 4"} />
            <text x={PAD_L - 6} y={yFor(t) + 3} textAnchor="end" className="fill-current font-mono" fontSize={8} opacity={0.5}>
              {Math.round(t)}
            </text>
          </g>
        ))}
        {/* area views */}
        <path d={viewsArea} fill="currentColor" opacity={0.07} />
        {/* linea views */}
        <path d={viewsPath} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinejoin="round" />
        {/* linea clicks */}
        <path d={clicksPath} fill="none" stroke="currentColor" strokeWidth={1.2} strokeDasharray="4 4" opacity={0.55} strokeLinejoin="round" />
        {/* etichette date */}
        <text x={PAD_L} y={H - 8} className="fill-current font-mono" fontSize={8} opacity={0.5}>
          {data[0]?.day.slice(5)}
        </text>
        <text x={W - PAD_R} y={H - 8} textAnchor="end" className="fill-current font-mono" fontSize={8} opacity={0.5}>
          {data[data.length - 1]?.day.slice(5)}
        </text>
      </svg>
      <figcaption className="mt-3 flex items-center gap-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <span className="flex items-center gap-2">
          <span className="inline-block h-0.5 w-5 bg-foreground" /> Visualizzazioni
        </span>
        <span className="flex items-center gap-2">
          <span className="inline-block h-0.5 w-5 bg-foreground/40 [background-image:repeating-linear-gradient(90deg,currentColor_0_3px,transparent_3px_6px)]" /> Click
        </span>
      </figcaption>
    </figure>
  );
}

/* ========================= Barre orizzontali ========================= */

export function HBars({
  items,
  emptyLabel = "Nessun dato.",
  className,
}: {
  items: Array<{ label: string; count: number }>;
  emptyLabel?: string;
  className?: string;
}) {
  if (items.length === 0) {
    return <p className="micro-label p-8 text-center">{emptyLabel}</p>;
  }
  const max = Math.max(...items.map((i) => i.count), 1);
  return (
    <div className={cn("space-y-3", className)}>
      {items.map((it, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-40 shrink-0 truncate font-mono text-[10px] text-muted-foreground" title={it.label}>
            {it.label}
          </span>
          <div className="h-2.5 flex-1 overflow-hidden bg-muted">
            <div
              className="h-full bg-foreground transition-all duration-700"
              style={{ width: `${Math.max(3, (it.count / max) * 100)}%` }}
            />
          </div>
          <span className="w-10 text-right font-mono text-[10px] text-muted-foreground">{it.count}</span>
        </div>
      ))}
    </div>
  );
}

/* ========================= Stat card ========================= */

export function StatCard({
  label,
  value,
  hint,
  className,
}: {
  label: string;
  value: string | number;
  hint?: string;
  className?: string;
}) {
  return (
    <div className={cn("border border-border p-5", className)}>
      <p className="micro-label">{label}</p>
      <p className="mt-3 font-heading text-3xl tabular-nums">{value}</p>
      {hint && <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{hint}</p>}
    </div>
  );
}
