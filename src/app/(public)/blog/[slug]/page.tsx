import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedBlogPost, getPublishedBlogPosts } from "@/lib/blog/queries";
import BlogPostPageBody from "@/components/blog/BlogPostPageBody";

const SITE = "https://abclinic.uz";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPublishedBlogPost(slug);

  if (!post) {
    return {
      title: "Статья не найдена — abclinic.uz",
      robots: { index: false, follow: false },
    };
  }

  const title = `${post.title} — abclinic.uz`;
  const description = post.excerpt || post.title;
  const url = `${SITE}/blog/${slug}`;
  const image = post.coverImage ? `${SITE}${post.coverImage}` : `${SITE}/images/logo.png`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "article", title, description, url, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPublishedBlogPost(slug);
  if (!post) notFound();

  const related = getPublishedBlogPosts(post.category)
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return <BlogPostPageBody post={post} related={related} />;
}
