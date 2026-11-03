import Link from "next/link";
import { Icon } from "@/components/icons";
import { Reveal } from "@/components/reveal";

export interface PostItem {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl?: string;
  tags?: string[];
  status: "draft" | "published";
  createdAt: number;
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function Cover({
  post,
  ratio = "aspect-[16/10]",
  index,
}: {
  post: PostItem;
  ratio?: string;
  index: number;
}) {
  return (
    <div className={`relative overflow-hidden bg-muted ${ratio}`}>
      {post.coverUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={post.coverUrl}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-muted" aria-hidden="true">
          <span className="font-heading text-7xl text-muted-foreground/20">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}

function Meta({ post }: { post: PostItem }) {
  return (
    <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
      <time dateTime={new Date(post.createdAt).toISOString()}>{formatDate(post.createdAt)}</time>
      {post.tags?.length ? ` — ${post.tags.slice(0, 2).join(" · ")}` : ""}
    </p>
  );
}

/**
 * Blog editoriale: il primo articolo in evidenza a tutta larghezza,
 * gli altri in griglia. Pensato per funzionare anche con un solo post.
 */
export function BlogEditorial({ posts }: { posts: PostItem[] }) {
  if (posts.length === 0) {
    return (
      <div className="border border-dashed border-border px-8 py-20 text-center">
        <p className="font-heading text-2xl uppercase text-muted-foreground">
          Nessun articolo pubblicato
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          Stiamo preparando i primi contenuti. Torna presto.
        </p>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className="space-y-20">
      {/* Articolo in evidenza */}
      <Reveal>
        <Link
          href={`/blog/${featured.slug}`}
          className="group grid overflow-hidden border border-border transition-colors duration-500 hover:border-foreground md:grid-cols-[1.25fr_1fr]"
        >
          <Cover post={featured} ratio="aspect-[16/10] md:aspect-auto md:min-h-[58vh]" index={0} />
          <div className="flex flex-col justify-between gap-10 p-7 md:p-10">
            <div className="flex items-start justify-between gap-4">
              <Meta post={featured} />
              <span className="flex h-10 w-10 shrink-0 items-center justify-center border border-border text-muted-foreground transition-all duration-300 group-hover:bg-foreground group-hover:text-background">
                <Icon name="arrow-up-right" size={16} />
              </span>
            </div>
            <div>
              <h2 className="font-heading text-3xl uppercase leading-[1.08] md:text-5xl">
                {featured.title}
              </h2>
              {featured.excerpt && (
                <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground md:text-base">
                  {featured.excerpt}
                </p>
              )}
              <span className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:text-foreground">
                Leggi l&apos;articolo
                <Icon name="arrow-right" size={13} className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </Link>
      </Reveal>

      {/* Griglia articoli */}
      {rest.length > 0 && (
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {rest.map((post, i) => (
            <Reveal key={post._id} delay={(i % 3) * 0.08}>
              <Link href={`/blog/${post.slug}`} className="group flex h-full flex-col">
                <Cover post={post} index={i + 1} />
                <div className="mt-5 flex flex-1 flex-col">
                  <Meta post={post} />
                  <h3 className="mt-3 font-heading text-xl uppercase leading-snug transition-colors group-hover:text-muted-foreground">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                      {post.excerpt}
                    </p>
                  )}
                  <span className="mt-auto inline-flex items-center gap-2 pt-5 font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground transition-colors group-hover:text-foreground">
                    Leggi
                    <Icon name="arrow-right" size={12} className="transition-transform duration-300 group-hover:translate-x-1" />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
