import type { Metadata } from "next";
import BlogListPage from "@/components/admin/BlogListPage";

export const metadata: Metadata = {
  title: "Блог — abclinic.uz",
  robots: { index: false, follow: false },
};

export default function AdminBlogPage() {
  return <BlogListPage />;
}
