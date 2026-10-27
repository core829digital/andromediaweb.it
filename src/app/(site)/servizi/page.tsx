import type { Metadata } from "next";
import { services, process } from "@/lib/site-data";
import { Section, Container, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { CallButton } from "@/components/call-button";
import { Icon } from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Servizi",
  description:
    "Brand Identity, Ottimizzazione SEO, Social Media Marketing, Sponsorizzazioni Advertising, Intelligenza Artificiale e Sviluppo Siti Web ed E-Commerce.",
};

export default function ServiziPage() {
  return (
    <>
      {/* Header */}
      <Section className="relative overflow-hidden pt-40 pb-16">
        <div className="grid-bg grid-bg-fade absolute inset-0" aria-hidden="true" />
        <Container>
          <Reveal>
            <p className="micro-label mb-6">Servizi — Modi in cui lavoriamo</p>
            <h1 className="max-w-3xl font-heading text-5xl uppercase leading-[1.02] md:text-7xl">
              Sei orbite,
              <br />
              <span className="text-outline">un solo sistema.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
              &ldquo;Non vendere prodotti, racconta storie.&rdquo; — Seth Godin.
              Ogni azienda ha esigenze uniche: che si tratti di costruire un brand
              da zero o di portare la tua attività verso un'evoluzione tecnologica,
              il nostro team è qui per supportarti.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Servizi overview */}
      <Section>
        <Container className="py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.08}>
                <div
                  id={s.id}
                  className="group relative flex h-full scroll-mt-24 flex-col gap-5 border border-border p-8 transition-colors duration-500 hover:border-foreground"
                >
                  <div className="flex items-center justify-between">
                    <Icon name={s.icon} size={24} className="text-muted-foreground transition-colors group-hover:text-foreground" />
                    <span className="font-mono text-xs text-muted-foreground/50">{s.index}</span>
                  </div>
                  <h2 className="font-heading text-xl uppercase whitespace-pre-line">{s.short}</h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>
      {/* Dettagli */}
      <Section>
        <Container className="max-w-4xl py-24">
          <SectionHeading
            icon="node"
            label="La nostra attività"
            title="Dettagli in profondità"
          />
          <div className="mt-10">
            <Accordion type="single" collapsible className="w-full">
              {services.map((s, i) => (
                <AccordionItem
                  key={s.id}
                  value={s.id}
                  className={"border-border"}
                >
                  <AccordionTrigger className="py-5 text-left hover:no-underline">
                    <span className="flex items-baseline gap-4 font-heading text-base uppercase tracking-wide">
                      <span className="font-mono text-xs text-muted-foreground/60">{s.index}</span>
                      {s.title}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="pb-6 pl-9 text-sm leading-relaxed text-muted-foreground">
                    {s.desc}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Container>
      </Section>
      {/* Processo */}
      <Section>
        <Container className="py-24">
          <SectionHeading icon="evolve" label="Processo" title="Scoperta → Strategia → Sviluppo → Lancio" />
          <div className="mt-12 grid gap-6 md:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="flex h-full flex-col gap-4 border border-border p-7 transition-colors duration-500 hover:border-foreground">
                  <span className="font-mono text-xs text-muted-foreground">{p.index}</span>
                  <h3 className="font-heading text-lg uppercase">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container className="py-24">
          <Reveal className="flex flex-col items-center text-center">
            <p className="micro-label mb-5">Eleva il tuo Brand</p>
            <h2 className="max-w-2xl font-heading text-3xl uppercase leading-tight md:text-5xl">
              Parliamo del tuo progetto
            </h2>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CallButton label="Prenota una call" />
              <Link
                href="/contatti"
                className="flex h-12 items-center gap-3 rounded-full border border-border px-7 font-mono text-xs uppercase tracking-[0.22em] text-foreground transition-colors hover:border-foreground"
              >
                Contatti <Icon name="arrow-right" size={14} />
              </Link>
            </div>
          </Reveal>
        </Container>
      </Section>
    </>
  );
}
