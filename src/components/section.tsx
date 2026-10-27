import type { ReactNode } from "react";
import { Reveal } from "@/components/reveal";
import { Icon, type IconName } from "@/components/icons";
import { cn } from "@/lib/utils";

/** Etichetta micro + titolo display, inaugurazione standard di sezione. */
export function SectionHeading({
  icon,
  label,
  title,
  align = "left",
  className,
}: {
  icon?: IconName;
  label: string;
  title: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <Reveal
      className={cn("flex flex-col gap-4", align === "center" && "items-center text-center", className)}
    >
      {icon && (
        <span className="flex h-14 w-14 items-center justify-center border border-border text-muted-foreground">
          <Icon name={icon} size={22} />
        </span>
      )}
      <p className="micro-label">{label}</p>
      <h2
        className={cn(
          "max-w-2xl font-heading text-3xl uppercase leading-[1.08] tracking-tight md:text-4xl",
          align === "center" && "mx-auto"
        )}
      >
        {title}
      </h2>
    </Reveal>
  );
}

export function Section({
  children,
  className,
  id,
  dark = false,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "relative",
        dark && "bg-foreground text-background",
        className
      )}
    >
      {children}
    </section>
  );
}

/** Container standard del layout. */
export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 md:px-8", className)}>{children}</div>;
}
