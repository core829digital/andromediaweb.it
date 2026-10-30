import { site } from "@/lib/site-data";

/**
 * Dati strutturati JSON-LD per i motori di ricerca (schema.org).
 */

export function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

const orgId = `${site.url}/#organizzazione`;

export function organizationGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": orgId,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    slogan: site.claim,
    description: site.description,
    image: `${site.url}/opengraph-image.png`,
    logo: `${site.url}/icon.png`,
    email: site.contact.email,
    telephone: "+393516728359",
    priceRange: "€€",
    address: {
      "@type": "PostalAddress",
      streetAddress: site.contact.address,
      addressLocality: "Foiano della Chiana",
      addressRegion: "AR",
      postalCode: "52045",
      addressCountry: "IT",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "00:00",
      closes: "23:59",
    },
    sameAs: site.socials.map((s) => s.href),
  };
}

export function websiteGraph(): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${site.url}/#sito`,
    url: site.url,
    name: site.name,
    inLanguage: "it-IT",
    publisher: { "@id": orgId },
  };
}

export function breadcrumbGraph(items: Array<{ name: string; path: string }>): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${site.url}${it.path}`,
    })),
  };
}
