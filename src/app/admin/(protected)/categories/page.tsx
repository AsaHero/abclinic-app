import type { Metadata } from "next";
import CategoriesPage from "@/components/admin/CategoriesPage";

export const metadata: Metadata = {
  title: "Категории — abclinic.uz",
  robots: { index: false, follow: false },
};

export default function AdminCategoriesPage() {
  return <CategoriesPage />;
}
