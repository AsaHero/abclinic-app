import type { Metadata } from "next";
import ServicesListPage from "@/components/admin/ServicesListPage";

export const metadata: Metadata = {
  title: "Услуги — abclinic.uz",
  robots: { index: false, follow: false },
};

export default function AdminServicesPage() {
  return <ServicesListPage />;
}
