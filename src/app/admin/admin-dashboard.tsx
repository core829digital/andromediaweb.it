"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ConvexHttpClient } from "convex/browser";
import { Icon } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { logout } from "./actions";
import {
  postSave,
  postSetStatus,
  postRemove,
  workCreate,
  workRemove,
  messageRemove,
  getUploadUrl,
} from "./write-actions";
import { cn } from "@/lib/utils";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

/* eslint-disable @typescript-eslint/no-explicit-any */
function client(): ConvexHttpClient | null {
  if (!convexUrl) return null;
  try {
    return new ConvexHttpClient(convexUrl);
  } catch {
    return null;
  }
}

type Tab = "blog" | "portfolio" | "messaggi";

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverUrl?: string;
  tags?: string[];
  status: "draft" | "published";
  createdAt: number;
  updatedAt: number;
}

interface Work {
  _id: string;
  title: string;
  client: string;
  url: string;
  category: string;
  description: string;
  imageUrl?: string;
  featured: boolean;
  createdAt: number;
}

interface Message {
  _id: string;
  name: string;
  email: string;
  message: string;
  source: string;
  createdAt: number;
}

const inputCls =
  "h-10 w-full border border-border bg-transparent px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground";
const labelCls = "micro-label mb-1.5 block";

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function AdminDashboard({ email, embedded = false }: { email: string; embedded?: boolean }) {
  const [tab, setTab] = useState<Tab>("blog");
  const [noConvex, setNoConvex] = useState(!convexUrl);

  if (noConvex) return <NoConvex />;

  const tabsRow = (className: string) => (
    <div className={cn("mx-auto flex max-w-7xl gap-1 px-5 md:px-8", className)}>
      {(["blog", "portfolio", "messaggi"] as Tab[]).map((t) => (
        <button
          key={t}
          onClick={() => setTab(t)}
          className={cn(
            "relative px-5 py-3 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors",
            tab === t ? "text-foreground" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {t}
          {tab === t && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-foreground" />}
        </button>
      ))}
    </div>
  );

  const panels = (
    <main className={embedded ? "p-5 md:p-8" : "mx-auto max-w-7xl px-5 py-10 md:px-8"}>
      {tab === "blog" && <BlogPanel />}
      {tab === "portfolio" && <PortfolioPanel />}
      {tab === "messaggi" && <MessagesPanel />}
    </main>
  );

  if (embedded) {
    return (
      <div className="min-h-full">
        {tabsRow("max-w-none border-b border-border")}
        {panels}
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-background">
      {/* topbar */}
      <header className="sticky top-0 z-30 border-b border-border bg-background/90 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-8">
          <Link href="/" className="flex items-center gap-3">
            <LogoMark />
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
              Backoffice
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:block">
              {email}
            </span>
            <Link
              href="/"
              className="flex h-9 items-center gap-2 border border-border px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
            >
              Vedi sito <Icon name="external" size={12} />
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="flex h-9 items-center gap-2 bg-foreground px-4 font-mono text-[10px] uppercase tracking-[0.2em] text-background transition-colors hover:bg-muted-foreground"
              >
                Esci <Icon name="close" size={12} />
              </button>
            </form>
          </div>
        </div>
        {tabsRow("")}
      </header>

      {panels}
    </div>
  );
}

/* ================= Blog ================= */

function BlogPanel() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Post | null>(null);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const c = client();
    if (!c) return;
    try {
      const r = (await c.query("posts:list" as any, {})) as Post[];
      setPosts(r ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function setStatus(id: string, status: "draft" | "published") {
    const r = await postSetStatus(id, status);
    setMessage(r.ok ? (status === "published" ? "Post pubblicato" : "Post rimandato in bozza") : `Errore: ${r.error}`);
    if (r.ok) await load();
  }

  async function remove(id: string) {
    if (!confirm("Eliminare definitivamente questo post?")) return;
    const r = await postRemove(id);
    setMessage(r.ok ? "Post eliminato" : `Errore: ${r.error}`);
    if (r.ok) await load();
  }

  const showEditor = creating || editing;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-2xl uppercase">Blog — {posts.length} post</h2>
        <button
          onClick={() => {
            setCreating(true);
            setEditing(null);
          }}
          className="flex h-10 items-center gap-2 bg-foreground px-5 font-mono text-[11px] uppercase tracking-[0.22em] text-background transition-colors hover:bg-muted-foreground"
        >
          <Icon name="plus" size={14} /> Nuovo post
        </button>
      </div>

      {message && (
        <p className="flex items-center gap-2 border border-border bg-muted px-4 py-2 text-xs">
          <Icon name="check" size={13} /> {message}
        </p>
      )}

      {showEditor && (
        <PostEditor
          post={editing}
          onDone={async (m) => {
            setCreating(false);
            setEditing(null);
            setMessage(m);
            await load();
          }}
          onCancel={() => {
            setCreating(false);
            setEditing(null);
          }}
        />
      )}

      <div className="border border-border">
        {loading ? (
          <p className="micro-label p-8 text-center">Caricamento…</p>
        ) : posts.length === 0 ? (
          <p className="p-10 text-center text-sm text-muted-foreground">
            Nessun post — creane il primo.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Titolo</th>
                <th className="hidden p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground md:table-cell">Stato</th>
                <th className="hidden p-4 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground lg:table-cell">Data</th>
                <th className="p-4 text-right font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Azioni</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p._id} className="border-b border-border/60 last:border-0 hover:bg-muted/50">
                  <td className="p-4">
                    <p className="font-medium">{p.title}</p>
                    <p className="font-mono text-[10px] text-muted-foreground">/{p.slug}</p>
                  </td>
                  <td className="hidden p-4 md:table-cell">
                    <span
                      className={cn(
                        "border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.2em]",
                        p.status === "published"
                          ? "border-foreground text-foreground"
                          : "border-border text-muted-foreground"
                      )}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="hidden p-4 font-mono text-[10px] text-muted-foreground lg:table-cell">
                    {new Date(p.createdAt).toLocaleDateString("it-IT")}
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-2">
                      <button
                        title={p.status === "published" ? "Manda in bozza" : "Pubblica"}
                        onClick={() => setStatus(p._id, p.status === "published" ? "draft" : "published")}
                        className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                      >
                        <Icon name={p.status === "published" ? "eye" : "check"} size={14} />
                      </button>
                      <button
                        title="Modifica"
                        onClick={() => {
                          setEditing(p);
                          setCreating(false);
                        }}
                        className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                      >
                        <Icon name="edit" size={14} />
                      </button>
                      <button
                        title="Elimina"
                        onClick={() => remove(p._id)}
                        className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                      >
                        <Icon name="trash" size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function PostEditor({
  post,
  onDone,
  onCancel,
}: {
  post: Post | null;
  onDone: (m: string) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    title: post?.title ?? "",
    slug: post?.slug ?? "",
    excerpt: post?.excerpt ?? "",
    content: post?.content ?? "",
    tags: (post?.tags ?? []).join(", "),
    status: post?.status ?? ("draft" as const),
  });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      let coverStorageId: string | undefined;
      if (file) coverStorageId = await upload(file, "posts");

      const r = await postSave(post?._id ?? null, {
        title: form.title,
        slug: form.slug || slugify(form.title),
        excerpt: form.excerpt,
        content: form.content,
        tags: form.tags,
        status: form.status,
        ...(coverStorageId ? { coverStorageId } : {}),
      });
      if (!r.ok) throw new Error(r.error ?? "errore");
      onDone(post ? "Post aggiornato" : "Post creato");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore di salvataggio");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="border border-border p-6">
      <p className="micro-label mb-6">{post ? "Modifica post" : "Nuovo post"}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Titolo</label>
          <input
            required
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value, slug: slugify(e.target.value) })
            }
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Slug</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
            className={inputCls}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Anteprima (excerpt)</label>
          <input
            value={form.excerpt}
            onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
            className={inputCls}
          />
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Contenuto (separare i paragrafi con una riga vuota)</label>
          <textarea
            rows={10}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            className="w-full border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground"
          />
        </div>
        <div>
          <label className={labelCls}>Tag (separati da virgola)</label>
          <input
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Stato</label>
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value as "draft" | "published" })}
            className={cn(inputCls, "appearance-none")}
          >
            <option value="draft">Bozza</option>
            <option value="published">Pubblicato</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Copertina</label>
          {post?.coverUrl && !file && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={post.coverUrl} alt="" className="mb-2 h-24 w-auto border border-border object-cover" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full border border-border bg-transparent p-2 text-xs file:mr-3 file:border file:border-border file:bg-transparent file:px-3 file:py-1 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.2em]"
          />
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={busy}
          className="flex h-10 items-center gap-2 bg-foreground px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-background transition-colors hover:bg-muted-foreground disabled:opacity-50"
        >
          {busy ? "Salvataggio…" : "Salva"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex h-10 items-center border border-border px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          Annulla
        </button>
      </div>
    </form>
  );
}

/* ================= Portfolio ================= */

function PortfolioPanel() {
  const [works, setWorks] = useState<Work[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const load = useCallback(async () => {
    const c = client();
    if (!c) return;
    try {
      const r = (await c.query("portfolio:list" as any, {})) as Work[];
      setWorks(r ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Eliminare questo lavoro dal portfolio?")) return;
    const r = await workRemove(id);
    setMessage(r.ok ? "Lavoro eliminato" : `Errore: ${r.error}`);
    if (r.ok) await load();
  }

  return (
    <div className="space-y-8">
      <h2 className="font-heading text-2xl uppercase">Portfolio — {works.length} lavori</h2>
      {message && (
        <p className="flex items-center gap-2 border border-border bg-muted px-4 py-2 text-xs">
          <Icon name="check" size={13} /> {message}
        </p>
      )}

      <WorkForm onDone={async (m) => { setMessage(m); await load(); }} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="micro-label col-span-full p-8 text-center">Caricamento…</p>
        ) : works.length === 0 ? (
          <p className="col-span-full border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
            Nessun lavoro caricato.
          </p>
        ) : (
          works.map((w) => (
            <div key={w._id} className="group border border-border">
              <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                {w.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={w.imageUrl} alt={w.title} className="h-full w-full object-cover" />
                ) : (
                  <div className="grid-bg absolute inset-0" aria-hidden="true" />
                )}
              </div>
              <div className="flex items-start justify-between gap-3 p-4">
                <div>
                  <p className="font-heading text-sm uppercase">{w.title}</p>
                  <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                    {w.category} {w.featured ? "★" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  {w.url && (
                    <a
                      href={w.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                    >
                      <Icon name="external" size={13} />
                    </a>
                  )}
                  <button
                    onClick={() => remove(w._id)}
                    className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                  >
                    <Icon name="trash" size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function WorkForm({ onDone }: { onDone: (m: string) => void }) {
  const [form, setForm] = useState({
    title: "",
    client: "",
    url: "",
    category: "Sito Web",
    description: "",
    featured: false,
  });
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      let imageStorageId: string | undefined;
      if (file) imageStorageId = await upload(file, "portfolio");
      const r = await workCreate({
        ...form,
        ...(imageStorageId ? { imageStorageId } : {}),
      });
      if (!r.ok) throw new Error(r.error ?? "errore");
      setForm({ title: "", client: "", url: "", category: "Sito Web", description: "", featured: false });
      setFile(null);
      onDone("Lavoro caricato");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Errore: dati mancanti o non validi");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save} className="border border-border p-6">
      <p className="micro-label mb-6">Carica nuovo lavoro</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className={labelCls}>Titolo progetto</label>
          <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Cliente</label>
          <input required value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>URL progetto</label>
          <input type="url" placeholder="https://…" value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Categoria</label>
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className={cn(inputCls, "appearance-none")}
          >
            {["Sito Web", "E-Commerce", "Brand Identity", "Social Media", "Advertising", "SEO", "Intelligenza Artificiale"].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className={labelCls}>Descrizione servizi svolti</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border border-border bg-transparent px-3 py-2 text-sm outline-none transition-colors placeholder:text-muted-foreground/50 focus:border-foreground"
          />
        </div>
        <div>
          <label className={labelCls}>Immagine / anteprima</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full border border-border bg-transparent p-2 text-xs file:mr-3 file:border file:border-border file:bg-transparent file:px-3 file:py-1 file:font-mono file:text-[10px] file:uppercase file:tracking-[0.2em]"
          />
        </div>
        <div className="flex items-end">
          <label className="flex cursor-pointer items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              className="h-4 w-4 accent-black"
            />
            Evidenzia questo lavoro
          </label>
        </div>
      </div>
      <button
        type="submit"
        disabled={busy}
        className="mt-6 flex h-10 items-center gap-2 bg-foreground px-6 font-mono text-[11px] uppercase tracking-[0.22em] text-background transition-colors hover:bg-muted-foreground disabled:opacity-50"
      >
        <Icon name="upload" size={14} />
        {busy ? "Caricamento…" : "Carica lavoro"}
      </button>
    </form>
  );
}

/* ================= Messaggi ================= */

function MessagesPanel() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const c = client();
    if (!c) return;
    try {
      const r = (await c.query("messages:list" as any, {})) as Message[];
      setMessages(r ?? []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function remove(id: string) {
    if (!confirm("Eliminare questo messaggio?")) return;
    await messageRemove(id);
    await load();
  }

  return (
    <div className="space-y-8">
      <h2 className="font-heading text-2xl uppercase">Messaggi — {messages.length}</h2>
      {loading ? (
        <p className="micro-label p-8 text-center">Caricamento…</p>
      ) : messages.length === 0 ? (
        <p className="border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
          Nessun messaggio ricevuto.
        </p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <div key={m._id} className="flex flex-col gap-3 border border-border p-5 md:flex-row md:items-start">
              <div className="flex-1">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {new Date(m.createdAt).toLocaleString("it-IT")} — {m.source}
                </p>
                <p className="mt-1 font-medium">{m.name} · {m.email}</p>
                <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{m.message}</p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`mailto:${m.email}`}
                  className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
                >
                  <Icon name="mail" size={13} />
                </a>
                <button
                  onClick={() => remove(m._id)}
                  className="flex h-8 w-8 items-center justify-center border border-border text-muted-foreground transition-colors hover:border-destructive hover:text-destructive"
                >
                  <Icon name="trash" size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ================= Upload helper ================= */

async function upload(file: File, kind: "posts" | "portfolio"): Promise<string> {
  const up = await getUploadUrl(kind);
  if (!up.ok || !up.url) throw new Error(up.error ?? "Upload non disponibile");
  const res = await fetch(up.url, {
    method: "POST",
    headers: { "Content-Type": file.type },
    body: file,
  });
  const { storageId } = (await res.json()) as { storageId: string };
  return storageId;
}

/* ================= Stato "Convex non collegato" ================= */

function NoConvex() {
  return (
    <div className="flex min-h-svh items-center justify-center px-5">
      <div className="max-w-md border border-border p-10 text-center">
        <LogoMark className="mx-auto mb-6 h-12" />
        <p className="micro-label mb-4">Backoffice in standby</p>
        <h2 className="font-heading text-xl uppercase">Collega Convex</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          Il backoffice (blog, portfolio, messaggi) è alimentato da Convex.
          Esegui <code className="border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">npx convex dev</code>{" "}
          e imposta <code className="border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">NEXT_PUBLIC_CONVEX_URL</code>{" "}
          nel file <code className="border border-border bg-muted px-1.5 py-0.5 font-mono text-xs">.env.local</code>.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground transition-colors hover:text-foreground"
        >
          Torna al sito
        </Link>
      </div>
    </div>
  );
}
