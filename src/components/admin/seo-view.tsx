"use client";

import { useCallback, useEffect, useState } from "react";
import { readClient } from "./read-client";
import { settingSet } from "@/app/admin/write-actions";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

const SEO_ROUTES = [
  { key: "home", label: "Home" },
  { key: "servizi", label: "Servizi" },
  { key: "portfolio", label: "Portfolio" },
  { key: "chi-siamo", label: "Chi siamo" },
  { key: "contatti", label: "Contatti" },
  { key: "blog", label: "Blog" },
] as const;

interface MetaData {
  title: string;
  description: string;
  keywords: string;
  noindex: boolean;
}

const EMPTY: MetaData = { title: "", description: "", keywords: "", noindex: false };

export function SeoView() {
  const [data, setData] = useState<Record<string, MetaData>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const c = readClient();
    if (!c) {
      setLoading(false);
      return;
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const all = (await c.query("settings:listAll" as any, {})) as Record<string, any>;
      const out: Record<string, MetaData> = {};
      for (const r of SEO_ROUTES) {
        const raw = (all[`seo:${r.key}`] ?? {}) as Record<string, unknown>;
        out[r.key] = {
          title: String(raw.title ?? ""),
          description: String(raw.description ?? ""),
          keywords: String(raw.keywords ?? ""),
          noindex: raw.noindex === true,
        };
      }
      setData(out);
    } catch {
      // nessun override: campi vuoti = fallback statici
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(key: string) {
    const m = data[key];
    if (!m) return;
    setBusy(key);
    setMessage("");
    const r = await settingSet(`seo:${key}`, {
      title: m.title,
      description: m.description,
      keywords: m.keywords,
      noindex: m.noindex,
    });
    setBusy(null);
    setMessage(r.ok ? `SEO "${key}" salvata — cache del sito invalidata.` : `Errore: ${r.error}`);
  }

  function field(key: string, patch: Partial<MetaData>) {
    setData((prev) => ({ ...prev, [key]: { ...(prev[key] ?? EMPTY), ...patch } }));
  }

  const inputCls =
    "h-10 w-full border border-border bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground";

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl uppercase">SEO &amp; Metatags</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Titoli, descrizioni e keywords per ogni pagina. I campi vuoti usano i testi predefiniti del sito.
          L&apos;immagine di condivisione (og:image) è il logo MW — configurata a livello globale.
        </p>
      </div>

      {message && (
        <p className="flex items-center gap-2 border border-border bg-muted px-4 py-2 text-xs">
          <Icon name="check" size={13} /> {message}
        </p>
      )}

      {loading ? (
        <p className="micro-label p-16 text-center">Caricamento…</p>
      ) : (
        <div className="space-y-6">
          {SEO_ROUTES.map((r) => {
            const m = data[r.key] ?? EMPTY;
            return (
              <div key={r.key} className="border border-border p-6">
                <div className="mb-5 flex items-center justify-between gap-4">
                  <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
                    /{r.key === "home" ? "" : r.key} — {r.label}
                  </p>
                  <button
                    onClick={() => save(r.key)}
                    disabled={busy === r.key}
                    className="flex h-9 items-center gap-2 rounded-full bg-foreground px-5 font-mono text-[10px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-muted-foreground disabled:opacity-50"
                  >
                    <Icon name="check" size={12} /> {busy === r.key ? "Salvataggio…" : "Salva"}
                  </button>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className={cn("micro-label", "mb-1.5 block")}>Title tag</label>
                    <input
                      value={m.title}
                      maxLength={120}
                      placeholder="es. Servizi — Andromedia Web"
                      onChange={(e) => field(r.key, { title: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="micro-label mb-1.5 block">Meta description</label>
                    <textarea
                      rows={2}
                      value={m.description}
                      maxLength={300}
                      placeholder="Descrizione mostrata sui motori di ricerca (max 160 caratteri consigliati)"
                      onChange={(e) => field(r.key, { description: e.target.value })}
                      className="w-full border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground"
                    />
                  </div>
                  <div>
                    <label className="micro-label mb-1.5 block">Keywords (separate da virgola)</label>
                    <input
                      value={m.keywords}
                      maxLength={400}
                      placeholder="es. web agency, arezzo, siti web"
                      onChange={(e) => field(r.key, { keywords: e.target.value })}
                      className={inputCls}
                    />
                  </div>
                  <label className="flex cursor-pointer items-end gap-3 pb-2 text-sm">
                    <input
                      type="checkbox"
                      checked={m.noindex}
                      onChange={(e) => field(r.key, { noindex: e.target.checked })}
                      className="h-4 w-4 accent-black dark:accent-white"
                    />
                    noindex (escludi dai motori di ricerca)
                  </label>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
