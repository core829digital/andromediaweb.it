import { Section, Container, SectionHeading } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { Icon } from "@/components/icons";
import { site } from "@/lib/site-data";
import { buildPageMetadata } from "@/lib/site-settings";
import { JsonLd, breadcrumbGraph } from "@/lib/seo";
import { ContactForm } from "@/components/site/contact-form";

export async function generateMetadata() {
  return buildPageMetadata("contatti", {
    title: "Contatti",
    description: "Parliamone di idee e progetti. Andromedia Web — Foiano della Chiana (AR), operativi 24/7.",
  });
}

const contactRows = [
  { icon: "mail" as const, label: "Email", value: site.contact.email, href: `mailto:${site.contact.email}` },
  { icon: "phone" as const, label: "Telefono", value: site.contact.phone, href: site.contact.phoneHref },
  { icon: "pin" as const, label: "Indirizzo", value: `${site.contact.address}, ${site.contact.city}`, href: site.contact.directions },
  { icon: "clock" as const, label: "Orari", value: site.contact.hours },
];

export default function ContattiPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbGraph([
            { name: "Home", path: "/" },
            { name: "Contatti", path: "/contatti" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Contatti — Andromedia Web",
            url: `${site.url}/contatti`,
            inLanguage: "it-IT",
            mainEntity: { "@id": `${site.url}/#organizzazione` },
          },
        ]}
      />

      <Section className="relative overflow-hidden pt-40 pb-16">
        <div className="grid-bg grid-bg-fade absolute inset-0" aria-hidden="true" />
        <Container>
          <Reveal>
            <p className="micro-label mb-6">Contatti — Avvia la trasmissione</p>
            <h1 className="font-heading text-5xl uppercase leading-[1.02] md:text-7xl">
              Parliamone di
              <br />
              <span className="text-outline">idee e progetti.</span>
            </h1>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="py-16">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Recapiti */}
            <div className="lg:col-span-2">
              <SectionHeading icon="mail" label="Recapiti" title="Canali diretti" />
              <div className="mt-8 divide-y divide-border border border-border">
                {contactRows.map((r) => {
                  const content = (
                    <>
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-muted-foreground">
                        <Icon name={r.icon} size={16} />
                      </span>
                      <div>
                        <p className="micro-label">{r.label}</p>
                        <p className="mt-1 text-sm text-foreground">{r.value}</p>
                      </div>
                      {r.href && (
                        <Icon name="arrow-up-right" size={14} className="ml-auto text-muted-foreground" />
                      )}
                    </>
                  );
                  return r.href ? (
                    <a
                      key={r.label}
                      href={r.href}
                      target={r.href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-5 transition-colors hover:bg-muted"
                    >
                      {content}
                    </a>
                  ) : (
                    <div key={r.label} className="flex items-center gap-4 p-5">
                      {content}
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 border border-border p-6">
                <p className="micro-label mb-3">Prenota un appuntamento</p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  Se hai bisogno di maggiori informazioni, vieni a trovarci nel
                  nostro studio. Saremo felici di conoscerti e di prendere un caffè insieme.
                </p>
                <a
                  href={site.contact.directions}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group mt-4 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
                >
                  Direzioni <Icon name="arrow-up-right" size={13} />
                </a>
              </div>
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <SectionHeading icon="send" label="Modulo" title="Scrivici ora" />
              <div className="mt-8">
                <ContactForm />
              </div>

              <div className="mt-10 border border-border p-7">
                <p className="micro-label mb-4">Oppure prenota direttamente una call</p>
                <iframe
                  src={`${site.contact.calendly.replace("?background=1", "")}?background=1&hide_gdpr_banner=1`}
                  title="Calendly — Prenota un appuntamento"
                  className="h-[560px] w-full border-0"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
