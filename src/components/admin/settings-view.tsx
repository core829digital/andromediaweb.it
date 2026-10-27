"use client";

import { useCallback, useEffect, useState } from "react";
import { readClient } from "./read-client";
import { settingSet } from "@/app/admin/write-actions";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";

/* eslint-disable @typescript-eslint/no-explicit-any */

type SubTab = "generale" | "home" | "faq";

interface GlobalForm {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  socials: Array<{ name: string; href: string }>;
  toggles: { marquee: boolean; heroBadges: boolean; spaceCta: boolean };
}

interface HomeForm {
  hero: {
    microLabel: string;
    titleA: string;
    titleB: string;
    subtitle: string;
    ctaPrimaryLabel: string;
    ctaSecondaryLabel: string;
  };
  servizi: { label: string; title: string };
  lavori: { label: string; title: string };
  processo: { label: string; title: string };
  visione: { label: string; title: string };
  faq: { label: string; title: string };
}

interface FaqItem {
  q: string;
  a: string;
}

const inputCls =
  "h-10 w-full border border-border bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground";
const areaCls =
  "w-full border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground";

export function SettingsView() {
  const [sub, setSub] = useState<SubTab>("generale");
  const [global, setGlobal] = useState<GlobalForm | null>(null);
  const [home, setHome] = useState<HomeForm | null>(null);
  const [faq, setFaq] = useState<FaqItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
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
      const g = all["global"] ?? {};
      const gc = g.contact ?? {};
      const h = (all["content:home"] ?? {}) as Record<string, any>;
      const hero = h.hero ?? {};
      const f = all["content:faq"]?.items;

      setGlobal({
        name: String(g.name ?? ""),
        tagline: String(g.tagline ?? ""),
        email: String(gc.email ?? ""),
        phone: String(gc.phone ?? ""),
        address: String(gc.address ?? ""),
        socials: Array.isArray(g.socials)
          ? g.socials.map((s: any) => ({ name: String(s.name ?? ""), href: String(s.href ?? "") }))
          : [],
        toggles: {
          marquee: g.toggles?.marquee !== false,
          heroBadges: g.toggles?.heroBadges !== false,
          spaceCta: g.toggles?.spaceCta !== false,
        },
      });
      const sec = (k: string) => ({ label: String(h[k]?.label ?? ""), title: String(h[k]?.title ?? "") });
      setHome({
        hero: {
          microLabel: String(hero.microLabel ?? ""),
          titleA: String(hero.titleA ?? ""),
          titleB: String(hero.titleB ?? ""),
          subtitle: String(hero.subtitle ?? ""),
          ctaPrimaryLabel: String(hero.ctaPrimary?.label ?? ""),
          ctaSecondaryLabel: String(hero.ctaSecondary?.label ?? ""),
        },
        servizi: sec("servizi"),
        lavori: sec("lavori"),
        processo: sec("processo"),
        visione: sec("visione"),
        faq: sec("faq"),
      });
      setFaq(
        Array.isArray(f)
          ? f.map((x: any) => ({ q: String(x.q ?? ""), a: String(x.a ?? "") }))
          : null
      );
    } catch {
      // fallback: form vuoti = valori statici
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function save(kind: "global" | "home" | "faq") {
    setBusy(true);
    setMessage("");
    try {
      if (kind === "global" && global) {
        const r = await settingSet("global", {
          name: global.name,
          tagline: global.tagline,
          contact: { email: global.email, phone: global.phone, address: global.address },
          socials: global.socials.filter((s) => s.name && s.href),
          toggles: global.toggles,
        });
        if (!r.ok) throw new Error(r.error);
      }
      if (kind === "home" && home) {
        const r = await settingSet("content:home", {
          hero: {
            microLabel: home.hero.microLabel,
            titleA: home.hero.titleA,
            titleB: home.hero.titleB,
            subtitle: home.hero.subtitle,
            ctaPrimary: { label: home.hero.ctaPrimaryLabel },
            ctaSecondary: { label: home.hero.ctaSecondaryLabel },
          },
          servizi: home.servizi,
          lavori: home.lavori,
          processo: home.processo,
          visione: home.visione,
          faq: home.faq,
        });
        if (!r.ok) throw new Error(r.error);
      }
      if (kind === "faq" && faq) {
        const r = await settingSet("content:faq", { items: faq.filter((x) => x.q && x.a) });
        if (!r.ok) throw new Error(r.error);
      }
      setMessage("Salvato — cache del sito invalidata, ricarica le pagine per vedere i cambiamenti.");
    } catch (err) {
      setMessage(`Errore: ${err instanceof Error ? err.message : "sconosciuto"}`);
    } finally {
      setBusy(false);
    }
  }

  const label = "micro-label mb-1.5 block";

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-2xl uppercase">Impostazioni del sito</h2>
        <div className="flex gap-1">
          {(["generale", "home", "faq"] as SubTab[]).map((t) => (
            <button
              key={t}
              onClick={() => setSub(t)}
              className={cn(
                "relative px-4 py-2 font-mono text-[10px] uppercase tracking-[0.22em] transition-colors",
                sub === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
              {sub === t && <span className="absolute inset-x-2 bottom-0 h-0.5 bg-foreground" />}
            </button>
          ))}
        </div>
      </div>

      {message && (
        <p className="flex items-center gap-2 border border-border bg-muted px-4 py-2 text-xs">
          <Icon name="check" size={13} /> {message}
        </p>
      )}

      {loading ? (
        <p className="micro-label p-16 text-center">Caricamento…</p>
      ) : (
        <>
          {/* ---------- Generale ---------- */}
          {sub === "generale" && global && (
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className={label}>Nome del sito</label>
                  <input value={global.name} maxLength={80} placeholder="Andromedia Web" onChange={(e) => setGlobal({ ...global, name: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={label}>Tagline / claim</label>
                  <input value={global.tagline} maxLength={120} placeholder="The future is now" onChange={(e) => setGlobal({ ...global, tagline: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={label}>Email pubblica</label>
                  <input value={global.email} maxLength={200} placeholder="info@andromediaweb.it" onChange={(e) => setGlobal({ ...global, email: e.target.value })} className={inputCls} />
                </div>
                <div>
                  <label className={label}>Telefono</label>
                  <input value={global.phone} maxLength={40} placeholder="(+39) 351 672 8359" onChange={(e) => setGlobal({ ...global, phone: e.target.value })} className={inputCls} />
                </div>
                <div className="md:col-span-2">
                  <label className={label}>Indirizzo (footer)</label>
                  <input value={global.address} maxLength={200} placeholder="Corso Vittorio Emanuele, 37 — Foiano della Chiana" onChange={(e) => setGlobal({ ...global, address: e.target.value })} className={inputCls} />
                </div>
              </div>

              <div className="border border-border p-5">
                <p className="micro-label mb-4">Canali social (footer)</p>
                <div className="space-y-3">
                  {global.socials.map((s, i) => (
                    <div key={i} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
                      <input value={s.name} maxLength={40} placeholder="Nome" onChange={(e) => { const socials = [...global.socials]; socials[i] = { ...s, name: e.target.value }; setGlobal({ ...global, socials }); }} className={inputCls} />
                      <input value={s.href} maxLength={300} placeholder="https://…" onChange={(e) => { const socials = [...global.socials]; socials[i] = { ...s, href: e.target.value }; setGlobal({ ...global, socials }); }} className={inputCls} />
                      <button
                        type="button"
                        onClick={() => setGlobal({ ...global, socials: global.socials.filter((_, j) => j !== i) })}
                        title="Rimuovi"
                        className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                      >
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  ))}
                  {global.socials.length < 6 && (
                    <button
                      type="button"
                      onClick={() => setGlobal({ ...global, socials: [...global.socials, { name: "", href: "" }] })}
                      className="flex h-9 items-center gap-2 border border-border px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      <Icon name="plus" size={12} /> Aggiungi social
                    </button>
                  )}
                </div>
              </div>

              <div className="border border-border p-5">
                <p className="micro-label mb-4">Interruttori componenti</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  {([
                    ["marquee", "Fila partner nell'hero"],
                    ["heroBadges", "Marker HUD nell'hero"],
                    ["spaceCta", "CTA finale a campo stellare"],
                  ] as const).map(([k, l]) => (
                    <label key={k} className="flex cursor-pointer items-center gap-3 text-sm">
                      <input
                        type="checkbox"
                        checked={global.toggles[k]}
                        onChange={(e) => setGlobal({ ...global, toggles: { ...global.toggles, [k]: e.target.checked } })}
                        className="h-4 w-4 accent-black dark:accent-white"
                      />
                      {l}
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => save("global")}
                disabled={busy}
                className="flex h-10 items-center gap-2 rounded-full bg-foreground px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-background transition-colors hover:bg-muted-foreground disabled:opacity-50"
              >
                {busy ? "Salvataggio…" : "Salva impostazioni"}
              </button>
            </div>
          )}

          {/* ---------- Home ---------- */}
          {sub === "home" && home && (
            <div className="space-y-6">
              <div className="border border-border p-5">
                <p className="micro-label mb-4">Hero</p>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={label}>Micro-label (sopra il titolo)</label>
                    <input value={home.hero.microLabel} maxLength={80} placeholder="Consulenza Creativa" onChange={(e) => setHome({ ...home, hero: { ...home.hero, microLabel: e.target.value } })} className={inputCls} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className={label}>Titolo riga 1</label>
                      <input value={home.hero.titleA} maxLength={40} placeholder="Eleva il tuo" onChange={(e) => setHome({ ...home, hero: { ...home.hero, titleA: e.target.value } })} className={inputCls} />
                    </div>
                    <div>
                      <label className={label}>Titolo riga 2 (outline)</label>
                      <input value={home.hero.titleB} maxLength={40} placeholder="Brand" onChange={(e) => setHome({ ...home, hero: { ...home.hero, titleB: e.target.value } })} className={inputCls} />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className={label}>Sottotitolo</label>
                    <textarea rows={2} value={home.hero.subtitle} maxLength={400} onChange={(e) => setHome({ ...home, hero: { ...home.hero, subtitle: e.target.value } })} className={areaCls} />
                  </div>
                  <div>
                    <label className={label}>CTA principale (etichetta)</label>
                    <input value={home.hero.ctaPrimaryLabel} maxLength={60} placeholder="Prenota una call" onChange={(e) => setHome({ ...home, hero: { ...home.hero, ctaPrimaryLabel: e.target.value } })} className={inputCls} />
                  </div>
                  <div>
                    <label className={label}>CTA secondaria (etichetta)</label>
                    <input value={home.hero.ctaSecondaryLabel} maxLength={60} placeholder="Esplora i servizi" onChange={(e) => setHome({ ...home, hero: { ...home.hero, ctaSecondaryLabel: e.target.value } })} className={inputCls} />
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {([
                  ["servizi", "Sezione Servizi"],
                  ["lavori", "Sezione Lavori"],
                  ["processo", "Sezione Processo"],
                  ["visione", "Sezione Visione"],
                  ["faq", "Sezione FAQ"],
                ] as const).map(([k, titolo]) => (
                  <div key={k} className="border border-border p-5">
                    <p className="micro-label mb-4">{titolo}</p>
                    <label className={label}>Label</label>
                    <input value={home[k].label} maxLength={120} onChange={(e) => setHome({ ...home, [k]: { ...home[k], label: e.target.value } })} className={inputCls} />
                    <label className={cn(label, "mt-3")}>Titolo</label>
                    <input value={home[k].title} maxLength={160} onChange={(e) => setHome({ ...home, [k]: { ...home[k], title: e.target.value } })} className={inputCls} />
                  </div>
                ))}
              </div>

              <button
                onClick={() => save("home")}
                disabled={busy}
                className="flex h-10 items-center gap-2 rounded-full bg-foreground px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-background transition-colors hover:bg-muted-foreground disabled:opacity-50"
              >
                {busy ? "Salvataggio…" : "Salva contenuti home"}
              </button>
            </div>
          )}

          {/* ---------- FAQ ---------- */}
          {sub === "faq" && faq && (
            <div className="space-y-6">
              <div className="space-y-4">
                {faq.map((item, i) => (
                  <div key={i} className="border border-border p-5">
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</span>
                      <div className="flex-1 space-y-3">
                        <input value={item.q} maxLength={200} placeholder="Domanda" onChange={(e) => { const next = [...faq]; next[i] = { ...item, q: e.target.value }; setFaq(next); }} className={inputCls} />
                        <textarea rows={3} value={item.a} maxLength={1200} placeholder="Risposta" onChange={(e) => { const next = [...faq]; next[i] = { ...item, a: e.target.value }; setFaq(next); }} className={areaCls} />
                      </div>
                      <button
                        type="button"
                        onClick={() => setFaq(faq.filter((_, j) => j !== i))}
                        title="Elimina"
                        className="flex h-9 w-9 shrink-0 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                      >
                        <Icon name="trash" size={13} />
                      </button>
                    </div>
                  </div>
                ))}
                {faq.length < 20 && (
                  <button
                    type="button"
                    onClick={() => setFaq([...faq, { q: "", a: "" }])}
                    className="flex h-9 items-center gap-2 border border-border px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                  >
                    <Icon name="plus" size={12} /> Aggiungi domanda
                  </button>
                )}
              </div>

              <button
                onClick={() => save("faq")}
                disabled={busy}
                className="flex h-10 items-center gap-2 rounded-full bg-foreground px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-background transition-colors hover:bg-muted-foreground disabled:opacity-50"
              >
                {busy ? "Salvataggio…" : "Salva FAQ"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
