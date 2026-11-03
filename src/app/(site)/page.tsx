import { site, services } from "@/lib/site-data";
import { buildPageMetadata, getHomeContent } from "@/lib/site-settings";
import { JsonLd } from "@/lib/seo";
import { Hero } from "@/components/site/hero";
import { ScrollServices, ScrollWorks } from "@/components/site/scroll-sections";
import { SpaceCta } from "@/components/site/space-cta";

export async function generateMetadata() {
  return buildPageMetadata("home", {
    title: "Andromedia Web — The future is now",
    description: site.description,
    keywords:
      "agenzia marketing, sviluppo siti web, e-commerce, seo, social media, brand identity, intelligenza artificiale, Foiano della Chiana, Arezzo",
  });
}

export default async function HomePage() {
  const content = await getHomeContent();

  return (
    <>
      <Hero content={content.hero} />

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Servizi Andromedia Web",
            itemListElement: services.map((s, i) => ({
              "@type": "ListItem",
              position: i + 1,
              item: {
                "@type": "Service",
                name: s.title,
                description: s.desc,
                url: `${site.url}/servizi#${s.id}`,
                provider: { "@id": `${site.url}/#organizzazione` },
              },
            })),
          },
        ]}
      />

      {/* Servizi — scroll animation orizzontale */}
      <section id="servizi" className="scroll-mt-24 pt-10 md:pt-16">
        <ScrollServices title={content.servizi.title} />
      </section>

      {/* Lavori — card impilate con scroll animation */}
      <section id="lavori" className="scroll-mt-24 pt-24 md:pt-32">
        <ScrollWorks title={content.lavori.title} limit={6} />
      </section>

      {/* CTA finale */}
      <SpaceCta />
    </>
  );
}
