"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";
import { Icon } from "@/components/icons";
import { site } from "@/lib/site-data";

/** Nave argento — SVG disegnato in house con gradiente metallico. */
function SpaceShip({ width = 260 }: { width?: number }) {
  return (
    <svg
      viewBox="0 0 260 90"
      width={width}
      fill="none"
      aria-hidden="true"
      className="drop-shadow-[0_0_24px_oklch(0.985_0_0/25%)]"
    >
      <defs>
        <linearGradient id="aw-hull" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f5f5f5" />
          <stop offset="38%" stopColor="#c9c9c9" />
          <stop offset="62%" stopColor="#8f8f8f" />
          <stop offset="100%" stopColor="#5c5c5c" />
        </linearGradient>
        <linearGradient id="aw-fin" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e8e8e8" />
          <stop offset="100%" stopColor="#7a7a7a" />
        </linearGradient>
        <radialGradient id="aw-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* scafo */}
      <path
        d="M30 52 C 60 20, 150 14, 210 34 C 232 42, 236 50, 228 58 C 196 72, 96 76, 56 66 C 40 62, 26 58, 30 52 Z"
        fill="url(#aw-hull)"
        stroke="#fafafa"
        strokeWidth="1.2"
      />
      {/* cresta superiore */}
      <path d="M84 24 C 120 16, 168 20, 206 34 L 196 38 C 158 26, 122 24, 90 28 Z" fill="url(#aw-fin)" />
      {/* pinna posteriore */}
      <path d="M40 44 C 28 30, 34 22, 52 24 C 44 30, 42 38, 46 46 Z" fill="url(#aw-fin)" stroke="#dcdcdc" strokeWidth="0.8" />
      {/* pinna ventrale */}
      <path d="M52 68 C 46 80, 52 86, 66 84 C 58 80, 56 74, 58 68 Z" fill="url(#aw-fin)" stroke="#dcdcdc" strokeWidth="0.8" />
      {/* oblò */}
      <circle cx="150" cy="44" r="7" fill="#1a1a1a" stroke="#e8e8e8" strokeWidth="1.4" />
      <circle cx="148" cy="42" r="2" fill="#f0f0f0" />
      {/* dettaglio pannello */}
      <path d="M96 32 L 176 30 M 92 60 L 172 62" stroke="#ffffff" strokeOpacity="0.28" strokeWidth="1" />
      {/* glow motore */}
      <circle cx="16" cy="54" r="10" fill="url(#aw-glow)" />
      <circle cx="8" cy="54" r="4" fill="#ffffff" opacity="0.85" />
      {/* scia */}
      <path d="M2 54 L -40 51 M 2 57 L -28 60 M 2 52 L -22 48" stroke="#ffffff" strokeOpacity="0.5" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

const stars = Array.from({ length: 42 }, (_, i) => ({
  x: (i * 37.7) % 100,
  y: ((i * 53.3) % 90) + 2,
  s: i % 7 === 0 ? 2 : 1,
  o: 0.15 + ((i * 13) % 60) / 100,
}));

/**
 * Sezione finale fullscreen: "Un giorno o giorno uno?" con nave argento
 * che attraversa lo schermo guidata dallo scroll e svanisce in uscita.
 */
export function SpaceCta() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const shipX = useTransform(scrollYProgress, [0, 0.55, 1], ["-40vw", "55vw", "140vw"]);
  const shipY = useTransform(scrollYProgress, [0, 0.55, 1], ["18vh", "2vh", "-16vh"]);
  const shipRot = useTransform(scrollYProgress, [0, 1], [-6, 4]);
  const shipOpacity = useTransform(scrollYProgress, [0.02, 0.2, 0.72, 0.92], [0, 1, 1, 0]);
  const shipScale = useTransform(scrollYProgress, [0, 0.55, 1], [0.75, 1, 1.2]);
  const titleOpacity = useTransform(scrollYProgress, [0.25, 0.5, 0.8], [0, 1, 1]);
  const titleY = useTransform(scrollYProgress, [0.25, 0.55], [40, 0]);

  return (
    <div ref={ref} className="relative h-[220vh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-foreground dark-surface">
        {/* campo stellare */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {stars.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-background"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                height: s.s,
                width: s.s,
                opacity: s.o,
              }}
              animate={reduce ? undefined : { opacity: [s.o * 0.4, s.o, s.o * 0.4] }}
              transition={{ repeat: Infinity, duration: 2.6 + (i % 5), ease: "easeInOut" }}
            />
          ))}
        </div>

        {/* HUD corners */}
        <span aria-hidden="true" className="absolute left-6 top-6 h-5 w-5 border-l border-t border-background/30" />
        <span aria-hidden="true" className="absolute right-6 top-6 h-5 w-5 border-r border-t border-background/30" />
        <span aria-hidden="true" className="absolute bottom-6 left-6 h-5 w-5 border-b border-l border-background/30" />
        <span aria-hidden="true" className="absolute bottom-6 right-6 h-5 w-5 border-b border-r border-background/30" />
        <span className="micro-label absolute left-1/2 top-8 -translate-x-1/2 !text-background/40">
          Trasmissione finale — Missione
        </span>

        {/* testo */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <p className="micro-label mb-6 !text-background/50">Hai un'idea in mente?</p>
          <h2 className="font-heading text-4xl uppercase leading-[1.05] md:text-6xl">
            Un giorno o
            <br />
            <span className="text-outline-light">giorno uno?</span>
          </h2>
          <Link
            href={site.contact.calendly}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-10 inline-flex h-14 items-center gap-3 bg-background px-9 font-mono text-xs uppercase tracking-[0.25em] text-foreground transition-all duration-300 hover:bg-background/80"
          >
            Parliamone
            <Icon
              name="arrow-up-right"
              size={15}
              className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>

        {/* nave argento */}
        <motion.div
          style={{
            x: shipX,
            y: shipY,
            rotate: shipRot,
            opacity: shipOpacity,
            scale: shipScale,
          }}
          className="pointer-events-none absolute left-0 top-[42%] z-20 will-change-transform"
        >
          <SpaceShip width={reduce ? 200 : 280} />
        </motion.div>
      </div>
    </div>
  );
}
