import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site-data";
import { SmoothScroll } from "@/components/smooth-scroll";

// Saans (Displaay) è un font commerciale: il sito usa "Saans" se installato
// localmente, altrimenti il fallback libero Inter (look neutro e friendly,
// vicino al mood di ChatGPT).
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — The Future is Now`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "agenzia marketing",
    "brand identity",
    "siti web",
    "ecommerce",
    "SEO",
    "social media",
    "intelligenza artificiale",
    "Foiano della Chiana",
    "Arezzo",
  ],
  openGraph: {
    type: "website",
    locale: "it_IT",
    siteName: site.name,
    url: site.url,
    title: `${site.name} — The Future is Now`,
    description: site.description,
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
};

// Tema iniziale: preferenza salvata oppure tema di sistema; se l'utente non
// ha mai scelto, segue in tempo reale i cambi del sistema operativo.
const themeInit = `(function(){try{var d=document.documentElement;var mq=window.matchMedia("(prefers-color-scheme: dark)");var saved=localStorage.getItem("aw-theme");var apply=function(dark){d.classList.toggle("dark",dark);};apply(saved?saved==="dark":mq.matches);if(mq.addEventListener){mq.addEventListener("change",function(e){try{if(!localStorage.getItem("aw-theme"))apply(e.matches);}catch(_){}});}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {/* anti-FOUC: il tema viene impostato prima del primo paint. Il tag
            script è serializzato come stringa (innerHTML) e NON è un nodo
            React, così il browser lo esegue al parse senza che React provi
            a "renderizzare" uno script lato client (nessun warning). */}
        <div
          hidden
          dangerouslySetInnerHTML={{ __html: `<script>${themeInit}</script>` }}
        />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
