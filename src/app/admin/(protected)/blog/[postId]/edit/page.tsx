import type { Metadata } from "next";
import BlogFormPage from "@/components/admin/BlogFormPage";

export const metadata: Metadata = {
  title: "Редактировать статью — abclinic.uz",
  robots: { index: false, follow: false },
};

export default async function AdminEditBlogPostPage({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  return <BlogFormPage postId={postId} />;
}
