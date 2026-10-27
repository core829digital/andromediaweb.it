"use client";

import { useState } from "react";
import Link from "next/link";
import { AdminDashboard } from "@/app/admin/admin-dashboard";
import { DashboardView } from "./dashboard-view";
import { SeoView } from "./seo-view";
import { SettingsView } from "./settings-view";
import { SecurityView } from "./security-view";
import { LogoMark } from "@/components/logo";
import { Icon, type IconName } from "@/components/icons";
import { logout } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

type ViewKey = "dashboard" | "contenuti" | "seo" | "impostazioni" | "sicurezza";

const NAV: Array<{ key: ViewKey; label: string; icon: IconName }> = [
  { key: "dashboard", label: "Dashboard", icon: "gauge" },
  { key: "contenuti", label: "Contenuti", icon: "folder" },
  { key: "seo", label: "SEO & Metatags", icon: "search" },
  { key: "impostazioni", label: "Impostazioni", icon: "sliders" },
  { key: "sicurezza", label: "Sicurezza", icon: "shield" },
];

/**
 * Guscio del backoffice: menu laterale (desktop) + nav orizzontale (mobile)
 * che orchestra le viste. Le scritture vivono nelle server actions.
 */
export function AdminShell({ email }: { email: string }) {
  const [view, setView] = useState<ViewKey>("dashboard");

  return (
    <div className="min-h-svh bg-background lg:flex">
      {/* ---------- Sidebar desktop ---------- */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-border lg:flex">
        <Link href="/" className="flex h-16 items-center gap-3 border-b border-border px-5">
          <LogoMark className="h-8" />
          <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Backoffice</span>
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setView(n.key)}
              className={cn(
                "flex w-full items-center gap-3 border px-3 py-2.5 text-left font-mono text-[11px] uppercase tracking-[0.2em] transition-colors",
                view === n.key
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              <Icon name={n.icon} size={16} />
              {n.label}
            </button>
          ))}
        </nav>

        <div className="space-y-3 border-t border-border p-4">
          <p className="truncate font-mono text-[10px] text-muted-foreground" title={email}>
            {email}
          </p>
          <Link
            href="/"
            className="flex h-9 items-center gap-2 border border-border px-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            Vedi sito <Icon name="external" size={12} />
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex h-9 w-full items-center justify-center gap-2 rounded-full bg-foreground font-mono text-[10px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-muted-foreground"
            >
              Esci <Icon name="close" size={12} />
            </button>
          </form>
        </div>
      </aside>

      {/* ---------- Area principale ---------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* topbar mobile + nav */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
          <div className="flex h-14 items-center justify-between px-5 lg:hidden">
            <Link href="/" className="flex items-center gap-2">
              <LogoMark className="h-8" />
              <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">Backoffice</span>
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="flex h-9 items-center gap-2 rounded-full border border-border px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                Esci <Icon name="close" size={12} />
              </button>
            </form>
          </div>
          <nav className="flex gap-1 overflow-x-auto px-4 pb-2 lg:hidden">
            {NAV.map((n) => (
              <button
                key={n.key}
                onClick={() => setView(n.key)}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] transition-colors",
                  view === n.key
                    ? "border-foreground text-foreground"
                    : "border-border text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon name={n.icon} size={13} />
                {n.label}
              </button>
            ))}
          </nav>
        </header>

        <div className="p-5 md:p-8">
          {view === "dashboard" && <DashboardView />}
          {view === "contenuti" && <AdminDashboard email={email} embedded />}
          {view === "seo" && <SeoView />}
          {view === "impostazioni" && <SettingsView />}
          {view === "sicurezza" && <SecurityView />}
        </div>
      </div>
    </div>
  );
}
