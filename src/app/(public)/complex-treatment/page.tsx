import type { Metadata } from "next";
import { getAllPackages } from "@/types/packageData";
import ComplexTreatmentPageBody from "@/components/services/ComplexTreatmentPageBody";

const SITE = "https://abclinic.uz";
const TITLE = "Комплексное лечение — abclinic.uz";
const DESCRIPTION =
  "Оптимальные решения для комплексных стоматологических проблем. Наши программы разработаны специалистами для максимальной эффективности лечения.";
const OG_IMAGE = `${SITE}/images/hero.png`;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE}/complex-treatment` },
    openGraph: {
      type: "website",
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE}/complex-treatment`,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
  };
}

export default async function ComplexTreatmentPage() {
  const packages = getAllPackages();
  return <ComplexTreatmentPageBody packages={packages} />;
}
