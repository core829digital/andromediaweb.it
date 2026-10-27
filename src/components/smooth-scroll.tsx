"use client";

import { useEffect, useState, type ReactNode } from "react";
import Lenis from "lenis";

export function SmoothScroll({ children }: { children: ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    const l = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      autoResize: true,
    });
    setLenis(l);
    let raf = 0;
    const loop = (time: number) => {
      l.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      l.destroy();
      setLenis(null);
    };
  }, []);

  // Preserva l'accessibilità con prefers-reduced-motion
  useEffect(() => {
    if (!lenis) return;
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (m.matches) lenis.stop();
    return () => {
      lenis.start();
    };
  }, [lenis]);

  return <>{children}</>;
}
