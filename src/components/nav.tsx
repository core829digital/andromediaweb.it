"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { navLinks } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { LogoIcon } from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";

/**
 * Header: capsula centrata con logo all'interno (nessuna animazione),
 * menu, tema e CTA. La pagina corrente è evidenziata in desktop e in
 * mobile; al click su una voce il menu mobile si chiude subito.
 */
export function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Rete di sicurezza per back/forward: se cambia rotta, il menu si chiude.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-4 py-3 md:px-6">
        <div
          className={cn(
            "flex h-11 items-center gap-0.5 rounded-full border border-foreground bg-background/85 pl-1.5 pr-1 backdrop-blur-md transition-shadow duration-500 md:h-12 md:pr-1.5",
            scrolled && "shadow-[0_0_36px_oklch(0_0_0/14%)]"
          )}
        >
          {/* logo dentro la capsula, a sinistra — nessuna animazione */}
          <Link
            href="/"
            aria-label="Andromedia Web — Home"
            className="flex h-8 items-center rounded-full px-1.5 transition-colors duration-300 hover:bg-muted/50 md:h-9"
          >
            <LogoIcon className="h-5 w-auto md:h-6" />
          </Link>

          <span aria-hidden="true" className="mx-0.5 h-5 w-px bg-border" />

          <nav className="hidden items-center lg:flex">
            {navLinks.map((l) => {
              const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "group relative px-2.5 py-1 font-sans text-[9px] uppercase tracking-[0.18em] transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="mr-1 text-[7px] text-muted-foreground/50">{l.index}</span>
                  {l.label}
                  <span
                    className={cn(
                      "absolute inset-x-2.5 -bottom-px h-px origin-left bg-foreground transition-transform duration-300",
                      active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-0.5">
            <ThemeToggle className="h-8 w-8 border-0 bg-transparent hover:bg-muted/50" />
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

      {/* Menu mobile: montato solo quando aperto, così al click su una voce
          sparisce subito (nessun exit trattenuto). */}
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 flex flex-col justify-center bg-background px-8 lg:hidden"
        >
            <nav className="flex flex-col gap-2">
              {navLinks.map((l, i) => {
                const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
                return (
                  <motion.div
                    key={l.href}
                    initial={{ opacity: 0, x: -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.08 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                  >
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-baseline gap-4 border-b border-border py-3.5 font-heading text-[1.352rem] leading-[1.2] transition-colors sm:text-[1.624rem]",
                        active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      <span
                        className={cn(
                          "font-sans text-[10px] tracking-[0.25em]",
                          active ? "text-foreground" : "text-muted-foreground"
                        )}
                      >
                        {l.index}
                      </span>
                      <span className={cn(active && "underline decoration-1 underline-offset-[8px]")}>
                        {l.label}
                      </span>
                      {active && (
                        <Icon
                          name="arrow-right"
                          size={16}
                          className="ml-auto self-center text-foreground"
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </nav>
          </motion.div>
        )}
    </>
  );
}
