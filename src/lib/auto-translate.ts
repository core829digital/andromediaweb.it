/**
 * Traduzione automatica client-side (Google Translate, endpoint pubblico).
 *
 * Il testo viene tradotto in batch: ogni stringa è preceduta da un marcatore
 * `[[n]]` che Google preserva, così possiamo rimappare le traduzioni ai nodi
 * originali senza toccare la struttura HTML (e quindi React).
 *
 * Le traduzioni sono memorizzate in sessionStorage per lingua, così la
 * navigazione tra le pagine non ripete le richieste.
 */

export const SITE_LANGUAGES = [
  { code: "it", label: "Italiano" },
  { code: "en", label: "English" },
  { code: "es", label: "Español" },
  { code: "fr", label: "Français" },
  { code: "sv", label: "Svenska" },
] as const;

export type SiteLang = (typeof SITE_LANGUAGES)[number]["code"];

export const LANG_STORAGE_KEY = "aw-lang";

const SKIP_SELECTOR =
  ".notranslate, [translate='no'], script, style, noscript, svg, canvas, textarea, input, select, option";
const HAS_LETTERS = /[A-Za-zÀ-ÖØ-öø-ÿ]/;
const ATTRS = ["placeholder", "aria-label", "title", "alt"] as const;
const MARKER_RE = /\[\[(\d+)\]\]\s*/g;
const MAX_BATCH_CHARS = 1500;
const MAX_BATCH_ITEMS = 30;

const memoryCache = new Map<SiteLang, Map<string, string>>();
const translatedNodes = new WeakMap<Text, string>();
const translatedAttrs = new WeakMap<Element, Map<string, string>>();

function storageKey(lang: SiteLang) {
  return `aw-translations:${lang}`;
}

function getCache(lang: SiteLang): Map<string, string> {
  const cached = memoryCache.get(lang);
  if (cached) return cached;

  const map = new Map<string, string>();
  try {
    const raw = sessionStorage.getItem(storageKey(lang));
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, string>;
      for (const [k, v] of Object.entries(parsed)) map.set(k, v);
    }
  } catch {
    // sessionStorage non disponibile: si prosegue senza cache persistente
  }
  memoryCache.set(lang, map);
  return map;
}

function persistCache(lang: SiteLang, map: Map<string, string>) {
  try {
    const obj: Record<string, string> = {};
    let size = 0;
    for (const [k, v] of map) {
      if (size + k.length + v.length > 180_000) break;
      obj[k] = v;
      size += k.length + v.length;
    }
    sessionStorage.setItem(storageKey(lang), JSON.stringify(obj));
  } catch {
    // quota superata: la cache in memoria resta valida
  }
}

function chunkTexts(texts: string[]): string[][] {
  const chunks: string[][] = [];
  let current: string[] = [];
  let chars = 0;

  for (const text of texts) {
    if (current.length >= MAX_BATCH_ITEMS || chars + text.length > MAX_BATCH_CHARS) {
      if (current.length) chunks.push(current);
      current = [];
      chars = 0;
    }
    current.push(text);
    chars += text.length + 10;
  }
  if (current.length) chunks.push(current);
  return chunks;
}

function parseTranslation(output: string, count: number): Map<number, string> {
  const pieces = new Map<number, string>();
  let lastIndex = -1;
  let cursor = 0;
  let match: RegExpExecArray | null;

  MARKER_RE.lastIndex = 0;
  while ((match = MARKER_RE.exec(output))) {
    if (lastIndex >= 0) {
      pieces.set(lastIndex, output.slice(cursor, match.index).trim());
    }
    lastIndex = Number(match[1]);
    cursor = MARKER_RE.lastIndex;
  }
  if (lastIndex >= 0) pieces.set(lastIndex, output.slice(cursor).trim());

  // Se qualche marcatore è andato perso, meglio lasciare l'originale.
  if (pieces.size !== count) return new Map();
  return pieces;
}

async function translateChunk(texts: string[], lang: SiteLang): Promise<Map<number, string>> {
  const q = texts.map((text, i) => `[[${i}]] ${text}`).join(" ");
  const url =
    "https://translate.googleapis.com/translate_a/single?client=gtx&sl=it" +
    `&tl=${lang}&dt=t&q=${encodeURIComponent(q)}`;

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as unknown;
      const segments = (data as [string, ...unknown[]][][])[0];
      if (!Array.isArray(segments)) throw new Error("Risposta non valida");
      const output = segments.map((segment) => String(segment[0] ?? "")).join("");
      const parsed = parseTranslation(output, texts.length);
      if (parsed.size) return parsed;
      throw new Error("Marcatori non riconosciuti");
    } catch {
      if (attempt === 0) await new Promise((resolve) => setTimeout(resolve, 600));
    }
  }
  return new Map();
}

