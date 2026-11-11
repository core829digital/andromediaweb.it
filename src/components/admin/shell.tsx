"use client";

import { useEffect, useRef, useState } from "react";
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
 * Guscio del backoffice: menu laterale (desktop) + menu a tendina (mobile)
 * che orchestra le viste. Le scritture vivono nelle server actions.
 */
export function AdminShell({ email }: { email: string }) {
  const [view, setView] = useState<ViewKey>("dashboard");
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<Array<HTMLButtonElement | null>>([]);

  /* Come sull'app iOS: la sezione abbandonata è quella su cui si torna
     (l'ultima vista visitata viene ripristinata) */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("aw-backoffice-view");
      if (saved && NAV.some((n) => n.key === saved)) setView(saved as ViewKey);
    } catch {}
  }, []);
  useEffect(() => {
    try {
      localStorage.setItem("aw-backoffice-view", view);
    } catch {}
  }, [view]);

  /* Chiusura con Escape (e ritorno del focus), come i menu di sistema iOS/WebKit */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        menuRef.current?.querySelector<HTMLElement>("[aria-haspopup='menu']")?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  /** Seleziona una vista e chiude il menu: i menu di sistema si chiudono a scelta fatta. */
  function choose(key: ViewKey) {
    setView(key);
    setOpen(false);
  }

  /* Su mobile il menu tendina sostituisce la fila di chip orizzontali. */
  const menuItemCls =
    "flex min-h-11 w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors";

  return (
    <div className="min-h-svh bg-background lg:flex">
      {/* ---------- Sidebar desktop ---------- */}
      <aside className="sticky top-0 hidden h-svh w-60 shrink-0 flex-col border-r border-border lg:flex">
        <Link href="/" className="flex h-16 items-center border-b border-border px-5">
          <LogoMark className="h-8" />
        </Link>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setView(n.key)}
              className={cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                view === n.key
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
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
            className="flex h-9 items-center gap-2 rounded-full border border-border px-3 text-xs tracking-[0.02em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
          >
            Vedi sito <Icon name="external" size={12} />
          </Link>
          <form action={logout}>
            <button
              type="submit"
              className="flex h-9 w-full items-center justify-center gap-2 rounded-full bg-foreground text-xs tracking-[0.02em] text-background transition-colors hover:bg-muted-foreground"
            >
              Esci <Icon name="close" size={12} />
            </button>
          </form>
        </div>
      </aside>

      {/* ---------- Area principale ---------- */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* topbar mobile: logo + menu a tendina delle viste */}
        <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md lg:hidden">
          <div className="flex h-14 items-center justify-between px-5">
            <Link href="/" className="flex items-center">
              <LogoMark className="h-8" />
            </Link>

            {/* menu a tendina stile iOS, ancorato al pulsante */}
            <div className="relative" ref={menuRef}>
              <button
                type="button"
                aria-haspopup="menu"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className="flex h-9 items-center gap-2 rounded-full border border-border px-4 text-xs tracking-[0.02em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
              >
                <Icon name={open ? "close" : "menu"} size={14} />
                {NAV.find((n) => n.key === view)?.label}
              </button>

              {open && (
                <>
                  {/* tocco esterno chiude il menu */}
                  <button
                    type="button"
                    aria-hidden="true"
                    tabIndex={-1}
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-40 cursor-default"
                  />
                  <div
                    role="menu"
                    aria-label="Navigazione backoffice"
                    onKeyDown={(e) => {
                      // navigazione da tastiera con le frecce, come nei menu di macOS
                      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                      e.preventDefault();
                      const items = itemsRef.current.filter(Boolean) as HTMLButtonElement[];
                      const i = items.indexOf(document.activeElement as HTMLButtonElement);
                      const next = e.key === "ArrowDown" ? i + 1 : i - 1;
                      items[(next + items.length) % items.length]?.focus();
                    }}
                    className="absolute right-0 top-[calc(100%+8px)] z-50 w-64 origin-top-right rounded-2xl border border-border bg-popover p-1.5 shadow-xl shadow-black/10 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 motion-reduce:animate-none"
                  >
                    {NAV.map((n, i) => (
                      <button
                        key={n.key}
                        ref={(el) => { itemsRef.current[i] = el; }}
                        role="menuitem"
                        onClick={() => choose(n.key)}
                        className={cn(
                          menuItemCls,
                          view === n.key
                            ? "bg-muted text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon name={n.icon} size={16} />
                        <span>{n.label}</span>
                        {/* la vista corrente è segnata come nei menu di iOS */}
                        {view === n.key && <Icon name="check" size={14} className="ml-auto" />}
                      </button>
                    ))}

                    <div className="my-1.5 h-px bg-border" role="separator" />

                    {/* azioni accessorie dentro lo stesso menu, come nel menu di iOS */}
                    <Link
                      href="/"
                      role="menuitem"
                      className={cn(menuItemCls, "text-sm text-muted-foreground")}
                    >
                      <Icon name="external" size={16} />
                      <span>Vedi sito</span>
                    </Link>
                    <form action={logout}>
                      <button
                        type="submit"
                        role="menuitem"
                        className={cn(menuItemCls, "text-sm text-destructive")}
                      >
                        <Icon name="close" size={16} />
                        <span>Esci</span>
                      </button>
                    </form>
                  </div>
                </>
              )}
            </div>
          </div>
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
