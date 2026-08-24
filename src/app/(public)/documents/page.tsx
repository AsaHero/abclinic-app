import type { Metadata } from "next";
import DocumentsPageBody from "@/components/documents/DocumentsPageBody";

const SITE = "https://abclinic.uz";
const TITLE = "Подготовка к приему — abclinic.uz";
const DESCRIPTION =
  "Что нужно знать и подготовить перед визитом в клинику: рекомендации и документы.";
const OG_IMAGE = `${SITE}/images/hero.png`;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE}/documents` },
    openGraph: {
      type: "website",
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE}/documents`,
      images: [OG_IMAGE],
    },
    twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE] },
  };
}

export default function DocumentsPage() {
  return <DocumentsPageBody />;
}
