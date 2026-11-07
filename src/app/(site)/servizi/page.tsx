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
import { buildPageMetadata } from "@/lib/site-settings";
import { JsonLd, breadcrumbGraph } from "@/lib/seo";
import { site } from "@/lib/site-data";
import { ScrollServices } from "@/components/site/scroll-sections";

export async function generateMetadata() {
  return buildPageMetadata("servizi", {
    title: "Servizi",
    description:
      "Brand Identity, Ottimizzazione SEO, Social Media Marketing, Sponsorizzazioni Advertising, Intelligenza Artificiale e Sviluppo Siti Web ed E-Commerce.",
  });
}

export default function ServiziPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbGraph([
            { name: "Home", path: "/" },
            { name: "Servizi", path: "/servizi" },
          ]),
          ...services.map((s) => ({
            "@context": "https://schema.org",
            "@type": "Service",
            name: s.title,
            description: s.desc,
            serviceType: s.title,
            url: `${site.url}/servizi#${s.id}`,
            areaServed: "IT",
            provider: { "@id": `${site.url}/#organizzazione` },
          })),
        ]}
      />

      {/* Header */}
      <Section className="relative overflow-hidden pt-40 pb-16">
        <Container>
          <Reveal>
            <h1 className="max-w-3xl font-heading text-[3.38rem] leading-[1.02] md:text-[5.4rem]">
              Sei orbite,
              <br />
              <span>un solo sistema.</span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-muted-foreground">
              &ldquo;Non vendere prodotti, racconta storie.&rdquo; — Seth Godin.
              Ogni azienda ha esigenze uniche: che si tratti di costruire un brand
              da zero o di portare la tua attività verso un&apos;evoluzione tecnologica,
              il nostro team è qui per supportarti.
            </p>
          </Reveal>
        </Container>
      </Section>

      {/* Servizi — scroll animation */}
      <ScrollServices title="Cosa facciamo" standalone />

      {/* Dettagli */}
      <Section>
        <Container className="max-w-4xl py-16 md:py-24">
          <SectionHeading title="Dettagli in profondità" />
          <div className="mt-10">
            <Accordion type="single" collapsible className="w-full">
              {services.map((s) => (
                <AccordionItem
                  key={s.id}
                  value={s.id}
                  className={"border-border"}
                >
                  <AccordionTrigger className="py-5 text-left hover:no-underline">
                    <span className="flex items-baseline gap-4 font-heading text-[1.01rem] leading-[1.55] tracking-wide">
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
        <Container className="py-16 md:py-24">
          <SectionHeading title="Scoperta → Strategia → Sviluppo → Lancio" />
          <div className="mt-10 grid gap-6 md:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <div className="flex h-full flex-col gap-4 border border-border p-7 transition-colors duration-500 hover:border-foreground">
                  <span className="font-mono text-xs text-muted-foreground">{p.index}</span>
                  <h3 className="font-heading text-[1.13rem] leading-[1.4]">{p.title}</h3>
                  <p className="text-sm text-muted-foreground">{p.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* CTA */}
      <Section>
        <Container className="py-16 md:py-24">
          <Reveal className="flex flex-col items-center text-center">
            <h2 className="max-w-2xl font-heading text-[2.03rem] leading-tight md:text-[3.38rem]">
              Parliamo del tuo progetto
            </h2>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <CallButton label="Parliamone" />
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
