# Andromedia Web — andromediaweb.it

Sito ufficiale di **Andromedia Web** ("The future is now"), agenzia di marketing di Foiano della Chiana (AR). Rinnovo completo in stile **SaaS / Palantir**: bianco e nero, monospace, linee di tracciamento tra le sezioni, micro-animazioni su scroll e hover.

## Stack

- **Next.js 16** (App Router, TypeScript, Turbopack)
- **Tailwind CSS 4** + **shadcn/ui** (tema monocromatico, radius 0)
- **Lenis** per lo smooth scroll
- **Motion** (le animazioni 21st.dev-style) — reveal on scroll, hero animato, marquee
- **Icone 100% personalizzate** in `src/components/icons.tsx` (nessuna libreria icone)
- **Convex** per blog, portfolio e messaggi dal backoffice
- Font tondi coerenti col logo: Unbounded (display), Space Grotesk (testo), JetBrains Mono (label tecniche)

## Sviluppo locale

```bash
npm install
npm run dev        # http://localhost:3000
```

### Collegare Convex (blog + portfolio + backoffice)

```bash
npx convex dev     # crea il deployment, genera convex/_generated
```

Poi copia l'URL del deployment in `.env.local`:

```
NEXT_PUBLIC_CONVEX_URL=https://<deployment>.convex.cloud
```

Finché Convex non è collegato: il sito mostra il portfolio statico di fallback e il backoffice mostra la schermata "Collega Convex".

## Backoffice `/admin`

Accesso riservato alle credenziali configurate (default hardcoded in `src/lib/admin-credentials.ts`, sovrascrivibili via `AW_ADMIN_USERS` in `.env.local`). Dalla dashboard si possono:

- **Blog**: creare, modificare, pubblicare/rimandare in bozza, eliminare post (con copertina upload via Convex Storage)
- **Portfolio**: caricare lavori svolti (immagine, categoria, URL, descrizione, evidenza)
- **Messaggi**: leggere i contatti arrivati dal modulo su `/contatti`

La sessione è un cookie httpOnly firmato HMAC (7 giorni).

## Struttura

```
src/app/(site)/     → home, servizi, chi-siamo, portfolio, blog, contatti, privacy, cookie
src/app/admin/      → gate autenticazione + dashboard backoffice
convex/             → schema + funzioni (posts, portfolio, messages)
src/components/     → design system (icons, nav, footer, hero, reveal, trace-line…)
public/branding/    → asset del logo forniti dal cliente
```

## Contatti

- info@andromediaweb.it — (+39) 351 672 8359
- Corso Vittorio Emanuele, 37 — Foiano della Chiana 52045 (AR)
- P. IVA 02449760517 — Andromeda di Toni Serban
