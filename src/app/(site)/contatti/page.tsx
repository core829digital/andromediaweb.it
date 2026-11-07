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
        <Container>
          <Reveal>
            <h1 className="font-heading text-6xl leading-[1.02] md:text-8xl">
              Parliamo di Idee e Progetti
            </h1>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="py-16">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Recapiti */}
            <div className="lg:col-span-2">
              <SectionHeading title="Canali diretti" />
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
            </div>

            {/* Form */}
            <div className="lg:col-span-3">
              <SectionHeading title="Scrivici ora" />
              <div className="mt-8">
                <ContactForm />
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
