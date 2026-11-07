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
export function SpaceCta({
  titleA = "Un giorno o",
  titleB = "giorno uno?",
  buttonLabel = "Parliamone",
}: {
  titleA?: string;
  titleB?: string;
  label?: string;
  buttonLabel?: string;
}) {
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

        {/* testo */}
        <motion.div
          style={{ opacity: titleOpacity, y: titleY }}
          className="relative z-10 flex flex-col items-center text-center"
        >
          <h2 className="font-heading text-5xl leading-[1.05] md:text-7xl">
            {titleA}
            <br />
            <span>{titleB}</span>
          </h2>
          <CallButton
            label={buttonLabel}
            size="md"
            className="mt-10 h-14 px-9 tracking-[0.25em]"
          />
        </motion.div>
      </div>
    </div>
  );
}
