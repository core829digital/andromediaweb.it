import { cn } from "@/lib/utils";

/**
 * Trailing line: sottile linea tratteggiata animata che funge da tramite
 * visivo tra le sezioni, con nodo centrale in stile Palantir.
 */
export function TraceLine({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("trace-line mx-auto h-24 shrink-0", className)} />;
}

/** Variante orizzontale, per passaggi a piena larghezza. */
export function TraceLineH({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn("trace-line trace-horizontal my-4 h-px w-full shrink-0", className)}
    />
  );
}
