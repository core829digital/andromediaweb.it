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
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-50 transition-all duration-500",
          scrolled
            ? "border-b border-border bg-background/85 backdrop-blur-md"
            : "border-b border-transparent bg-transparent"
        )}
      >
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Andromedia Web — Home">
            <span className="animate-spin-slow inline-flex">
              <LogoIcon />
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {navLinks.map((l) => {
              const active =
                pathname !== null &&
                (l.href === "/" ? pathname === "/" : pathname.startsWith(l.href));
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "group relative px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="mr-1 text-[8px] text-muted-foreground/50">{l.index}</span>
                  {l.label}
                  <span
                    className={cn(
                      "absolute inset-x-3 -bottom-px h-px origin-left scale-x-0 bg-foreground transition-transform duration-300",
                      active ? "scale-x-100" : "group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <CallButton
              label="Prenota"
              variant="outline"
              size="sm"
              className="hidden lg:inline-flex"
            />
            <button
              onClick={() => setOpen(!open)}
              aria-label={open ? "Chiudi menu" : "Apri menu"}
              className="flex h-9 w-9 items-center justify-center border border-border lg:hidden"
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
                className="mt-6 flex items-center justify-center gap-2 bg-foreground px-6 py-3.5 font-mono text-xs uppercase tracking-[0.25em] text-background"
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
