import type { Metadata } from "next";
import { Section, Container } from "@/components/section";
import { Reveal } from "@/components/reveal";
import { BlogIndex } from "@/components/site/blog-index";

export const metadata: Metadata = {
  title: "Blog",
  description: "Approfondimenti, case study e segnali dallo spazio creativo di Andromedia Web.",
};

export default function BlogPage() {
  return (
    <>
      <Section className="relative overflow-hidden pt-40 pb-16">
        <div className="grid-bg grid-bg-fade absolute inset-0" aria-hidden="true" />
        <Container>
          <Reveal>
            <p className="micro-label mb-6">Blog — Segnali spaziali</p>
            <h1 className="font-heading text-5xl uppercase leading-[1.02] md:text-7xl">
              Il <span className="text-outline">journal</span>
            </h1>
          </Reveal>
        </Container>
      </Section>
      <Section>
        <Container className="py-16 pb-28">
          <BlogIndex />
        </Container>
      </Section>
    </>
  );
}
