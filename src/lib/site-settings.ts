import "server-only";
import { ConvexHttpClient } from "convex/browser";
import { cacheTag } from "next/cache";
import { site, faq as faqFallback } from "@/lib/site-data";
import type { Metadata } from "next";

/* ========================= Tipi ========================= */

export interface SiteGlobal {
  name: string;
  tagline: string;
  email: string;
  phone: string;
  address: string;
  socials: Array<{ name: string; href: string; icon: string }>;
  toggles: { marquee: boolean; heroBadges: boolean; spaceCta: boolean };
}

export interface HeroContent {
  microLabel: string;
  titleA: string;
  titleB: string;
  subtitle: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
}

export interface SectionContent {
  label: string;
  title: string;
}

export interface HomeContent {
  hero: HeroContent;
  servizi: SectionContent;
  lavori: SectionContent;
  processo: SectionContent;
  visione: SectionContent;
  faq: SectionContent;
  spaceCta: { title: string; subtitle: string; button: string };
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface PageMetaOverride {
  title?: string;
  description?: string;
  keywords?: string;
  noindex?: boolean;
}

/* ========================= Lettura (cached per request) ========================= */

export async function getSetting(key: string): Promise<Record<string, unknown> | null> {
  "use cache";
  cacheTag("settings");
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  try {
    const c = new ConvexHttpClient(url);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc = (await c.query("settings:get" as any, { key })) as { value?: unknown } | null;
    return (doc?.value as Record<string, unknown>) ?? null;
  } catch {
    return null;
  }
}

/* ========================= Impostazioni globali ========================= */

export const GLOBAL_DEFAULT: SiteGlobal = {
  name: site.name,
  tagline: site.claim,
  email: site.contact.email,
  phone: site.contact.phone,
  address: `${site.contact.address} — ${site.contact.city}`,
  socials: site.socials.map((s) => ({ name: s.name, href: s.href, icon: s.icon })),
  toggles: { marquee: true, heroBadges: true, spaceCta: true },
};

export async function getGlobal(): Promise<SiteGlobal> {
  const s = await getSetting("global");
  if (!s) return GLOBAL_DEFAULT;
  const contact = (s.contact ?? {}) as Record<string, unknown>;
  const toggles = (s.toggles ?? {}) as Record<string, unknown>;
  return {
    name: typeof s.name === "string" && s.name.trim() ? s.name : GLOBAL_DEFAULT.name,
    tagline: typeof s.tagline === "string" && s.tagline.trim() ? s.tagline : GLOBAL_DEFAULT.tagline,
    email: typeof contact.email === "string" && contact.email.trim() ? contact.email : GLOBAL_DEFAULT.email,
    phone: typeof contact.phone === "string" && contact.phone.trim() ? contact.phone : GLOBAL_DEFAULT.phone,
    address: typeof contact.address === "string" && contact.address.trim() ? contact.address : GLOBAL_DEFAULT.address,
    socials:
      Array.isArray(s.socials) && s.socials.length > 0
        ? (s.socials as unknown[])
            .filter((x): x is Record<string, unknown> => typeof x === "object" && x !== null)
            .map((x) => ({
              name: String(x.name ?? ""),
              href: String(x.href ?? ""),
              icon: String(x.icon ?? "link"),
            }))
            .filter((x) => x.name && x.href)
        : GLOBAL_DEFAULT.socials,
    toggles: {
      marquee: toggles.marquee !== false,
      heroBadges: toggles.heroBadges !== false,
      spaceCta: toggles.spaceCta !== false,
    },
  };
}

/* ========================= Contenuti home ========================= */

function sec(s: Record<string, unknown> | null, key: string, fallback: SectionContent): SectionContent {
  const raw = (s?.[key] ?? {}) as Record<string, unknown>;
  return {
    label: str(raw, "label", fallback.label),
    title: str(raw, "title", fallback.title),
  };
}

function str(s: Record<string, unknown> | null, key: string, fallback: string): string {
  const v = s?.[key];
  return typeof v === "string" && v.trim() !== "" ? v : fallback;
}

function cta(s: Record<string, unknown> | null, key: string, fallback: { label: string; href: string }) {
  const raw = (s?.[key] ?? {}) as Record<string, unknown>;
  return {
    label: str(raw, "label", fallback.label),
    href: str(raw, "href", fallback.href),
  };
}

export async function getHomeContent(): Promise<HomeContent> {
  const s = await getSetting("content:home");
  const heroRaw = (s?.hero ?? {}) as Record<string, unknown>;
  const spaceCtaRaw = (s?.spaceCta ?? {}) as Record<string, unknown>;
  return {
    hero: {
      microLabel: str(heroRaw, "microLabel", "Consulenza Creativa"),
      titleA: str(heroRaw, "titleA", "Eleva il tuo"),
      titleB: str(heroRaw, "titleB", "futuro digitale"),
      subtitle: str(
        heroRaw,
        "subtitle",
        "Costruiamo siti web, e-commerce e strategie che trasformano la tua presenza online in un vantaggio competitivo."
      ),
      ctaPrimary: cta(heroRaw, "ctaPrimary", { label: "Inizia il tuo progetto", href: "/contatti" }),
      ctaSecondary: cta(heroRaw, "ctaSecondary", { label: "Guarda i lavori", href: "/portfolio" }),
    },
    servizi: sec(s, "servizi", { label: "Servizi - Modi in cui lavoriamo", title: "Un'agenzia, sei modi per crescere" }),
    lavori: sec(s, "lavori", { label: "Portfolio - Progetti selezionati", title: "Lavori che parlano da soli" }),
    processo: sec(s, "processo", { label: "Processo - Come lavoriamo", title: "Dal primo contatto alla stella fissa" }),
    visione: sec(s, "visione", { label: "Visione - Chi siamo", title: "Piccoli come una startup, veloci come una cometa" }),
    faq: sec(s, "faq", { label: "FAQ - Domande frequenti", title: "Tutto quello che vuoi sapere" }),
    spaceCta: {
      title: str(spaceCtaRaw, "title", "Pronto al lancio?"),
      subtitle: str(spaceCtaRaw, "subtitle", "Il futuro non aspetta — inizia oggi il tuo progetto digitale."),
      button: str(spaceCtaRaw, "button", "Contattaci"),
    },
  };
}

export async function getFaq(): Promise<FaqItem[]> {
  const s = await getSetting("content:faq");
  const items = (s?.items ?? null) as unknown;
  if (!Array.isArray(items)) return faqFallback.map((f) => ({ q: f.q, a: f.a }));
  const clean = items
    .filter((it): it is Record<string, unknown> => typeof it === "object" && it !== null)
    .map((it) => ({ q: String(it.q ?? ""), a: String(it.a ?? "") }))
    .filter((it) => it.q && it.a);
  return clean.length > 0 ? clean : faqFallback.map((f) => ({ q: f.q, a: f.a }));
}

/* ========================= SEO ========================= */

function titleCase(route: string): string {
  return route.charAt(0).toUpperCase() + route.slice(1);
}

/** Metadata di pagina: override admin (seo:<route>) con fallback statico. */
export async function buildPageMetadata(
  route: string,
  fallback: { title: string; description: string; keywords?: string }
): Promise<Metadata> {
  const [override, defaults] = await Promise.all([getSetting(`seo:${route}`), getSetting("seo:default")]);
  const raw = override ?? {};
  const dRaw = defaults ?? {};

  const title = str(raw, "title", fallback.title);
  const description = str(raw, "description", fallback.description);
  const keywords = str(raw, "keywords", fallback.keywords ?? "");
  const noindex = raw.noindex === true || dRaw.noindex === true;

  const siteName = typeof dRaw.siteName === "string" ? dRaw.siteName : site.name;

  return {
    title: title,
    description,
    ...(keywords ? { keywords: keywords.split(",").map((k) => k.trim()).filter(Boolean) } : {}),
    ...(noindex ? { robots: { index: false, follow: false } } : {}),
    openGraph: {
      title: title,
      description,
      siteName,
      type: "website",
      locale: "it_IT",
      images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: siteName }],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description,
      images: ["/opengraph-image.png"],
    },
  };
}

/** Route della pagina corrente per il pannello SEO. */
export const SEO_ROUTES = [
  { key: "home", label: "Home" },
  { key: "servizi", label: "Servizi" },
  { key: "portfolio", label: "Portfolio" },
  { key: "chi-siamo", label: "Chi siamo" },
  { key: "contatti", label: "Contatti" },
  { key: "blog", label: "Blog" },
] as const;

export { titleCase };
