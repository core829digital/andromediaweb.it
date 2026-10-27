import { Suspense } from "react";
import type { ReactNode } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Suspense fallback={<div className="h-16 border-b border-border" />}>
        <Nav />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
