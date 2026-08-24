"use server";

import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getBlogPost, getBlogPosts, getPublishedBlogPosts } from "./queries";
import type { BlogPost } from "@/types/blog";
import type { ActionResult } from "@/lib/services/actions";

export async function getBlogPostsAction() {
  return getBlogPosts();
}

export async function getPublishedBlogPostsAction(category?: string) {
  return getPublishedBlogPosts(category);
}

export async function getBlogPostAction(id: string) {
  return getBlogPost(id);
}

export async function createBlogPostAction(data: BlogPost): Promise<ActionResult> {
  await requireAdmin();

  if (!data.id?.trim() || !data.title?.trim()) {
    return { success: false, error: "id и title обязательны" };
  }
  if (getBlogPost(data.id)) {
    return { success: false, error: `Статья с id "${data.id}" уже существует` };
  }

  const publishedAt = data.published ? (data.publishedAt || new Date().toISOString()) : null;

  db.prepare(
    `INSERT INTO blog_posts (id, title, excerpt, content, coverImage, category, published, publishedAt)
     VALUES (@id, @title, @excerpt, @content, @coverImage, @category, @published, @publishedAt)`,
  ).run({
    id: data.id,
    title: data.title,
    excerpt: data.excerpt ?? null,
    content: data.content ?? null,
    coverImage: data.coverImage ?? null,
    category: data.category ?? null,
    published: data.published ? 1 : 0,
    publishedAt,
  });

  return { success: true };
}

export async function updateBlogPostAction(id: string, data: Partial<BlogPost>): Promise<ActionResult> {
  await requireAdmin();

  const existing = getBlogPost(id);
  if (!existing) {
    return { success: false, error: "Статья не найдена" };
  }

  const merged = { ...existing, ...data, id };
  // Publishing for the first time stamps publishedAt now; already-published
  // posts keep their original date even when edited.
  const publishedAt = merged.published ? (existing.publishedAt ?? new Date().toISOString()) : merged.publishedAt ?? null;

  db.prepare(
    `UPDATE blog_posts SET
      title = @title, excerpt = @excerpt, content = @content, coverImage = @coverImage,
      category = @category, published = @published, publishedAt = @publishedAt,
      updatedAt = datetime('now')
    WHERE id = @id`,
  ).run({
    id,
    title: merged.title,
    excerpt: merged.excerpt ?? null,
    content: merged.content ?? null,
    coverImage: merged.coverImage ?? null,
    category: merged.category ?? null,
    published: merged.published ? 1 : 0,
    publishedAt,
  });

  return { success: true };
}

export async function deleteBlogPostAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const result = db.prepare("DELETE FROM blog_posts WHERE id = ?").run(id);
  if (result.changes === 0) {
    return { success: false, error: "Статья не найдена" };
  }
  return { success: true };
}
