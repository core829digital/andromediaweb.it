"use client";

import { motion } from "motion/react";
import { Icon } from "@/components/icons";
import { site } from "@/lib/site-data";
import { cn } from "@/lib/utils";

type Variant = "solid" | "outline" | "light";

/**
 * Bottone CTA "call": on hover, ogni lettera sale e svanisce a scaglioni
 * mentre al centro compaiono telefono + freccia diagonale — senza mai
 * cambiare la forma o le dimensioni del bottone.
 */
export function CallButton({
  label = "Prenota una call",
  href = site.contact.calendly,
  variant = "solid",
  size = "md",
  className,
}: {
  label?: string;
  href?: string;
  variant?: Variant;
  size?: "sm" | "md";
  className?: string;
}) {
  const letters = label.split("");

  const base = cn(
    "group/call relative inline-flex items-center justify-center overflow-hidden rounded-full font-mono uppercase tracking-[0.22em] transition-colors duration-300",
    size === "sm" ? "h-9 px-4 text-[11px]" : "h-12 px-7 text-xs",
    variant === "solid" && "bg-foreground text-background hover:bg-muted-foreground",
    variant === "outline" && "border border-border text-foreground hover:border-foreground",
    variant === "light" && "bg-background text-foreground hover:bg-background/80",
    className
  );

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={base}
      whileTap={{ scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
    >
      {/* riga di lettere — definisce la larghezza, scompare a scaglioni */}
      <span
        aria-hidden={false}
        className="relative flex whitespace-nowrap"
      >
        {letters.map((l, i) => (
          <span
            key={i}
            aria-hidden="true"
            className="inline-block transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/call:-translate-y-[130%] group-hover/call:opacity-0"
            style={{ transitionDelay: `${i * 22}ms` }}
          >
            {l === " " ? "\u00A0" : l}
          </span>
        ))}
      </span>

      {/* telefono + freccia diagonale (stessa area, nessuno shift) */}
      <span
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center gap-2.5 opacity-0 transition-opacity duration-300 group-hover/call:opacity-100"
        style={{ transitionDelay: `${Math.min(letters.length * 22, 200)}ms` }}
      >
        <svg
          viewBox="0 0 24 24"
          width={size === "sm" ? 14 : 16}
          height={size === "sm" ? 14 : 16}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="-scale-x-100"
        >
          <path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5L15.5 12l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C10 17.6 6.4 14 4 6.1a1.5 1.5 0 0 1 1.5-2.6z" />
        </svg>
        <span className="inline-block h-px w-5 bg-current" />
        <motion.span
          initial={false}
          className="inline-flex"
        >
          <Icon name="arrow-up-right" size={size === "sm" ? 14 : 16} />
        </motion.span>
      </span>
    </motion.a>
  );
}
