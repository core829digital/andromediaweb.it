import type { SVGProps } from "react";

/**
 * Iconografia personalizzata Andromedia Web.
 * Tutto SVG disegnato in house (viewBox 0 0 24 24, stroke 1.5).
 * Nessuna dipendenza da librerie icone esterne.
 */

export type IconName =
  | "brand"
  | "seo"
  | "social"
  | "ads"
  | "ai"
  | "web"
  | "compass"
  | "direction"
  | "organize"
  | "team"
  | "evolve"
  | "heart"
  | "mail"
  | "phone"
  | "pin"
  | "clock"
  | "arrow-right"
  | "arrow-up-right"
  | "check"
  | "plus"
  | "close"
  | "menu"
  | "external"
  | "send"
  | "edit"
  | "trash"
  | "upload"
  | "eye"
  | "star"
  | "node"
  | "gauge"
  | "shield"
  | "sliders"
  | "search"
  | "folder"
  | "activity"
  | "facebook"
  | "x-social"
  | "instagram"
  | "linkedin";

type D = string[];

// Design paths per icona (coordinate 0..24)
const P: Record<IconName, D> = {
  // penna + curva di identidad: fusi
  brand: [
    "M3 21l4.2-.9L20 7.3a2.2 2.2 0 0 0 0-3.1l-.2-.2a2.2 2.2 0 0 0-3.1 0L4 16.7 3 21z",
    "M14 5.5l3.5 3.5",
    "M3 21c3-2 6-2 9-3.5",
  ],  seo: [
    "M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13z",
    "M15.2 15.2 21 21",
    "M7.5 10.5l2 2 3-3.5",
  ],  social: [
    "M6 9.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
    "M18 5.6a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z",
    "M18 14.4a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4z",
    "M8.3 8.1l7.4-1.6",
    "M8.4 10.5l7.3 4.2",
  ],  ads: [
    "M3.5 10v4a1 1 0 0 0 1 1H7l6 4V5L7 9H4.5a1 1 0 0 0-1 1z",
    "M16.5 9.5c1 .8 1 4.2 0 5",
    "M19.5 7.5c2.2 1.8 2.2 7.2 0 9",
  ],  ai: [
    "M8.5 3.5H5.5a2 2 0 0 0-2 2v3m12-5h3a2 2 0 0 1 2 2v3m-17 8v3a2 2 0 0 0 2 2h3m12-5v3a2 2 0 0 1-2 2h-3",
    "M9 9h6v6H9z",
    "M9 12h6",
  ],  web: [
    "M3 4.5h18v13H3z",
    "M3 8h18",
    "M6 6h.01M8.5 6h.01",
    "M8.5 21h7M12 17.5V21",
  ],  compass: [
    "M12 3.5A8.5 8.5 0 1 0 12 20.5 8.5 8.5 0 0 0 12 3.5z",
    "M15 9l-1.8 4.2L9 15l1.8-4.2L15 9z",
  ],  direction: [
    "M12 21V8",
    "M12 3l7 7m-7-7-7 7",
    "M6.5 18.5l5.5-5.5 5.5 5.5",
  ],  organize: [
    "M4 4h6v6H4z",
    "M14 4h6v6h-6z",
    "M4 14h6v6H4z",
    "M14 14h6v6h-6z",
  ],  team: [
    "M12 15a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z",
    "M5.8 19.2a6.8 6.8 0 0 1 12.4 0",
    "M12 3v3.5M4.5 6.5l2 2M19.5 6.5l-2 2",
  ],  evolve: [
    "M12 4.5A7.5 7.5 0 1 1 4.5 12",
    "M4.5 12A7.5 7.5 0 0 1 12 4.5",
    "M4.5 12a7.5 7.5 0 0 0 15 0",
    "M12 1.8V4.5M12 19.5v.5",
    "M9.5 12l1.8-3 1.4 4.2 1.8-1.2h2",
  ],  heart: [
    "M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z",
  ],  mail: ["M3 5.5h18v13H3z", "m3 6.5 9 6 9-6"],  phone: [
    "M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5L15.5 12l4 1.5v3a1.5 1.5 0 0 1-1.6 1.5C10 17.6 6.4 14 4 6.1a1.5 1.5 0 0 1 1.5-2.6z",
  ],  pin: [
    "M12 21s-6.5-6.2-6.5-10.5a6.5 6.5 0 1 1 13 0C18.5 14.8 12 21 12 21z",
    "M12 10.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",
  ],  clock: [
    "M12 3.5A8.5 8.5 0 1 0 12 20.5 8.5 8.5 0 0 0 12 3.5z",
    "M12 7.5V12l3 2",
  ],  "arrow-right": ["M4 12h16", "M13 5l7 7-7 7"],  "arrow-up-right": ["M7 17 17 7", "M9 7h8v8"],  check: ["m5 12.5 4.5 5L19 6.5"],  plus: ["M12 4v16", "M4 12h16"],  close: ["M5 5l14 14", "M19 5 5 19"],  menu: ["M3.5 8h17", "M3.5 16h17", "M3.5 12h9"],  external: [
    "M10 5H5v14h14v-5",
    "M14 4h6v6",
    "M20 4 11 13",
  ],  send: ["M21 3 3 10.5l7 2.5L21 3z", "M21 3v18l-8.5-8", "M10 13v8l2.5-3.5"],  edit: ["M12 20h9", "M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"],  trash: [
    "M4 7h16",
    "M9 7V4.5h6V7",
    "M6.5 7l1 13.5h9L17 7",
    "M10 11v6M14 11v6",
  ],  upload: ["M4 16v3.5h16V16", "M12 4v11", "m7 8.5 5-5 5 5"],  eye: [
    "M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z",
    "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
  ],  star: ["m12 3 2.4 5.6L20 9.5l-4.3 4L16.8 20 12 16.8 7.2 20l1.1-6.5L4 9.5l5.6-.9L12 3z"],  node: [
    "M12 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    "M5 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    "M19 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
    "M9.5 8.5 6.3 15.5M14.5 8.5l3.2 7M8 18h8",
  ],  facebook: ["M13.5 21v-8h2.7l.5-3h-3.2V8.2c0-1 .3-1.5 1.6-1.5H17V4.1c-.5-.1-1.4-.1-2.2-.1-2.3 0-4 1.4-4 4.1V10H8v3h2.8v8h2.7z"],
  gauge: ["M4.6 18.8a9 9 0 1 1 14.8 0", "M12 13.5 15.8 9", "M12 17.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1"],
  shield: ["M12 3l7.5 3v5.2c0 4.5-3.2 7.6-7.5 9.3-4.3-1.7-7.5-4.8-7.5-9.3V6l7.5-3z", "M9.2 11.8l2 2 3.6-3.8"],
  sliders: ["M4 7h9", "M17 7h3", "M15 4.8v4.4", "M4 17h3", "M11 17h9", "M9 14.8v4.4"],
  search: ["M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14z", "M20.5 20.5 16 16"],
  folder: ["M3 6.5h5.6l2 2.5H21v11H3v-13.5z", "M3 10.5h18"],
  activity: ["M3 12h4.2l2.6-7 4.4 14 2.6-7H21"],  "x-social": ["M4 4l16 16M20 4 4 20"],  instagram: [
    "M4 4h16v16H4z",
    "M12 8.2a3.8 3.8 0 1 0 0 7.6 3.8 3.8 0 0 0 0-7.6z",
    "M17 7h.01",
  ],  linkedin: [
    "M6.5 9.5v10",
    "M6.5 5v.01",
    "M11 19.5v-10",
    "M11 13.5c0-2 1.5-4 4-4 2.3 0 3.5 1.5 3.5 3.8v6.2",
  ],};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
  strokeWidth?: number;
}

export function Icon({ name, size = 20, strokeWidth = 1.5, ...rest }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {(P[name] ?? P.node).map((p, i) => (
        <path key={i} d={p} />
      ))}
    </svg>
  );
}
