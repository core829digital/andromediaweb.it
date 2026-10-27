import type { ReactNode } from "react";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { Tracker } from "@/components/site/tracker";
import { getGlobal } from "@/lib/site-settings";

export default async function SiteLayout({ children }: { children: ReactNode }) {
  const global = await getGlobal();
  return (
    <div className="flex min-h-screen flex-col">
      <Nav />
      <main className="relative flex-1">{children}</main>
      <Footer info={global} />
      <Tracker />
    </div>
  );
}
