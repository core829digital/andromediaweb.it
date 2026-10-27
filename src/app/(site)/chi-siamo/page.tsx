import type { Metadata } from "next";
import { keyPoints, faq } from "@/lib/site-data";
import { Section, Container, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CallButton } from "@/components/call-button";
import { Icon } from "@/components/icons";
import { HomeFeatureMarquee } from "@/components/site/showcase";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const metadata: Metadata = {
  title: "Chi siamo",
  description:
    "Andromedia Web: attraverso il lavoro e le relazioni umane plasmiamo il nostro percorso. Esperienza, direzione, organizzazione, team, evoluzione e umanità.",
};

export default function ChiSiamoPage() {
  return (
    <>
      <Section className="relative overflow-hidden pt-40 pb-16">
        <div className="grid-bg grid-bg-fade absolute inset-0" aria-hidden="true" />
        <Container>
          <Reveal>
            <p className="micro-label mb-6">Info — Chi siamo</p>
            <h1 className="max-w-3xl font-heading text-5xl uppercase leading-[1.02] md:text-7xl">
              Esseri umani
              <br />
              <span className="text-outline">che creano per esseri umani.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
              Ti aiutiamo ad elevare il tuo Brand. Attraverso il lavoro e le
              relazioni umane plasmiamo il nostro percorso, a ogni tappa.
            </p>
          </Reveal>
        </Container>
      </Section>

      <HomeFeatureMarquee />

      <Section>
        <Container className="py-24">
          <SectionHeading
            icon="team"
            label="Punti chiave"
            title="Sei coordinate, una sola direzione"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {keyPoints.map((k, i) => (
              <Reveal key={k.title} delay={(i % 3) * 0.08}>
                <div className="group flex h-full flex-col gap-4 border border-border p-8 transition-all duration-500 hover:border-foreground hover:translate-y-[-2px]">
                  <span className="flex h-12 w-12 items-center justify-center border border-border text-muted-foreground transition-colors duration-300 group-hover:bg-foreground group-hover:text-background">
                    <Icon name={k.icon} size={20} />
                  </span>
                  <h3 className="mt-2 font-heading text-lg uppercase">{k.title}</h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">{k.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
      <Section>
        <Container className="py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <p className="font-heading text-3xl uppercase leading-snug md:text-4xl">
              Costruiamo storie avvincenti,
              <br />
              <span className="text-outline">che risuonano con il tuo pubblico.</span>
            </p>
          </Reveal>
        </Container>
      </Section>
      {/* FAQ */}
      <Section>
        <Container className="max-w-4xl py-24">
          <SectionHeading icon="node" label="Domande frequenti" title="FAQ" />
          <div className="mt-10">
            <Accordion type="single" collapsible className="w-full">
              {faq.map((f, i) => (
                <AccordionItem key={i} value={`cs-${i}`} className="border-border">
                  <AccordionTrigger className="py-5 text-left hover:no-underline">
                    <span className="flex items-baseline gap-4 font-heading text-base uppercase tracking-wide">
                      <span className="font-mono text-xs text-muted-foreground">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      {f.q}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pl-10 text-sm leading-relaxed text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <Reveal className="mt-14 flex flex-col items-center gap-5 border border-border p-10 text-center">
            <p className="micro-label">Hai bisogno di aiuto?</p>
            <h3 className="font-heading text-2xl uppercase">Scrivici — rispondiamo 24/7</h3>
            <CallButton label="Prenota una call" className="mt-2" />
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
