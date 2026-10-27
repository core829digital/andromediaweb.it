import { cn } from "@/lib/utils";

/** Logomark MN di Andromedia Web (nodo @). */
export function LogoMark({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={light ? "/branding/logo-11px-bw-bagliore.png" : "/branding/logo-11px-crop-nero.png"}
      alt="Andromedia Web"
      className={cn("h-9 w-auto select-none", className)}
      draggable={false}
    />
  );
}

/** Icona pura M/W — versione nera (chiara) e bianca (dark). */
export function LogoIcon({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={light ? "/branding/icon-trans-white.png" : "/branding/icon-do-black.png"}
      alt="Andromedia Web"
      className={cn("h-9 w-auto select-none", className)}
      draggable={false}
    />
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
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={light ? "/branding/thefutureisnow-bianca.png" : "/branding/thefutureisnow-black-tran.png"}
      alt="Andromedia Web — The future is now"
      className={cn("h-10 w-auto select-none", className)}
      draggable={false}
    />
  );
}
