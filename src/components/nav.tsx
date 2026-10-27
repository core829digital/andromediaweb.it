"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { navLinks, site } from "@/lib/site-data";
import { cn } from "@/lib/utils";
import { Icon } from "@/components/icons";
import { LogoIcon } from "@/components/logo";

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
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="group flex items-center gap-3">
            <span className="animate-spin-slow inline-flex">
              <LogoIcon />
            </span>
            <span className="hidden font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground sm:block">
              {site.name}
            </span>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navLinks.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "group relative py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors",
                    active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <span className="mr-1 text-[9px] text-muted-foreground/60">{l.index}</span>
                  {l.label}
                  <span
                    className={cn(
                      "absolute inset-x-0 -bottom-px h-px origin-left scale-x-0 bg-foreground transition-transform duration-300",
                      active ? "scale-x-100" : "group-hover:scale-x-100"
                    )}
                  />
                </Link>
              );
            })}
            <Link
              href={site.contact.calendly}
              target="_blank"
              className="group flex h-9 items-center gap-2 border border-foreground/20 px-4 font-mono text-[11px] uppercase tracking-[0.22em] transition-all duration-300 hover:bg-foreground hover:text-background"
            >
              Parliamone
              <Icon
                name="arrow-up-right"
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </nav>

          <button
            onClick={() => setOpen(!open)}
            aria-label={open ? "Chiudi menu" : "Apri menu"}
            className="flex h-9 w-9 items-center justify-center border border-border lg:hidden"
          >
            <Icon name={open ? "close" : "menu"} size={18} />
          </button>
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
                    className="flex items-baseline gap-4 border-b border-border py-4 font-heading text-3xl uppercase"
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
                initial={{ opacity: 0, x: -24 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.42, duration: 0.5, ease: "easeOut" }}
                className="mt-6 flex items-center justify-center gap-2 bg-foreground px-6 py-4 font-mono text-xs uppercase tracking-[0.25em] text-background"
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
