"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";
import { Icon } from "@/components/icons";
import { CallButton } from "@/components/call-button";
import type { HeroContent } from "@/lib/site-settings";

const HERO_DEFAULT: HeroContent = {
  microLabel: "Consulenza Creativa",
  titleA: "Eleva il tuo",
  titleB: "Brand",
  subtitle:
    "Brand identity, siti web su misura, SEO, social media e intelligenza artificiale. Tutto in un unico orbita creativa.",
  ctaPrimary: { label: "Parliamone", href: "/contatti" },
  ctaSecondary: { label: "Esplora i servizi", href: "/servizi" },
};

export function Hero({ content }: { content?: HeroContent }) {
  const reduce = useReducedMotion();
  const c = content ?? HERO_DEFAULT;

  return (
    <section className="relative flex min-h-svh flex-col overflow-hidden bg-background">
      {/* alone morbido */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 left-1/2 h-[540px] w-[540px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,oklch(0_0_0/6%),transparent_70%)]"
      />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col justify-center px-5 pb-20 pt-36 md:px-8">
        <h1 className="font-heading text-[12.6vw] leading-[0.95] tracking-tight sm:text-[4.05rem] md:text-[5.4rem] lg:text-[8.1rem]">
          <span className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
            <motion.span
              className="block"
              initial={reduce ? false : { y: "135%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              {c.titleA}
            </motion.span>
          </span>
          <span className="block overflow-hidden pb-[0.18em] -mb-[0.18em]">
            <motion.span
              className="block"
              initial={reduce ? false : { y: "135%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.9, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {c.titleB}
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
              {c.subtitle}
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <CallButton label={c.ctaPrimary.label} href={c.ctaPrimary.href} />
            <Link
              href={c.ctaSecondary.href}
              className="group flex h-12 items-center justify-center gap-3 whitespace-nowrap border border-border px-7 font-mono text-xs uppercase tracking-[0.22em] transition-all duration-300 hover:border-foreground"
            >
              {c.ctaSecondary.label}
              <Icon
                name="arrow-right"
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
