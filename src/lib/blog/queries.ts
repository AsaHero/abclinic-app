import "server-only";
import db from "@/lib/db";
import type { BlogPost } from "@/types/blog";

type Row = Record<string, unknown>;

function parseRow(row: Row | undefined): BlogPost | null {
  if (!row) return null;
  return { ...row, published: !!row.published } as unknown as BlogPost;
}

/** All posts, published and draft — admin use. */
export function getBlogPosts(): BlogPost[] {
  const rows = db.prepare("SELECT * FROM blog_posts ORDER BY createdAt DESC").all() as Row[];
  return rows.map((row) => parseRow(row)!);
}

/** Published posts only, newest first — public site use. */
export function getPublishedBlogPosts(category?: string): BlogPost[] {
  const rows = category
    ? (db
        .prepare("SELECT * FROM blog_posts WHERE published = 1 AND category = ? ORDER BY publishedAt DESC")
        .all(category) as Row[])
    : (db.prepare("SELECT * FROM blog_posts WHERE published = 1 ORDER BY publishedAt DESC").all() as Row[]);
  return rows.map((row) => parseRow(row)!);
}

export function getBlogPost(id: string): BlogPost | null {
  const row = db.prepare("SELECT * FROM blog_posts WHERE id = ?").get(id) as Row | undefined;
  return parseRow(row);
}

/** Published post only — 404s a draft slug reached directly on the public site. */
export function getPublishedBlogPost(id: string): BlogPost | null {
  const row = db.prepare("SELECT * FROM blog_posts WHERE id = ? AND published = 1").get(id) as Row | undefined;
  return parseRow(row);
}
