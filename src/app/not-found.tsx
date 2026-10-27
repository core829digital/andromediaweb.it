import Link from "next/link";
import { Container, Section } from "@/components/section";

export default function NotFound() {
  return (
    <Section className="relative overflow-hidden pt-40 pb-28">
      <div className="grid-bg grid-bg-fade absolute inset-0" aria-hidden="true" />
      <Container className="max-w-3xl text-center">
        <p className="micro-label mb-6">Errore 404 — Segnale perso</p>
        <h1 className="font-heading text-7xl uppercase leading-none md:text-9xl">
          4<span className="text-outline">0</span>4
        </h1>
        <p className="mt-8 text-base text-muted-foreground">
          Questa traiettoria non esiste nell'universo Andromedia.
        </p>
        <Link
          href="/"
          className="group mt-10 inline-flex h-12 items-center gap-3 bg-foreground px-8 font-mono text-xs uppercase tracking-[0.22em] text-background transition-colors hover:bg-muted-foreground"
        >
          Torna a casa
        </Link>
      </Container>
    </Section>
  );
}
