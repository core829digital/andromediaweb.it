"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { portfolioSeed } from "@/lib/site-data";
import { cn } from "@/lib/utils";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

export interface ShowcaseItem {
  title: string;
  client: string;
  url: string;
  category: string;
  description?: string;
  imageUrl?: string;
}

/** Card progetto — effetto hover con zoom cover e riga di scan. */
export function WorkCard({ item, index }: { item: ShowcaseItem; index: number }) {
  return (
    <Reveal delay={(index % 3) * 0.08}>
      <Link
        href={item.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative flex h-full flex-col overflow-hidden border border-border bg-card transition-colors duration-500 hover:border-foreground"
      >
        {/* copertina */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          {item.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.imageUrl}
              alt={item.title}
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-muted" aria-hidden="true">
              <span className="font-heading text-6xl text-muted-foreground/20">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          )}
          <span className="micro-label absolute left-4 top-4 !text-[9px] !tracking-[0.3em] !text-foreground/80 bg-background/80 px-2 py-1 border border-border">
            {item.category}
          </span>
          {/* scan-line on hover */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px -translate-y-1 bg-foreground transition-transform duration-700 ease-out group-hover:translate-y-full"
          />
        </div>

        <div className="flex items-center justify-between gap-4 p-5">
          <div>
            <p className="font-heading text-lg uppercase">{item.title}</p>
            {item.description && (
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            )}
          </div>
          <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-border text-muted-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
            <Icon name="arrow-up-right" size={15} />
          </span>
        </div>
      </Link>
    </Reveal>
  );
}

/** Carica i lavori da Convex (client) con fallback statico. */
export function usePortfolioItems(): ShowcaseItem[] {
  const [items, setItems] = useState<ShowcaseItem[]>(portfolioSeed as unknown as ShowcaseItem[]);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    if (!convexUrl) return;
    (async () => {
      try {
        const { ConvexHttpClient } = await import("convex/browser");
        const c = new ConvexHttpClient(convexUrl);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const r = await c.query("portfolio:list" as any, {});
        const list = (r ?? []) as ShowcaseItem[];
        if (list.length > 0) setItems(list);
      } catch {
        // fallback statico
      }
    })();
  }, []);
  return items;
}

/** Griglia portfolio con "Carica altri" progressivo. */
export function PortfolioGrid({ initial = 6, step = 6 }: { initial?: number; step?: number }) {
  const items = usePortfolioItems();
  const [visible, setVisible] = useState(initial);
  const remaining = items.length - visible;

  return (
    <div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, visible).map((item, i) => (
          <WorkCard key={`${item.title}-${i}`} item={item} index={i} />
        ))}
      </div>

      {remaining > 0 && (
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => Math.min(items.length, v + step))}
            className="group flex h-12 items-center gap-3 rounded-full border border-border px-7 font-mono text-xs uppercase tracking-[0.22em] transition-colors duration-300 hover:border-foreground"
          >
            Carica altri
            <span className="text-muted-foreground">({remaining})</span>
            <Icon
              name="arrow-right"
              size={14}
              className="rotate-90 transition-transform duration-300 group-hover:translate-y-0.5"
            />
          </button>
        </div>
      )}
    </div>
  );
}

/** Countdown numerico per le statistiche. */
export function StatCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className={cn("border-l border-border pl-5")}>
      <p className="font-heading text-4xl md:text-5xl">{value}</p>
      <p className="micro-label mt-2">{label}</p>
    </div>
  );
}
