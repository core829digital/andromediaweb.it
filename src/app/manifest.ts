import type { MetadataRoute } from "next";

/** Manifest web: icone installabili e colori coerenti col tema scuro del sito. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Andromedia Web",
    short_name: "Andromedia",
    description: "The future is now — Brand Identity, SEO, Social, Ads, AI e Sviluppo Web.",
    start_url: "/",
    id: "/",
    display: "browser",
    background_color: "#09090b",
    theme_color: "#09090b",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
