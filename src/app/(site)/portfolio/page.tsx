import { Section, Container } from "@/components/section";
import { buildPageMetadata } from "@/lib/site-settings";
import { JsonLd, breadcrumbGraph } from "@/lib/seo";
import { site } from "@/lib/site-data";
import { PortfolioGrid } from "@/components/site/showcase";

export async function generateMetadata() {
  return buildPageMetadata("portfolio", {
    title: "Portfolio",
    description: "I lavori svolti da Andromedia Web: e-commerce, siti web, branding, social media e intelligenza artificiale.",
  });
}

export default function PortfolioPage() {
  return (
    <>
      <JsonLd
        data={[
          breadcrumbGraph([
            { name: "Home", path: "/" },
            { name: "Portfolio", path: "/portfolio" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Portfolio — Andromedia Web",
            url: `${site.url}/portfolio`,
            inLanguage: "it-IT",
            about: { "@id": `${site.url}/#organizzazione` },
          },
        ]}
      />

      <Section className="pt-32 pb-24 md:pt-36">
        <Container>
          <h1 className="sr-only">Portfolio — Progetti Andromedia Web</h1>
          <PortfolioGrid initial={6} step={6} />
        </Container>
      </Section>
    </>
  );
}
