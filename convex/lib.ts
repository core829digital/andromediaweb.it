/**
 * Utility di sicurezza lato Convex: guardia HMAC per le mutation amministrative,
 * SHA-256 puro JS (deterministico, funziona nel runtime V8 di Convex),
 * sanitizzazione e validazione degli input.
 */

/* ========================= Guardia amministrativa ========================= */

/**
 * Ogni mutation di scrittura richiede `guard` = SHA-256(AW_CONVEX_GUARD),
 * calcolato solo dal server Next (il segreto non è mai nel bundle client).
 * Il confronto è a tempo costante per evitare timing attack.
 */
export function assertGuard(guard: unknown): void {
  const expected = process.env.AW_GUARD_DIGEST ?? "";
  const provided = typeof guard === "string" ? guard : "";
  if (!expected || provided.length !== expected.length || !constantTimeEquals(provided, expected)) {
    throw new Error("Operazione non autorizzata: firma di sicurezza mancante o non valida.");
  }
}

export function constantTimeEquals(a: string, b: string): boolean {
  let diff = 0;
  for (let i = 0; i < b.length; i++) {
    diff |= (a.charCodeAt(i) | 0) ^ (b.charCodeAt(i) | 0);
  }
  return diff === 0;
}

/* ========================= SHA-256 puro JS ========================= */

function rightRotate(value: number, amount: number): number {
  return (value >>> amount) | (value << (32 - amount));
}

const shaCache: { h?: number[]; k?: number[] } = {};

/** SHA-256 di una "byte string" (ogni charCode è un byte 0-255) → hex. */
export function sha256Hex(byteStr: string): string {
  const maxWord = 4294967296; // 2^32
  const hash: number[] = shaCache.h ?? (shaCache.h = []);
  const k: number[] = shaCache.k ?? (shaCache.k = []);
  let primeCounter = k.length;
  const isComposite: Record<number, number> = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (let i = 0; i < 313; i += candidate) isComposite[i] = candidate;
      hash[primeCounter] = Math.trunc(Math.pow(candidate, 0.5) * maxWord);
      k[primeCounter++] = Math.trunc(Math.pow(candidate, 1 / 3) * maxWord);
    }
  }
  const asciiBitLength = byteStr.length * 8;
  let ascii = byteStr + String.fromCharCode(0x80);
  while (ascii.length % 64 - 56) ascii += String.fromCharCode(0);
  const words: number[] = [];
  for (let i = 0; i < ascii.length; i++) {
    const j = ascii.charCodeAt(i);
    if (j >>> 8) return "";
    words[i >> 2] = (words[i >> 2] ?? 0) | (j << ((3 - i) % 4) * 8);
  }
  words[words.length] = Math.trunc(asciiBitLength / maxWord);
  words[words.length] = asciiBitLength;

  let h = hash.slice(0, 8);
  for (let j = 0; j < words.length; ) {
    const w = words.slice(j, (j += 16));
    const oldHash = h;
    h = h.slice(0, 8);
    for (let i = 0; i < 64; i++) {
      const w15 = w[i - 15];
      const w2 = w[i - 2];
      const a = h[0];
      const e = h[4];
      const temp1 =
        h[7] +
        (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) +
        ((e & h[5]) ^ (~e & h[6])) +
        k[i] +
        (w[i] =
          i < 16
            ? w[i]
            : (w[i - 16] +
                (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) +
                w[i - 7] +
                (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) |
              0);
      const temp2 =
        (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) +
        ((a & h[1]) ^ (a & h[2]) ^ (h[1] & h[2]));
      h = [(temp1 + temp2) | 0].concat(h);
      h[4] = (h[4] + temp1) | 0;
    }
    for (let i = 0; i < 8; i++) h[i] = (h[i] + oldHash[i]) | 0;
  }
  let result = "";
  for (let i = 0; i < 8; i++) {
    for (let j = 3; j + 1; j--) {
      const b = (h[i] >>> (j * 8)) & 255;
      result += (b < 16 ? "0" : "") + b.toString(16);
    }
  }
  return result;
}

function toByteString(bytes: Uint8Array): string {
  let s = "";
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return s;
}

function hexToByteString(hex: string): string {
  let s = "";
  for (let i = 0; i < hex.length; i += 2) s += String.fromCharCode(parseInt(hex.slice(i, i + 2), 16));
  return s;
}

function utf8ByteString(s: string): string {
  return toByteString(new TextEncoder().encode(s));
}

/** HMAC-SHA256(key, message) → hex. */
export function hmacSha256Hex(key: string, message: string): string {
  let kStr = utf8ByteString(key);
  if (kStr.length > 64) kStr = hexToByteString(sha256Hex(kStr));
  if (kStr.length < 64) kStr += String.fromCharCode(0).repeat(64 - kStr.length);
  let ipad = "";
  let opad = "";
  for (let i = 0; i < 64; i++) {
    const b = kStr.charCodeAt(i);
    ipad += String.fromCharCode(b ^ 0x36);
    opad += String.fromCharCode(b ^ 0x5c);
  }
  const inner = hexToByteString(sha256Hex(ipad + utf8ByteString(message)));
  return sha256Hex(opad + inner);
}

/* ========================= Sanitizzazione ========================= */

/** Rimuove caratteri di controllo, <, > e tag; trunca a maxLen. Previene XSS alla fonte. */
export function sanitizeStr(s: unknown, maxLen = 500): string {
  if (typeof s !== "string") return "";
  return s
    .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/g, "")
    .replace(/[<>`]/g, "'")
    .replace(/javascript:/gi, "")
    .trim()
    .slice(0, maxLen);
}

export function isEmail(s: string): boolean {
  return /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,24}$/.test(s);
}

export function isHttpUrl(s: string): boolean {
  return /^https?:\/\/[^\s]{1,500}$/.test(s);
}

export function isSlug(s: string): boolean {
  return /^[a-z0-9-]{1,120}$/.test(s);
}
