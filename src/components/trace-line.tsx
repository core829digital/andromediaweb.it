import { cn } from "@/lib/utils";

/**
 * Trailing line stile spaziale: linea dritta sottile con nodo-punto
 * che segna l'ingresso di ogni sezione. Nessuna animazione invasiva.
 */
export function TraceNode({ dark = false, className }: { dark?: boolean; className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("trace-node mx-auto h-24 shrink-0", dark && "dark", className)}
    />
  );
}

/** Variante orizzontale (footer). */
export function TraceNodeH({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("trace-node-h my-4 w-full shrink-0", className)} />;
}

type Tone = "light" | "dark";

/**
 * Passaggio di colore on scroll: gradiente alto (~26vh) che sfuma
 * il bianco nel nero (o viceversa) in modo molto smooth, con la
 * linea-nodo centrale che attraversa la transizione.
 */
export function ColorFade({
  from,
  to,
  node = true,
  className,
}: {
  from: Tone;
  to: Tone;
  node?: boolean;
  className?: string;
}) {
  const c = { light: "oklch(1 0 0)", dark: "oklch(0.11 0 0)" } as const;
  return (
    <div
      aria-hidden="true"
      className={cn("relative h-[26vh] w-full", className)}
      style={{ background: `linear-gradient(to bottom, ${c[from]}, ${c[to]})` }}
    >
      {node && (
        <>
          {/* linea dritta che attraversa il passaggio di colore */}
          <div
            className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2"
            style={{
              background:
                to === "dark"
                  ? "linear-gradient(to bottom, oklch(0.985 0 0 / 0%), oklch(0.985 0 0 / 22%))"
                  : "linear-gradient(to bottom, oklch(0.11 0 0 / 0%), oklch(0.11 0 0 / 20%))",
            }}
          />
          {/* nodo-punto di sezione */}
          <div
            className="absolute bottom-[18%] left-1/2 h-7px w-7px -translate-x-1/2 rounded-full"
            style={{
              height: 7,
              width: 7,
              border: `1px solid ${to === "dark" ? "oklch(0.985 0 0 / 70%)" : "oklch(0.11 0 0 / 70%)"}`,
              background: to === "dark" ? c.dark : c.light,
            }}
          />
        </>
      )}
    </div>
  );
}
