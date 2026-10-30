import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Icon } from "@/components/icons";
import { getPostBySlug } from "@/lib/server-posts";
import { JsonLd, breadcrumbGraph, organizationGraph } from "@/lib/seo";
import { site } from "@/lib/site-data";
import { Section, Container } from "@/components/section";

/** Rotta blocking: l'articolo è renderizzato interamente lato server
 *  (SSR) per SEO; slug nuovi/vecchi usufruiscono della cache in server-posts. */
export const instant = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Articolo non trovato", robots: { index: false, follow: false } };
  }
  const title = post.title;
  const description = post.excerpt || post.content.slice(0, 155);
  const url = `/blog/${post.slug}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      siteName: site.name,
      locale: "it_IT",
      url,
      publishedTime: new Date(post.createdAt).toISOString(),
      modifiedTime: new Date(post.updatedAt ?? post.createdAt).toISOString(),
      ...(post.tags?.length ? { tags: post.tags.slice(0, 8) } : {}),
      ...(post.coverUrl
        ? { images: [{ url: post.coverUrl, width: 1200, height: 628, alt: title }] }
        : {}),
    },
    twitter: {
      card: post.coverUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(post.coverUrl ? { images: [post.coverUrl] } : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const published = new Date(post.createdAt).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <Section className="relative overflow-hidden pt-40 pb-28">
      <div className="grid-bg grid-bg-fade absolute inset-0" aria-hidden="true" />
      <Container className="max-w-4xl">
        <JsonLd
          data={[
            breadcrumbGraph([
              { name: "Home", path: "/" },
              { name: "Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.slug}` },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "Article",
              headline: post.title,
              description: post.excerpt,
              image: post.coverUrl ? [post.coverUrl] : undefined,
              datePublished: new Date(post.createdAt).toISOString(),
              dateModified: new Date(post.updatedAt ?? post.createdAt).toISOString(),
              inLanguage: "it-IT",
              author: { "@id": `${site.url}/#organizzazione` },
              publisher: { "@id": `${site.url}/#organizzazione` },
              mainEntityOfPage: {
                "@type": "WebPage",
                "@id": `${site.url}/blog/${post.slug}`,
              },
              ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
            },
            organizationGraph(),
          ]}
        />

        <article className="relative">
          <nav aria-label="Percorso" className="micro-label mb-10 flex items-center gap-2">
            <Link href="/" className="transition-colors hover:text-foreground">Home</Link>
            <span aria-hidden="true">/</span>
            <Link href="/blog" className="transition-colors hover:text-foreground">Blog</Link>
            <span aria-hidden="true">/</span>
            <span className="text-foreground">{post.title.slice(0, 40)}{post.title.length > 40 ? "…" : ""}</span>
          </nav>

          {post.coverUrl && (
            <div className="relative mb-12 aspect-[21/9] overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={post.coverUrl}
                alt={post.title}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>
          )}

          <p className="micro-label mb-4">
            <time dateTime={new Date(post.createdAt).toISOString()}>{published}</time>
            {post.tags?.length ? ` — ${post.tags.join(" · ")}` : ""}
          </p>

          <h1 className="font-heading text-4xl uppercase leading-tight md:text-6xl">
            {post.title}
          </h1>

          {post.excerpt && (
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
              {post.excerpt}
            </p>
          )}

          <div className="mt-12 max-w-2xl space-y-6">
            {post.content
              ?.split("\n\n")
              .filter((p) => p.trim())
              .map((p, i) => (
                <p key={i} className="text-base leading-relaxed text-foreground/80">
                  {p}
                </p>
              ))}
          </div>

          <Link
            href="/blog"
            className="group mt-16 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
          >
            <Icon name="arrow-right" size={13} className="rotate-180" /> Torna al blog
          </Link>
        </article>
      </Container>
    </Section>
  );
}
