"use client";

import { useEffect, useRef, useState } from "react";
import { ConvexHttpClient } from "convex/browser";
import type { PostItem } from "@/components/site/showcase";
import { BlogGrid } from "@/components/site/showcase";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

/** Lista blog pubblica — legge i post "published" da Convex. */
export function BlogIndex() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    if (!convexUrl) return;
    try {
      const c = new ConvexHttpClient(convexUrl);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      c.query("posts:listPublished" as any, {}).then((r) => {
        if (r) setPosts(r as PostItem[]);
      });
    } catch {
      // Convex non collegato: resta la lista vuota
    }
  }, []);

  return <BlogGrid posts={posts} />;
}
