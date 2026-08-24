import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getService, getServices, getCategories } from "@/lib/services/queries";
import ServiceDetailPageBody from "@/components/services/ServiceDetailPageBody";

const SITE = "https://abclinic.uz";

type Params = Promise<{ serviceId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { serviceId } = await params;
  const service = getService(serviceId);

  if (!service) {
    return {
      title: "Услуга не найдена — abclinic.uz",
      robots: { index: false, follow: false },
    };
  }

  const title = `${service.name} — abclinic.uz`;
  const description = service.description ?? "Подробности услуги в abclinic.uz";
  const url = `${SITE}/services/${serviceId}`;
  const image = service.heroImage ? `${SITE}${service.heroImage}` : `${SITE}/images/tour.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function ServiceDetailPage({ params }: { params: Params }) {
  const { serviceId } = await params;
  const service = getService(serviceId);
  if (!service) notFound();

  const categories = getCategories();
  const category = categories.find((c) => c.id === service.category) ?? null;
  const relatedServices = getServices(service.category)
    .filter((s) => s.id !== serviceId)
    .slice(0, 3);

  return <ServiceDetailPageBody service={service} category={category} relatedServices={relatedServices} />;
}
