"use client";

import { useCallback, useEffect, useState } from "react";
import { readClient } from "./read-client";
import { StatCard } from "./charts";
import { Icon } from "@/components/icons";

/* eslint-disable @typescript-eslint/no-explicit-any */

interface AuditRow {
  _id: string;
  actor: string;
  action: string;
  target: string;
  detail?: string;
  ts: number;
}

const DEFENSES = [
  { label: "Sessioni amministratore", detail: "Cookie HttpOnly firmato HMAC-SHA256, scadenza 7 giorni" },
  { label: "Guardia Convex", detail: "Le mutation di scrittura accettano solo firme dal server Next (segreto mai nel bundle)" },
  { label: "Firma eventi", detail: "HMAC-SHA256 sul corpo: Convex riverifica che gli analytics vengano dal nostro server" },
  { label: "Anti-replay", detail: "Timestamp dell'evento validato entro una finestra di 5 minuti" },
  { label: "Rate limiting", detail: "Login 5/15min, contatti 5/10min, eventi 60/min per IP — anti-DDoS e anti-flood" },
  { label: "Input validation", detail: "Whitelist campi, lunghezze massime, formato email/slug/URL verificato su server e su Convex" },
  { label: "XSS prevention", detail: "Sanitizzazione di ogni stringa (tag, control char, javascript:) alla fonte" },
  { label: "Registro audit", detail: "Ogni azione amministrativa e ogni accesso è tracciato qui sotto" },
];

export function SecurityView() {
  const [rows, setRows] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const c = readClient();
    if (!c) {
      setLoading(false);
      return;
    }
    try {
      const r = (await c.query("audit:list" as any, { limit: 60 })) as AuditRow[];
      setRows(r ?? []);
    } catch {
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const logins = rows.filter((r) => r.action.startsWith("login"));
  const lastLogin = logins[0];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading text-2xl uppercase">Sicurezza &amp; audit</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Tutte le difese attive sul backoffice e sul sito pubblico, con il registro di ogni azione.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard label="Azioni registrate" value={rows.length} hint="ultime 60 voci" />
        <StatCard label="Accessi (log)" value={logins.length} hint="nel registro corrente" />
        <StatCard
          label="Ultimo accesso"
          value={lastLogin ? new Date(lastLogin.ts).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" }) : "—"}
          hint={lastLogin?.actor ?? "nessun accesso recente"}
          className="col-span-2 lg:col-span-1"
        />
      </div>

      <div className="border border-border">
        <p className="micro-label border-b border-border p-4">Difese attive</p>
        <div className="grid gap-px bg-border md:grid-cols-2">
          {DEFENSES.map((d) => (
            <div key={d.label} className="flex items-start gap-3 bg-background p-4">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center bg-foreground text-background">
                <Icon name="check" size={12} />
              </span>
              <div>
                <p className="text-sm font-medium">{d.label}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{d.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border border-border">
        <p className="micro-label border-b border-border p-4">Registro audit</p>
        {loading ? (
          <p className="micro-label p-10 text-center">Caricamento…</p>
        ) : rows.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">Nessuna azione registrata — si popolerà con l&apos;uso.</p>
        ) : (
          <div className="max-h-[420px] overflow-y-auto">
            {rows.map((r) => (
              <div key={r._id} className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-border/50 p-3.5 last:border-0 hover:bg-muted/40">
                <span className="w-32 shrink-0 font-mono text-[10px] text-muted-foreground">
                  {new Date(r.ts).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" })}
                </span>
                <span
                  className={
                    "border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.18em] " +
                    (r.action.includes("fallito")
                      ? "border-destructive/60 text-destructive"
                      : "border-border text-muted-foreground")
                  }
                >
                  {r.action}
                </span>
                <span className="font-mono text-[11px]">{r.target}</span>
                <span className="ml-auto font-mono text-[10px] text-muted-foreground">{r.actor}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
