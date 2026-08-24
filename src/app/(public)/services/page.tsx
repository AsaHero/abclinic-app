import type { Metadata } from "next";
import { getServices, getCategories, getServiceGroups } from "@/lib/services/queries";
import PriceListPageBody from "@/components/services/PriceListPageBody";

const SITE = "https://abclinic.uz";
const OG_IMAGE = `${SITE}/images/hero.png`;

type SearchParams = Promise<{ category?: string }>;

function resolveActiveCategory(categoryParam: string | undefined, categories: { id: string }[]): string {
  return categoryParam && categories.some((c) => c.id === categoryParam) ? categoryParam : "all";
}

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const { category } = await searchParams;
  const categories = getCategories();
  const activeCategory = resolveActiveCategory(category, categories);

  const catTitle =
    activeCategory === "all" ? "Все услуги" : (categories.find((c) => c.id === activeCategory)?.title ?? "Услуги");
  const title = `${catTitle} — цены — abclinic.uz`;
  const description = `Актуальные цены: ${catTitle.toLowerCase()} в abclinic.uz. Гигиена GBT, реставрации, эстетика, имплантация, пакеты.`;
  const url =
    activeCategory === "all"
      ? `${SITE}/services`
      : `${SITE}/services?category=${encodeURIComponent(activeCategory)}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, images: [OG_IMAGE] },
    twitter: { card: "summary_large_image", title, description, images: [OG_IMAGE] },
  };
}

export default async function ServicesPage({ searchParams }: { searchParams: SearchParams }) {
  const { category } = await searchParams;
  const categories = getCategories();
  const services = getServices();
  const groups = getServiceGroups();
  const activeCategory = resolveActiveCategory(category, categories);

  const jsonLdServices =
    activeCategory === "all"
      ? services
      : services.filter((s) => s.category === activeCategory || s.categories?.includes(activeCategory));

  const itemListJson = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: jsonLdServices.slice(0, 12).map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `${SITE}/services/${s.id}`,
      name: s.name,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJson) }} />
      <PriceListPageBody categories={categories} services={services} groups={groups} initialCategory={activeCategory} />
    </>
  );
}
