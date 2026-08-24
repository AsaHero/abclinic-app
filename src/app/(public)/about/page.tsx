import type { Metadata } from "next";
import AboutPageBody from "@/components/about/AboutPageBody";

const SITE = "https://abclinic.uz";
const OG_IMAGE = `${SITE}/images/hero.png`;

const TITLE = "О клинике — abclinic.uz";
const DESCRIPTION =
  "История клиники abclinic.uz: три поколения одной семьи в стоматологии, современные технологии и подход, минимизирующий вмешательство.";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: `${SITE}/about` },
    openGraph: {
      type: "website",
      title: TITLE,
      description: DESCRIPTION,
      url: `${SITE}/about`,
      images: [OG_IMAGE],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description: DESCRIPTION,
      images: [OG_IMAGE],
    },
  };
}

export default function AboutPage() {
  return <AboutPageBody />;
}
