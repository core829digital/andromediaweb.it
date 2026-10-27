import { cn } from "@/lib/utils";

/**
 * Tutti i loghi accettano due modalità:
 * - light=false → nero in light mode, bianco in dark mode (swap automatico)
 * - light=true  → sempre bianco (per fondi scuri fissi, se mai servisse)
 *   anche in dark mode grazie all'inversione delle variabili)
 */

/** Logomark MN di Andromedia Web (nodo @). */
export function LogoMark({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  if (light) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/branding/logo-11px-bw-bagliore.png"
        alt="Andromedia Web"
        className={cn("h-9 w-auto select-none", className)}
        draggable={false}
      />
    );
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/branding/logo-11px-crop-nero.png"
        alt="Andromedia Web"
        className={cn("h-9 w-auto select-none dark:hidden", className)}
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/branding/logo-11px-bw-bagliore.png"
        alt=""
        aria-hidden="true"
        className={cn("hidden h-9 w-auto select-none dark:block", className)}
        draggable={false}
      />
    </>
  );
}

/** Icona pura M/W — swap automatico in dark mode. */
export function LogoIcon({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  if (light) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/branding/icon-trans-white.png"
        alt="Andromedia Web"
        className={cn("h-9 w-auto select-none", className)}
        draggable={false}
      />
    );
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/branding/icon-do-black.png"
        alt="Andromedia Web"
        className={cn("h-9 w-auto select-none dark:hidden", className)}
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/branding/icon-trans-white.png"
        alt=""
        aria-hidden="true"
        className={cn("hidden h-9 w-auto select-none dark:block", className)}
        draggable={false}
      />
    </>
  );
}

/** Wordmark completo "The future is now". */
export function LogoFull({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  if (light) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/branding/thefutureisnow-bianca.png"
        alt="Andromedia Web — The future is now"
        className={cn("h-10 w-auto select-none", className)}
        draggable={false}
      />
    );
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/branding/thefutureisnow-black-tran.png"
        alt="Andromedia Web — The future is now"
        className={cn("h-10 w-auto select-none dark:hidden", className)}
        draggable={false}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/branding/thefutureisnow-bianca.png"
        alt=""
        aria-hidden="true"
        className={cn("hidden h-10 w-auto select-none dark:block", className)}
        draggable={false}
      />
    </>
  );
}
