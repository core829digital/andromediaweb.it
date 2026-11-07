"use client";

import { useEffect, useState } from "react";
import {
  LANG_STORAGE_KEY,
  SITE_LANGUAGES,
  startAutoTranslate,
  type SiteLang,
} from "@/lib/auto-translate";

/**
 * Selettore lingua del footer. La traduzione è automatica e client-side:
 * la lingua scelta viene salvata in localStorage e la pagina viene tradotta
 * al volo (con cache), senza cambiare URL né ricaricare contenuti server.
 */
export function LanguageSwitcher() {
  const [lang, setLang] = useState<SiteLang>("it");

  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(LANG_STORAGE_KEY);
    } catch {
      saved = null;
    }

    const valid = SITE_LANGUAGES.some((l) => l.code === saved);
    if (!saved || !valid || saved === "it") return;

    const next = saved as SiteLang;
    document.documentElement.lang = next;
    const stop = startAutoTranslate(next);
    // Aggiorna il select dopo l'idratazione, senza setState sincrono nell'effect.
    const timer = window.setTimeout(() => setLang(next), 0);

    return () => {
      window.clearTimeout(timer);
      stop();
    };
  }, []);

  function change(next: SiteLang) {
    try {
      if (next === "it") localStorage.removeItem(LANG_STORAGE_KEY);
      else localStorage.setItem(LANG_STORAGE_KEY, next);
    } catch {
      // localStorage non disponibile: la scelta vale solo per questa pagina
    }
    location.reload();
  }

  return (
    <div className="notranslate mt-4" translate="no">
      <div className="flex items-center gap-2">
        <label htmlFor="site-language" className="micro-label">
          Lingua
        </label>
        <select
          id="site-language"
          value={lang}
          onChange={(e) => change(e.target.value as SiteLang)}
          aria-label="Cambia lingua del sito"
          className="h-8 cursor-pointer rounded-lg border border-border bg-background px-2 font-sans text-[10px] uppercase tracking-[0.15em] text-muted-foreground outline-none transition-colors hover:border-foreground focus:border-foreground"
        >
          {SITE_LANGUAGES.map((l) => (
            <option key={l.code} value={l.code}>
              {l.label}
            </option>
          ))}
        </select>
      </div>
      <p className="mt-2 text-[9px] leading-relaxed text-muted-foreground/70">
        Traduzione automatica
      </p>
    </div>
  );
}
