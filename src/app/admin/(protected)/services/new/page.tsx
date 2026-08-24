import type { Metadata } from "next";
import ServiceFormPage from "@/components/admin/ServiceFormPage";

export const metadata: Metadata = {
  title: "Новая услуга — abclinic.uz",
  robots: { index: false, follow: false },
};

export default function AdminNewServicePage() {
  return <ServiceFormPage />;
}
