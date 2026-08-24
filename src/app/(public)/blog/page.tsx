import type { Metadata } from "next";
import { getPublishedBlogPosts } from "@/lib/blog/queries";
import { BLOG_CATEGORIES } from "@/types/blog";
import BlogPageBody from "@/components/blog/BlogPageBody";

const SITE = "https://abclinic.uz";

export const metadata: Metadata = {
  title: "Блог — abclinic.uz",
  description: "Полезные статьи о стоматологии и жизнь клиники abclinic.uz изнутри.",
  alternates: { canonical: `${SITE}/blog` },
  openGraph: {
    type: "website",
    title: "Блог — abclinic.uz",
    description: "Полезные статьи о стоматологии и жизнь клиники abclinic.uz изнутри.",
    url: `${SITE}/blog`,
  },
};

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = getPublishedBlogPosts(category);

  return <BlogPageBody posts={posts} categories={[...BLOG_CATEGORIES]} activeCategory={category} />;
}
