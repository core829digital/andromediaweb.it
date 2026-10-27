import { Suspense } from "react";
import { PostView } from "@/components/site/post-view";
import { Container, Section } from "@/components/section";

function PostFallback() {
  return (
    <div className="flex flex-col items-center gap-5 py-24">
      <span className="micro-label animate-pulse">Trasmissione in corso…</span>
    </div>
  );
}

async function PostGate({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <PostView slug={slug} />;
}

export default function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Section className="relative overflow-hidden pt-40 pb-28">
      <div className="grid-bg grid-bg-fade absolute inset-0" aria-hidden="true" />
      <Container className="max-w-4xl">
        <Suspense fallback={<PostFallback />}>
          <PostGate params={params} />
        </Suspense>
      </Container>
    </Section>
  );
}
