"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ConvexHttpClient } from "convex/browser";
import { Icon } from "@/components/icons";
import type { PostItem } from "@/components/site/showcase";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

export function PostView({ slug }: { slug: string }) {
  const [post, setPost] = useState<PostItem | null>(null);
  const [notFound, setNotFound] = useState(false);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    if (!convexUrl) {
      setNotFound(true);
      return;
    }
    try {
      const c = new ConvexHttpClient(convexUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      c.query("posts:getBySlug" as any, { slug }).then((r) => {
        const p = r as PostItem | null;
        if (p && p.status === "published") setPost(p);
        else setNotFound(true);
      }).catch(() => setNotFound(true));
    } catch {
      setNotFound(true);
    }
  }, [slug]);

  if (notFound) {
    return (
      <div className="flex flex-col items-center gap-6 py-16 md:py-20 text-center">
        <p className="font-heading text-3xl uppercase text-muted-foreground">Segnale non trovato</p>
        <Link
          href="/blog"
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-foreground"
        >
          <Icon name="arrow-right" size={13} className="rotate-180" /> Torna al blog
        </Link>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex flex-col items-center gap-5 py-24">
        <span className="micro-label animate-pulse">Trasmissione in corso…</span>
      </div>
    );
  }

  return (
    <article>
      {post.coverUrl && (
        <div className="relative mb-12 aspect-[21/9] overflow-hidden border border-border">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={post.coverUrl} alt={post.title} className="h-full w-full object-cover" />
        </div>
      )}
      <p className="micro-label mb-4">
        {new Date(post.createdAt).toLocaleDateString("it-IT", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
        {post.tags?.length ? ` — ${post.tags.join(" · ")}` : ""}
      </p>
      <h1 className="font-heading text-4xl uppercase leading-tight md:text-6xl">{post.title}</h1>
      {post.excerpt && (
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">{post.excerpt}</p>
      )}
      <div className="mt-12 max-w-2xl space-y-6">
        {post.content?.split("\n\n").map((p, i) => (
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
  );
}
