import type { Metadata, Viewport } from "next";
import { Unbounded, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site-data";
import { SmoothScroll } from "@/components/smooth-scroll";

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
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
    images: [{ url: "/branding/thefutureisnow-black-tran.png", width: 1200, height: 630 }],
  },
  icons: { icon: "/branding/icon-do.png" },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="it"
      className={`${unbounded.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
