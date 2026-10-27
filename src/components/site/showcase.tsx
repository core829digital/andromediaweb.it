"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { portfolioSeed, clientNames } from "@/lib/site-data";
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

/** Card progetto — sviluppa effetto hover smooth con riga di scan. */
export function WorkCard({ item, index }: { item: ShowcaseItem; index: number }) {
  return (
    <Reveal delay={(index % 3) * 0.08}>
      <Link
        href={item.url || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="group relative block overflow-hidden border border-border bg-card transition-colors duration-500 hover:border-foreground"
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
            <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
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

/** Griglia dataset server/Convex/client. */
function useShowcase(
  fetcher: () => Promise<ShowcaseItem[]>,
  fallback: ShowcaseItem[]
): ShowcaseItem[] {
  const [items, setItems] = useState<ShowcaseItem[]>(fallback);
  const done = useRef(false);
  useEffect(() => {
    if (done.current) return;
    done.current = true;
    fetcher()
      .then((r) => {
        if (r.length > 0) setItems(r);
      })
      .catch(() => void 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return items;
}

export function PortfolioSection({ limit = 6 }: { limit?: number }) {
  const items = useShowcase(async () => {
    if (!convexUrl) return [];
    const { ConvexHttpClient } = await import("convex/browser");
    const c = new ConvexHttpClient(convexUrl);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const r = await c.query("portfolio:list" as any, {});
    return (r ?? []) as ShowcaseItem[];
  }, portfolioSeed as unknown as ShowcaseItem[]);

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.slice(0, limit).map((item, i) => (
        <WorkCard key={`${item.title}-${i}`} item={item} index={i} />
      ))}
    </div>
  );
}

/* ---------------- Blog rendering ---------------- */

export interface PostItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl?: string;
  tags?: string[];
  status: "draft" | "published";
  createdAt: number;
}

export function BlogGrid({ posts }: { posts: PostItem[] }) {
  if (posts.length === 0) {
    return (
      <div className="border border-dashed border-border p-14 text-center">
        <p className="font-heading text-xl uppercase text-muted-foreground">
          Nessun post pubblicato — a presto.
        </p>
        <p className="micro-label mt-3">In orbita:_payload in arrivo</p>
      </div>
    );
  }
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((p, i) => (
        <Reveal key={p._id} delay={(i % 3) * 0.08}>
          <Link
            href={`/blog/${p.slug}`}
            className="group block border border-border transition-colors duration-500 hover:border-foreground"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
              {p.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.coverUrl}
                  alt={p.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              ) : (
                <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
              )}
            </div>
            <div className="p-5">
              <p className="micro-label mb-2">
                {new Date(p.createdAt).toLocaleDateString("it-IT", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </p>
              <h3 className="font-heading text-lg uppercase leading-snug group-hover:underline">
                {p.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{p.excerpt}</p>
              <span className="mt-4 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:text-foreground">
                Leggi <Icon name="arrow-right" size={12} />
              </span>
            </div>
          </Link>
        </Reveal>
      ))}
    </div>
  );
}

export function HomeFeatureMarquee() {
  return (
    <div className="relative overflow-hidden py-6">
      <div className="animate-marquee flex w-max items-center gap-14 pr-14">
        {[...clientNames, ...clientNames].map((n, i) => (
          <span
            key={i}
            className="flex items-center gap-3 whitespace-nowrap font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground"
          >
            <span className="inline-block h-1 w-1 rounded-full bg-foreground/50" />
            {n}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Countdown numerico per le >_ statistiche. */
export function StatCounter({ value, label }: { value: string; label: string }) {
  return (
    <div className={cn("border-l border-border pl-5")}>
      <p className="font-heading text-4xl md:text-5xl">{value}</p>
      <p className="micro-label mt-2">{label}</p>
    </div>
  );
}
