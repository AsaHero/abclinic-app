import type { Metadata } from "next";
import ServiceFormPage from "@/components/admin/ServiceFormPage";

export const metadata: Metadata = {
  title: "Редактировать услугу — abclinic.uz",
  robots: { index: false, follow: false },
};

export default async function AdminEditServicePage({
  params,
}: {
  params: Promise<{ serviceId: string }>;
}) {
  const { serviceId } = await params;
  return <ServiceFormPage serviceId={serviceId} />;
}
