import Link from "next/link";
import { site, services, process, faq, keyPoints } from "@/lib/site-data";
import { Hero } from "@/components/site/hero";
import { PortfolioSection, HomeFeatureMarquee } from "@/components/site/showcase";
import { SectionHeading, Section, Container } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { TraceNode, ColorFade } from "@/components/trace-line";
import { SpaceCta } from "@/components/site/space-cta";
import { Icon } from "@/components/icons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HomeFeatureMarquee />

      {/* Servizi */}
      <Section id="servizi" dark className="scroll-mt-20">
        <Container className="py-24 md:py-32">
          <div className="mb-16 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              icon="star"
              label="Servizi — Modi in cui lavoriamo"
              title="Un'agenzia, sei orbite operative"
              className="text-background"
            />
            <Reveal delay={0.15}>
              <p className="max-w-sm text-sm leading-relaxed text-background/60">
                &ldquo;Non vendere prodotti, racconta storie.&rdquo; — Seth Godin.
                Ogni azienda ha esigenze uniche: noi costruiamo la rotta giusta per la tua.
              </p>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <Reveal key={s.id} delay={(i % 3) * 0.1}>
                <Link
                  href={`/servizi#${s.id}`}
                  className="group relative flex h-full flex-col gap-6 border border-background/12 p-8 transition-all duration-500 hover:border-background/40 hover:bg-background/[0.03]"
                >
                  <div className="flex items-center justify-between">
                    <Icon name={s.icon} size={26} className="text-background/70 transition-colors duration-300 group-hover:text-background" />
                    <span className="font-mono text-xs text-background/30">{s.index}</span>
                  </div>
                  <h3 className="font-heading text-xl uppercase leading-snug whitespace-pre-line">
                    {s.short}
                  </h3>
                  <p className="text-sm leading-relaxed text-background/55">{s.desc}</p>
                  <span className="mt-auto inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-background/50 transition-colors group-hover:text-background">
                    Dettagli <Icon name="arrow-right" size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      {/* nero → bianco, transizione smooth on scroll */}
      <ColorFade from="dark" to="light" />

      {/* Visione & Missione */}
      <Section>
        <Container className="py-24 md:py-32">
          <SectionHeading
            icon="compass"
            label="Visione & Missione"
            title="L'unico limite è la tua mente."
          />
          <div className="mt-12 grid gap-12 lg:grid-cols-2">
            <Reveal delay={0.1}>
              <p className="text-lg leading-relaxed text-muted-foreground">
                Il nostro lavoro si fonda su concetti strategici e creativi,
                creando marchi, progettando siti web e offrendo esperienze
                digitali eccezionali.
              </p>
              <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
                Design, tecnologia e marketing creano l'esperienza del brand.
                Esperienza che promuove la vostra attività nel mondo digitale.
              </p>
              <div className="mt-10 flex flex-wrap gap-3">
                {["Strategia", "Creatività", "Tecnologia", "Empatia"].map((t) => (
                  <span
                    key={t}
                    className="border border-border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </Reveal>
            <div className="grid gap-6 sm:grid-cols-2">
              {keyPoints.map((k, i) => (
                <Reveal key={k.title} delay={0.05 * i}>
                  <div className="group flex h-full flex-col gap-3 border border-border p-6 transition-colors duration-500 hover:border-foreground">
                    <Icon name={k.icon} size={22} className="text-muted-foreground transition-colors group-hover:text-foreground" />
                    <p className="font-heading text-sm uppercase tracking-wide">{k.title}</p>
                    <p className="text-xs leading-relaxed text-muted-foreground">{k.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      <TraceNode />

      {/* Lavori */}
      <Section id="lavori">
        <Container className="py-24 md:py-32">
          <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading
              icon="eye"
              label="Lavori — Esperienza e progetti"
              title="Costruiamo storie che risuonano"
            />
            <Reveal delay={0.15}>
              <Link
                href="/portfolio"
                className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Vedi il portfolio completo
                <Icon name="arrow-right" size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
          <PortfolioSection limit={6} />
        </Container>
      </Section>

      <ColorFade from="light" to="dark" />

      {/* Processo */}
      <Section id="processo" dark>
        <Container className="py-24 md:py-32">
          <SectionHeading
            icon="evolve"
            label="Processo — Come"
            title="Lavoriamo all'incrocio tra strategia, creatività e tecnologia"
            className="text-background"
          />
          <div className="relative mt-16 grid gap-px bg-background/10 md:grid-cols-4">
            {process.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.12} className="h-full">
                <div className="group relative flex h-full flex-col gap-6 bg-foreground p-8 transition-colors duration-500 hover:bg-foreground/[0.85]">
                  <span className="font-mono text-xs text-background/40">{p.index}</span>
                  <h3 className="font-heading text-2xl uppercase">{p.title}</h3>
                  <p className="text-sm text-background/60">{p.desc}</p>
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-0 bg-background/70 transition-all duration-700 group-hover:w-full"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </Section>

      <ColorFade from="dark" to="light" />

      {/* FAQ */}
      <Section>
        <Container className="max-w-4xl py-24 md:py-32">
          <SectionHeading icon="node" label="Domande frequenti" title="FAQ" align="center" />
          <div className="mt-12">
            <Accordion type="single" collapsible className="w-full">
              {faq.map((f, i) => (
                <AccordionItem key={i} value={`f-${i}`} className="border-border">
                  <AccordionTrigger className="py-5 text-left font-heading text-base uppercase tracking-wide hover:no-underline">
                    <span className="flex items-baseline gap-4">
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
        </Container>
      </Section>

      {/* CTA finale — fullscreen con nave argento scroll-driven */}
      <ColorFade from="light" to="dark" />
      <SpaceCta />
      <ColorFade from="dark" to="light" node={false} />
    </>
  );
}
