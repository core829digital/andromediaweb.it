"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { LogoFull } from "@/components/logo";
import { site } from "@/lib/site-data";

const legalLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/cookie", label: "Cookie" },
];

const linkGroups = [
  {
    title: "Sitemap",
    links: [
      { href: "/", label: "Home" },
      { href: "/servizi", label: "Servizi" },
      { href: "/chi-siamo", label: "Chi siamo" },
      { href: "/portfolio", label: "Portfolio" },
      { href: "/blog", label: "Blog" },
      { href: "/contatti", label: "Contatti" },
    ],
  },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [year, setYear] = useState<number | null>(null);
  useEffect(() => setYear(new Date().getFullYear()), []);

  return (
    <footer className="relative mt-14 bg-background">
      <div className="mx-auto max-w-7xl px-5 py-10 md:px-8">
        <div className="mb-8 flex flex-col gap-6 pb-8 md:flex-row md:items-center md:justify-between">
          <LogoFull className="h-9 md:h-11" />
          <div className="flex gap-2">
            {site.socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="flex h-9 w-9 items-center justify-center border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-0.5 hover:border-foreground hover:text-foreground"
              >
                <Icon name={s.icon as IconName} size={15} />
              </a>
            ))}
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-3">
            <p className="micro-label">Andromedia Web</p>
            <p className="text-xs leading-relaxed text-muted-foreground">
              Design, tecnologia e marketing creano l'esperienza del brand,
              per promuovere la vostra attività nel mondo digitale.
            </p>
          </div>

          {/* Sitemap */}
          <div className="space-y-3">
            <p className="micro-label">Sitemap</p>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 md:grid-cols-1">
              {linkGroups[0].links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              {legalLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contatti */}
          <div className="space-y-3">
            <p className="micro-label">Contatti</p>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li className="flex items-center gap-2.5">
                <Icon name="mail" size={13} />
                <a href={`mailto:${site.contact.email}`} className="hover:text-foreground">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="phone" size={13} />
                <a href={site.contact.phoneHref} className="hover:text-foreground">
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-2.5">
                <Icon name="pin" size={13} className="mt-0.5 shrink-0" />
                <span>
                  {site.contact.address} — {site.contact.city}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Icon name="clock" size={13} />
                {site.contact.hours}
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <p className="micro-label">Newsletter</p>
            {subscribed ? (
              <p className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-foreground">
                <Icon name="check" size={13} /> Iscrizione avvenuta
              </p>
            ) : (
              <form
                className="flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.includes("@")) setSubscribed(true);
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="la-tua@email.it"
                  className="h-9 w-full border border-border bg-transparent px-3 text-xs outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground"
                />
                <button
                  type="submit"
                  aria-label="Iscriviti"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-colors hover:bg-muted-foreground"
                >
                  <Icon name="arrow-right" size={14} />
                </button>
              </form>
            )}
            <p className="text-[10px] text-muted-foreground/70">
              Un segnale spaziale, ogni tanto. Zero spam.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-2 pb-2 font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground md:flex-row">
          <p>
            © {year ?? 2026} {site.name} — P. IVA: {site.legal.piva}
          </p>
          <p>{site.claim}</p>
          <Link href="/admin" className="transition-colors hover:text-foreground">
            Backoffice
          </Link>
        </div>
      </div>
    </footer>
  );
}
