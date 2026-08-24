import type { Metadata } from "next";
import BlogFormPage from "@/components/admin/BlogFormPage";

export const metadata: Metadata = {
  title: "Новая статья — abclinic.uz",
  robots: { index: false, follow: false },
};

export default function AdminNewBlogPostPage() {
  return <BlogFormPage />;
}
