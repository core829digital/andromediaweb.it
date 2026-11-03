"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { services } from "@/lib/site-data";
import { usePortfolioItems } from "@/components/site/showcase";

/* ------------------------------------------------------------------ */
/* Servizi — sezione pinnata con scorrimento orizzontale               */
/* ------------------------------------------------------------------ */

function ServiceCard({
  index,
  short,
  desc,
  standalone,
  id,
}: {
  index: string;
  short: string;
  desc: string;
  standalone: boolean;
  id: string;
}) {
  const body = (
    <article
      id={standalone ? id : undefined}
      className="group flex h-full w-[80vw] shrink-0 scroll-mt-28 flex-col justify-between gap-10 overflow-hidden border border-border bg-background p-7 transition-colors duration-500 hover:border-foreground md:w-[46vw] lg:w-[31vw]"
    >
      <div className="flex items-start justify-between gap-4">
        <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground">{index}</span>
        {!standalone && (
          <span className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
            <Icon name="arrow-up-right" size={14} />
          </span>
        )}
      </div>
      <div>
        <h3 className="font-heading text-2xl uppercase leading-[1.1] whitespace-pre-line md:text-[1.7rem]">
          {short}
        </h3>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">{desc}</p>
      </div>
    </article>
  );

  if (standalone) return body;
  return (
    <Link href={`/servizi#${id}`} className="block h-full shrink-0">
      {body}
    </Link>
  );
}

/**
 * Sezione servizi con scroll animation: pannello sticky e binario
 * orizzontale guidato dallo scroll verticale. Su desktop e mobile si
 * comporta allo stesso modo (coerenza); solo con
 * prefers-reduced-motion degrada in una griglia verticale statica.
 */
export function ScrollServices({ title, standalone = false }: { title: string; standalone?: boolean }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return (
      <section className="py-4">
        <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
          <h2 className="mb-8 font-heading text-3xl uppercase leading-[1.08] md:text-4xl">{title}</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 2) * 0.08} className="h-full">
                <ServiceCard index={s.index} short={s.short} desc={s.desc} standalone={standalone} id={s.id} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return <PinnedServices title={title} standalone={standalone} />;
}

/**
 * Layout pinnato isolato: i ref nascono insieme al DOM, così `useScroll`
 * aggancia subito il contenitore e la misura del binario è affidabile.
 */
function PinnedServices({ title, standalone }: { title: string; standalone: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [maxX, setMaxX] = useState(0);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -maxX]);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const measure = () => {
      const overflow = track.scrollWidth - window.innerWidth;
      setMaxX(Math.max(0, overflow + 32));
    };

    const raf = requestAnimationFrame(measure);
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(track);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative"
      style={{ height: `${services.length * 62}vh` }}
    >
      <div className="sticky top-0 flex h-svh flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-7xl px-8">
          <div className="flex items-end justify-between gap-6">
            <h2 className="max-w-2xl font-heading text-4xl uppercase leading-[1.05] md:text-5xl">
              {title}
            </h2>
            <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground lg:block">
              Scorri
            </span>
          </div>
        </div>

        <motion.div
          ref={trackRef}
          style={{ x }}
          className="flex gap-5 pl-8 pr-[12vw] will-change-transform"
        >
          {services.map((s) => (
            <div key={s.id} className="flex h-[52vh] min-h-[340px] max-h-[520px] shrink-0">
              <ServiceCard index={s.index} short={s.short} desc={s.desc} standalone={standalone} id={s.id} />
            </div>
          ))}
        </motion.div>

        <div className="mx-auto mt-10 w-full max-w-7xl px-8">
          <div className="h-px w-full overflow-hidden bg-border">
            <motion.div
              className="h-px origin-left bg-foreground"
              style={{ scaleX: scrollYProgress }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lavori — card impilate in sticky, si coprono una con l'altra         */
/* ------------------------------------------------------------------ */

export function ScrollWorks({ title, limit = 6 }: { title: string; limit?: number }) {
  const items = usePortfolioItems().slice(0, limit);

  return (
    <div className="relative">
      <div className="mx-auto mb-10 w-full max-w-7xl px-5 md:px-8">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-2xl font-heading text-3xl uppercase leading-[1.08] md:text-4xl">
            {title}
          </h2>
          <Link
            href="/portfolio"
            className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
          >
            Vedi il portfolio completo
            <Icon name="arrow-right" size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-5 md:px-8">
        {items.map((item, i) => (
          <div
            key={`${item.title}-${i}`}
            className="sticky"
            style={{ top: `calc(84px + ${i * 16}px)` }}
          >
            <Link
              href={item.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="group mb-6 grid overflow-hidden border border-border bg-background transition-colors duration-500 hover:border-foreground md:grid-cols-[1.15fr_1fr]"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-muted md:aspect-auto md:min-h-[52vh]">
                {item.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted" aria-hidden="true">
                    <span className="font-heading text-7xl text-muted-foreground/20">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex flex-col justify-between gap-8 p-7 md:p-10">
                <div className="flex items-start justify-between gap-4">
                  <span className="font-mono text-xs tracking-[0.25em] text-muted-foreground">
                    {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                  <span className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                    <Icon name="arrow-up-right" size={15} />
                  </span>
                </div>

                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
                    {item.category}
                  </p>
                  <h3 className="mt-3 font-heading text-2xl uppercase leading-tight md:text-4xl">
                    {item.title}
                  </h3>
                  {item.description && (
                    <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
