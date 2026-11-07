import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import type { IconName } from "@/components/icons";
import { cn } from "@/lib/utils";

/**
 * Titolo di sezione, senza etichette micro né icone decorative:
 * il cliente ha chiesto di eliminare le scritte piccole sopra i titoli.
 * Le prop `icon`/`label` restano accettate (retrocompatibilità con i
 * chiamanti e con l'editor contenuti) ma non vengono più mostrate.
 */
export function SectionHeading({
  title,
  align = "left",
  className,
}: {
  icon?: IconName;
  label?: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn("flex flex-col gap-4", align === "center" && "items-center text-center", className)}
    >
      <h2
        className={cn(
          "max-w-2xl font-heading text-3xl leading-[1.08] tracking-tight md:text-4xl",
          align === "center" && "mx-auto"
        )}
      >
        {title}
      </h2>
    </Reveal>
  );
}

/** Sezione standard: nessun pattern di sfondo, solo contenuto. */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("relative", className)}>
      {children}
    </section>
  );
}

/** Container standard del layout. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 md:px-8", className)}>{children}</div>;
}
