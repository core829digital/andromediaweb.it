"use client";

import { useEffect, useRef } from "react";

/**
 * Campo di loghi MW che si rivela solo in un'area radiale piccola
 * attorno al puntatore del mouse — mai su tutta la sezione. In dark
 * mode l'icona si scambia automaticamente via CSS.
 */
export function PatternField() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const field = ref.current;
    const host = field?.parentElement;
    if (!field || !host) return;

    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      host.style.setProperty("--mx", `${e.clientX - r.left}px`);
      host.style.setProperty("--my", `${e.clientY - r.top}px`);
      host.classList.add("pattern-on");
    };
    const onLeave = () => host.classList.remove("pattern-on");

    host.addEventListener("mousemove", onMove, { passive: true });
    host.addEventListener("mouseleave", onLeave);
    return () => {
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="mw-pattern-field" />;
}
