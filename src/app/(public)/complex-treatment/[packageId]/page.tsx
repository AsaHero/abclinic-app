import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPackageById, getAllPackages } from "@/types/packageData";
import { getTeamMembers } from "@/lib/team/queries";
import PackageDetailPageBody from "@/components/services/PackageDetailPageBody";

const SITE = "https://abclinic.uz";

type Params = Promise<{ packageId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { packageId } = await params;
  const packageItem = getPackageById(packageId);

  if (!packageItem) {
    return {
      title: "Программа не найдена — abclinic.uz",
      robots: { index: false, follow: false },
    };
  }

  const title = `${packageItem.name} — abclinic.uz`;
  const description = packageItem.detailedDescription ?? packageItem.description;
  const url = `${SITE}/complex-treatment/${packageId}`;
  const image = packageItem.imageUrl ? `${SITE}${packageItem.imageUrl}` : `${SITE}/images/tour.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image] },
  };
}

export default async function PackageDetailPage({ params }: { params: Params }) {
  const { packageId } = await params;
  const packageItem = getPackageById(packageId);
  if (!packageItem) notFound();

  const relatedPackages = packageItem.category
    ? getAllPackages()
        .filter((p) => p.category === packageItem.category && p.id !== packageItem.id)
        .slice(0, 2)
    : [];

  const specialists = getTeamMembers().slice(0, 3);

  return <PackageDetailPageBody packageItem={packageItem} relatedPackages={relatedPackages} specialists={specialists} />;
}
