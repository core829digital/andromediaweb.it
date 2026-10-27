"use client";

import { useState } from "react";
import { ConvexHttpClient } from "convex/browser";
import { Icon } from "@/components/icons";
import { site } from "@/lib/site-data";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    try {
      if (!convexUrl) throw new Error("convex-missing");
      const c = new ConvexHttpClient(convexUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await c.mutation("messages:create" as any, {
        ...form,
        source: "contatti",
        createdAt: Date.now(),
      });
      setState("sent");
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <div className="flex flex-col items-center justify-center gap-5 border border-foreground/20 p-14 text-center">
        <span className="flex h-12 w-12 items-center justify-center bg-foreground text-background">
          <Icon name="check" size={20} />
        </span>
        <p className="font-heading text-xl uppercase">Messaggio ricevuto</p>
        <p className="text-sm text-muted-foreground">
          Ti risponderemo al più presto — siamo operativi 24/7.
        </p>
      </div>
    );
  }

  const inputCls =
    "h-11 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground";

  return (
    <form onSubmit={submit} className="flex flex-col gap-4">
      <input
        required
        placeholder="Nome e cognome"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
        className={inputCls}
      />
      <input
        required
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        className={inputCls}
      />
      <textarea
        required
        rows={5}
        placeholder="Raccontaci il tuo progetto…"
        value={form.message}
        onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full border border-border bg-transparent px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground"
      />
      <button
        type="submit"
        disabled={state === "sending"}
        className="group flex h-12 items-center justify-center gap-3 rounded-full bg-foreground font-mono text-xs uppercase tracking-[0.22em] text-background transition-colors hover:bg-muted-foreground disabled:opacity-50"
      >
        {state === "sending" ? "Trasmissione…" : "Invia messaggio"}
        <Icon name="send" size={14} />
      </button>
      {state === "error" && (
        <p className="text-xs text-muted-foreground">
          Ops, qualcosa è andato storto. Scrivici direttamente a{" "}
          <a href={`mailto:${site.contact.email}`} className="underline">
            {site.contact.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}
