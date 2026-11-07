import Link from "next/link";
import { Container, Section } from "@/components/section";

export default function NotFound() {
  return (
    <Section className="relative overflow-hidden pt-40 pb-28">
      <Container className="max-w-3xl text-center">
        <h1 className="font-heading text-[5.4rem] leading-none md:text-[9rem]">
          4<span>0</span>4
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
