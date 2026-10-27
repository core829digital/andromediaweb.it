"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon, type IconName } from "@/components/icons";
import { site } from "@/lib/site-data";
import { LogoMark } from "@/components/logo";
import { TraceLineH } from "@/components/trace-line";

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
    <footer className="relative mt-24 border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        <TraceLineH />

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="space-y-5">
            <p className="micro-label">Andromedia Web</p>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Design, tecnologia e marketing creano l'esperienza del brand.
              Esperienza che promuove la vostra attività nel mondo digitale.
            </p>
            <div className="flex gap-2">
              {site.socials.map((s) => (
                <a
                  key={s.name}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.name}
                  className="flex h-10 w-10 items-center justify-center border border-border text-muted-foreground transition-all duration-300 hover:-translate-y-1 hover:border-foreground hover:text-foreground"
                >
                  <Icon name={s.icon as IconName} size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Sitemap */}
          {linkGroups.map((g) => (
            <div key={g.title} className="space-y-4">
              <p className="micro-label">{g.title}</p>
              <ul className="space-y-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="h-px w-0 bg-foreground transition-all duration-300 group-hover:w-4" />
                      {l.label}
                    </Link>
                  </li>
                ))}
                {legalLinks.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <span className="h-px w-0 bg-foreground transition-all duration-300 group-hover:w-4" />
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contatti */}
          <div className="space-y-4">
            <p className="micro-label">Contatti</p>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex items-center gap-3">
                <Icon name="mail" size={15} />
                <a href={`mailto:${site.contact.email}`} className="hover:text-foreground">
                  {site.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="phone" size={15} />
                <a href={site.contact.phoneHref} className="hover:text-foreground">
                  {site.contact.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Icon name="pin" size={15} className="mt-0.5 shrink-0" />
                <span>
                  {site.contact.address}
                  <br />
                  {site.contact.city}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Icon name="clock" size={15} />
                {site.contact.hours}
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="mt-14 flex flex-col gap-6 border-t border-border pt-10 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="micro-label mb-2">Newsletter</p>
            <p className="text-sm text-muted-foreground">
              Un segnale spaziale, ogni tanto. Zero spam.
            </p>
          </div>
          {subscribed ? (
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-foreground">
              <Icon name="check" size={15} /> Iscrizione avvenuta
            </p>
          ) : (
            <form
              className="flex max-w-sm flex-1 justify-end"
              onSubmit={(e) => {
                e.preventDefault();
                if (email.includes("@")) setSubscribed(true);
              }}
            >
              <div className="flex w-full max-w-sm">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="la-tua@email.it"
                  className="h-11 w-full border border-border bg-transparent px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-foreground"
                />
                <button
                  type="submit"
                  aria-label="Iscriviti"
                  className="flex h-11 w-11 shrink-0 items-center justify-center bg-foreground text-background transition-colors hover:bg-muted-foreground"
                >
                  <Icon name="arrow-right" size={16} />
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground md:flex-row">
          <p>
            © {year ?? 2026} {site.name} — P. IVA: {site.legal.piva}
          </p>
          <p>{site.claim}</p>
          <Link href="/admin" className="transition-colors hover:text-foreground">
            Backoffice
          </Link>
        </div>

        {/* Logomark gigante decorativo */}
        <div className="pointer-events-none mt-14 flex justify-center opacity-[0.06]">
          <LogoMark className="h-40 md:h-64" />
        </div>
      </div>
    </footer>
  );
}
