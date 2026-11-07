import { Section, Container } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { BlogEditorial } from "@/components/site/blog-editorial";
import { getPublishedPosts } from "@/lib/server-posts";
import { JsonLd, breadcrumbGraph, websiteGraph, organizationGraph } from "@/lib/seo";
import { buildPageMetadata } from "@/lib/site-settings";
import { site } from "@/lib/site-data";

export async function generateMetadata() {
  return buildPageMetadata("blog", {
    title: "Blog",
    description: "Approfondimenti, case study e segnali dallo spazio creativo di Andromedia Web.",
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <Section className="relative overflow-hidden pt-40 pb-14">
        <Container>
          <Reveal>
            <h1 className="font-heading text-5xl leading-[1.02] md:text-7xl">
              Il <span className="text-outline">journal</span>
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
              Storie di brand, tecnologia e marketing digitale: idee, progetti e
              appunti di lavoro dal nostro studio.
            </p>
          </Reveal>
        </Container>
      </Section>

      <Section>
        <Container className="pb-28">
          <h2 className="sr-only">Tutti gli articoli</h2>
          <JsonLd
            data={[
              {
                "@context": "https://schema.org",
                "@type": "Blog",
                "@id": `${site.url}/blog#blog`,
                name: `Blog — ${site.name}`,
                url: `${site.url}/blog`,
                inLanguage: "it-IT",
                publisher: { "@id": `${site.url}/#organizzazione` },
              },
              breadcrumbGraph([
                { name: "Home", path: "/" },
                { name: "Blog", path: "/blog" },
              ]),
              websiteGraph(),
              organizationGraph(),
            ]}
          />
          <BlogEditorial posts={posts} />
        </Container>
      </Section>
    </>
  );
}
