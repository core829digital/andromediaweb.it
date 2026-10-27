"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { navLinks, site } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { LogoIcon } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { CallButton } from "@/components/call-button";

/**
 * Header a capsula: pill flottante compatta con contorno pieno
 * (border-foreground: nero in light, bianco in dark) ed estremi tondi
 * che combaciano con il cerchio del logo. Nessuno spazio sprecato:
 * la capsula avvolge esattamente logo + menu + azioni.
 */
export function Nav() {
  const [pathname, setPathname] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPathname(window.location.pathname);
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-3 z-50 flex justify-center px-4">
        <div
          className={cn(
            "flex h-11 items-center gap-0.5 rounded-full border border-foreground bg-background/85 pl-1 pr-1.5 backdrop-blur-md transition-shadow duration-500",
            scrolled && "shadow-[0_0_36px_oklch(0_0_0/14%)]"
          )}
        >
          {/* logo — cerchio combaciante con la curva della capsula */}
          <Link
            href="/"
            aria-label="Andromedia Web — Home"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
          >
            <span className="animate-spin-slow inline-flex">
              <LogoIcon />
            </span>
          </Link>

          {/* menu compatto */}
          <nav className="hidden items-center lg:flex">
            {navLinks.map((l) => {
              const active =
                pathname !== null &&
                (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "group relative px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.18em] transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="mr-1 text-[7px] text-muted-foreground/50">{l.index}</span>
                  {l.label}
                  <span
                    className={cn(
                      "absolute inset-x-2.5 -bottom-px h-px origin-left scale-x-0 bg-foreground transition-transform duration-300",
                      active ? "scale-x-100" : "group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-0.5">
            <ThemeToggle className="h-8 w-8 border-0 bg-transparent hover:bg-muted/50" />
            <CallButton
              label="Prenota"
              variant="solid"
              size="sm"
              className="hidden h-8 px-3.5 text-[10px] tracking-[0.18em] lg:inline-flex"
            />
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Chiudi menu" : "Apri menu"}
              className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground lg:hidden"
            >
              <Icon name={open ? "close" : "menu"} size={17} />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-40 flex flex-col justify-center bg-background px-8 lg:hidden"
          >
            <nav className="flex flex-col gap-2">
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                >
                  <Link
                    href={l.href}
                    className="flex items-baseline gap-4 border-b border-border py-3.5 font-heading text-2xl uppercase sm:text-3xl"
                  >
                    <span className="font-mono text-[10px] tracking-[0.25em] text-muted-foreground">
                      {l.index}
                    </span>
                    {l.label}
                  </Link>
                </motion.div>
              ))}
              <motion.a
                href={site.contact.calendly}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42, duration: 0.5, ease: "easeOut" }}
                className="mt-6 flex items-center justify-center gap-2 rounded-full bg-foreground px-6 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-background"
              >
                Prenota una call <Icon name="arrow-up-right" size={14} />
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