/** Traduce una lista di stringhe, usando la cache quando possibile. */
export async function translateTexts(texts: string[], lang: SiteLang): Promise<Map<string, string>> {
  const cache = getCache(lang);
  const unique = [...new Set(texts.filter((text) => text && HAS_LETTERS.test(text)))];
  const missing = unique.filter((text) => !cache.has(text));

  for (const chunk of chunkTexts(missing)) {
    const translated = await translateChunk(chunk, lang);
    for (const [index, value] of translated) {
      const source = chunk[index];
      if (source && value) cache.set(source, value);
    }
  }

  if (missing.length) persistCache(lang, cache);

  const result = new Map<string, string>();
  for (const text of unique) {
    const value = cache.get(text);
    if (value) result.set(text, value);
  }
  return result;
}

interface TextEntry {
  node: Text;
  lead: string;
  body: string;
  trail: string;
}

function collectTexts(root: ParentNode): TextEntry[] {
  const entries: TextEntry[] = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode();

  while (node) {
    const text = node as Text;
    const parent = text.parentElement;
    const value = text.nodeValue ?? "";

    if (
      parent &&
      !parent.closest(SKIP_SELECTOR) &&
      translatedNodes.get(text) !== value &&
      HAS_LETTERS.test(value) &&
      value.trim().length > 1
    ) {
      const lead = value.match(/^\s*/)?.[0] ?? "";
      const trail = value.match(/\s*$/)?.[0] ?? "";
      const body = value.trim();
      entries.push({ node: text, lead, body, trail });
    }
    node = walker.nextNode();
  }
  return entries;
}

interface AttrEntry {
  element: Element;
  attr: (typeof ATTRS)[number];
  body: string;
}

function collectAttrs(root: ParentNode): AttrEntry[] {
  const entries: AttrEntry[] = [];
  if (!(root instanceof Element) && !(root as Document).querySelectorAll) return entries;

  const elements = (root as ParentNode).querySelectorAll?.("[placeholder], [aria-label], [title], [alt]");
  elements?.forEach((element) => {
    if (element.closest(SKIP_SELECTOR)) return;
    const done = translatedAttrs.get(element);
    for (const attr of ATTRS) {
      const value = element.getAttribute(attr);
      if (!value || value.trim().length < 2 || !HAS_LETTERS.test(value)) continue;
      if (done?.get(attr) === value) continue;
      entries.push({ element, attr, body: value.trim() });
    }
  });
  return entries;
}

/** Traduce l'intero sottoalbero DOM passato (una passata). */
export async function translateSubtree(root: ParentNode, lang: SiteLang): Promise<void> {
  const textEntries = collectTexts(root);
  const attrEntries = collectAttrs(root);
  const all = [...textEntries.map((e) => e.body), ...attrEntries.map((e) => e.body)];
  if (!all.length) return;

  const translations = await translateTexts(all, lang);
  if (!translations.size) return;

  for (const entry of textEntries) {
    const value = translations.get(entry.body);
    if (!value) continue;
    entry.node.nodeValue = entry.lead + value + entry.trail;
    translatedNodes.set(entry.node, entry.lead + value + entry.trail);
  }

  for (const entry of attrEntries) {
    const value = translations.get(entry.body);
    if (!value) continue;
    entry.element.setAttribute(entry.attr, value);
    const done = translatedAttrs.get(entry.element) ?? new Map<string, string>();
    done.set(entry.attr, value);
    translatedAttrs.set(entry.element, done);
  }
}

/**
 * Avvia la traduzione della pagina e osserva i cambiamenti del DOM
 * (contenuti Convex, navigazione client, ecc.). Restituisce la funzione di stop.
 */
export function startAutoTranslate(lang: SiteLang): () => void {
  if (lang === "it" || typeof document === "undefined") return () => {};

  let active = true;
  let timer: number | null = null;

  const run = () => {
    if (!active) return;
    void translateSubtree(document.body, lang);
  };

  const schedule = () => {
    if (timer !== null) window.clearTimeout(timer);
    timer = window.setTimeout(run, 320);
  };

  const observer = new MutationObserver(schedule);
  observer.observe(document.body, { childList: true, subtree: true, characterData: true });
  void translateSubtree(document.body, lang);

  return () => {
    active = false;
    observer.disconnect();
    if (timer !== null) window.clearTimeout(timer);
  };
}
