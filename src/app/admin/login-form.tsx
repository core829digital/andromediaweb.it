"use client";

import { useActionState } from "react";
import { login, type LoginState } from "./actions";
import { Icon } from "@/components/icons";
import { LogoFull } from "@/components/logo";

export function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});

  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-foreground px-5 text-background">
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]" style={{ backgroundImage: "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)", backgroundSize: "72px 72px" }} aria-hidden="true" />
      <div className="relative z-10 w-full max-w-sm">
        <div className="mb-8 flex justify-center">
          <LogoFull light className="h-16" />
        </div>
        <div className="border border-background/15 bg-background/[0.03] p-8 backdrop-blur-sm">
          <p className="micro-label mb-6 !text-background/50">Accesso riservato</p>
          <form action={action} className="flex flex-col gap-4">
            <div>
              <label htmlFor="email" className="micro-label mb-2 block">
                Utente
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="username"
                placeholder="utente@dominio.it"
                className="h-11 w-full border border-background/20 bg-transparent px-4 text-sm text-background outline-none transition-colors placeholder:text-background/30 focus:border-background"
              />
            </div>
            <div>
              <label htmlFor="password" className="micro-label mb-2 block">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="current-password"
                placeholder="••••••••••••"
                className="h-11 w-full border border-background/20 bg-transparent px-4 text-sm text-background outline-none transition-colors placeholder:text-background/30 focus:border-background"
              />
            </div>
            {state?.error && (
              <p className="flex items-center gap-2 border border-background/20 bg-background/5 px-3 py-2 text-xs text-background/80">
                <Icon name="close" size={12} /> {state.error}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="group mt-2 flex h-11 items-center justify-center gap-3 bg-background font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-colors hover:bg-background/80 disabled:opacity-50"
            >
              {pending ? "Verifica in corso…" : "Accedi"}
              <Icon name="arrow-right" size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </form>
        </div>
        <p className="micro-label mt-6 text-center !text-background/30">Andromedia Web — Backoffice</p>
      </div>
    </div>
  );
}
