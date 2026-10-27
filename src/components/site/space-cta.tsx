"use client";

import { useRef } from "react";
import { CallButton } from "@/components/call-button";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

const stars = Array.from({ length: 42 }, (_, i) => ({
  x: (i * 37.7) % 100,
  y: ((i * 53.3) % 90) + 2,
  s: i % 7 === 0 ? 2 : 1,
  o: 0.15 + ((i * 13) % 60) / 100,
}));

/**
 * Sezione finale fullscreen: "Un giorno o giorno uno?" con campo
 * stellare che pulsa e testo che emerge guidato dallo scroll.
 */
export function SpaceCta() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const titleOpacity = useTransform(scrollYProgress, [0.25, 0.5, 0.8], [0, 1, 1]);
  const titleY = useTransform(scrollYProgress, [0.25, 0.55], [40, 0]);

  return (
    <div ref={ref} id="space-cta" className="relative h-[220vh]">
      <div className="sticky top-0 flex h-svh items-center justify-center overflow-hidden bg-background">
        {/* campo stellare */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {stars.map((s, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-foreground"
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
        <span aria-hidden="true" className="absolute left-6 top-6 h-5 w-5 border-l border-t border-foreground/25" />
        <span aria-hidden="true" className="absolute right-6 top-6 h-5 w-5 border-r border-t border-foreground/25" />
        <span aria-hidden="true" className="absolute bottom-6 left-6 h-5 w-5 border-b border-l border-foreground/25" />
        <span aria-hidden="true" className="absolute bottom-6 right-6 h-5 w-5 border-b border-r border-foreground/25" />
        <span className="micro-label absolute left-1/2 top-8 -translate-x-1/2">
          Trasmissione finale — Missione
        </span>

        {/* testo */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <p className="micro-label mb-6">Hai un'idea in mente?</p>
          <h2 className="font-heading text-4xl uppercase leading-[1.05] md:text-6xl">
            Un giorno o
            <br />
            <span className="text-outline">giorno uno?</span>
          </h2>
          <CallButton
            label="Parliamone"
            size="md"
            className="mt-10 h-14 px-9 tracking-[0.25em]"
          />
        </motion.div>
      </div>
    </div>
  );
}
