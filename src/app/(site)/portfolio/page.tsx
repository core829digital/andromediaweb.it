import { buildPageMetadata } from "@/lib/site-settings";
import { JsonLd, breadcrumbGraph } from "@/lib/seo";
import { site } from "@/lib/site-data";
import { ScrollWorks } from "@/components/site/scroll-sections";

export async function generateMetadata() {
  return buildPageMetadata("portfolio", {
    title: "Lavori",
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
            { name: "Lavori", path: "/portfolio" },
          ]),
          {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: "Lavori — Andromedia Web",
            url: `${site.url}/portfolio`,
            inLanguage: "it-IT",
            about: { "@id": `${site.url}/#organizzazione` },
          },
        ]}
      />

      <div className="pt-32 pb-24 md:pt-36">
        <h1 className="sr-only">Lavori — Progetti Andromedia Web</h1>
        <ScrollWorks title="Lavori" limit={24} showLink={false} />
      </div>
    </>
  );
}
