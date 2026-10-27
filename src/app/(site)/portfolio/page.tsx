import type { Metadata } from "next";
import { Section, Container } from "@/components/section";
import { PortfolioSection } from "@/components/site/showcase";
import { Reveal } from "@/components/reveal";
import { CallButton } from "@/components/call-button";

export const metadata: Metadata = {
  title: "Portfolio",
  description: "I lavori svolti da Andromedia Web: e-commerce, siti web, branding, social media e intelligenza artificiale.",
};

export default function PortfolioPage() {
  return (
    <>
      <Section className="relative overflow-hidden pt-40 pb-16">
        <div className="grid-bg grid-bg-fade absolute inset-0" aria-hidden="true" />
        <Container>
          <Reveal>
            <p className="micro-label mb-6">Lavori — Esperienza e progetti</p>
            <h1 className="max-w-3xl font-heading text-5xl uppercase leading-[1.02] md:text-7xl">
              Progetti
              <br />
              <span className="text-outline">in orbita.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
              Ogni progetto è un sistema vivente: strategia, design e tecnologia
              disposti su un'unica traiettoria.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="py-16 pb-28">
          <PortfolioSection limit={24} />
        </Container>
      </Section>
      <Section>
        <Container className="py-24">
          <Reveal className="flex flex-col items-center text-center">
            <p className="micro-label mb-5">Il tuo progetto è il prossimo</p>
            <h2 className="max-w-2xl font-heading text-3xl uppercase leading-tight md:text-5xl">
              Mettiamolo in orbita
            </h2>
            <CallButton label="Prenota una call" className="mt-9" />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
