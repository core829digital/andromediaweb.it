"use client";

import { ConvexHttpClient } from "convex/browser";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

/** Client Convex di sola LETTURA (le scritture passano dalle server actions). */
export function readClient(): ConvexHttpClient | null {
  if (!convexUrl) return null;
  try {
    return new ConvexHttpClient(convexUrl);
  } catch {
    return null;
  }
}
