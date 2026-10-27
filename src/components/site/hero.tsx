"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/icons";
import { CallButton } from "@/components/call-button";
import { site } from "@/lib/site-data";

export function Hero() {
  const reduce = useReducedMotion();

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      {/* blueprint grid + glow */}
      <div className="grid-bg grid-bg-fade absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0_0_0/6%),transparent_70%)]"
      />

      {/* corner HUD markers */}
      <motion.div
        aria-hidden="true"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="pointer-events-none absolute inset-4 hidden md:block"
      >
        <span className="absolute left-0 top-0 h-5 w-5 border-l border-t border-foreground/30" />
        <span className="absolute right-0 top-0 h-5 w-5 border-r border-t border-foreground/30" />
        <span className="absolute bottom-0 left-0 h-5 w-5 border-b border-l border-foreground/30" />
        <span className="absolute bottom-0 right-0 h-5 w-5 border-b border-r border-foreground/30" />
        <span className="absolute left-3 top-1/2 -translate-y-1/2 -rotate-90 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/70">
          Agenzia Creativa — IT
        </span>
        <span className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/70">
          EST. Foiano della Chiana
        </span>
      </motion.div>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-24 pt-36 md:px-8">
        <motion.p
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="micro-label mb-8"
        >
          ✦ {site.name} — Consulenza Creativa
        </motion.p>

        <h1 className="font-heading text-[13vw] uppercase leading-[0.95] tracking-tight sm:text-7xl md:text-8xl lg:text-[7.5rem]">
          <span className="block overflow-hidden">
            <motion.span
              className="block"
              initial={reduce ? false : { y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              Eleva il tuo
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              className="block text-outline"
              initial={reduce ? false : { y: "110%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              Brand
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={reduce ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85, duration: 0.7 }}
          className="mt-10 flex flex-col gap-10 md:flex-row md:items-end md:justify-between"
        >
          <div className="max-w-md">
            <p className="text-base leading-relaxed text-muted-foreground">
              Brand identity, siti web su misura, SEO, social media e
              intelligenza artificiale. Tutto in un unico orbita creativa.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <CallButton label="Prenota una call" />
            <Link
              href="/servizi"
              className="group flex h-12 items-center justify-center gap-3 whitespace-nowrap border border-border px-7 font-mono text-xs uppercase tracking-[0.22em] transition-all duration-300 hover:border-foreground"
            >
              Esplora i servizi
              <Icon
                name="arrow-right"
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </div>

      {/* scroll hint rimosso per richiesta: niente frecce di scroll tra le sezioni */}
    </section>
  );
}
