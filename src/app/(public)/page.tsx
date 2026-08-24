import type { Metadata } from "next";
import HomePageBody from "@/components/home/HomePageBody";
import { getBeforeAfterCases } from "@/lib/services/queries";

export const metadata: Metadata = {
  title: "abclinic.uz — стоматология для взрослых в Ташкенте",
  description:
    "Профессиональная гигиена GBT, эстетика, имплантация. Запишитесь на консультацию.",
  alternates: { canonical: "https://abclinic.uz/" },
  openGraph: {
    type: "website",
    title: "abclinic.uz — стоматология для взрослых в Ташкенте",
    description:
      "Профессиональная гигиена GBT, эстетика, имплантация. Запишитесь на консультацию.",
    url: "https://abclinic.uz/",
    images: ["https://abclinic.uz/images/hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "abclinic.uz — стоматология для взрослых в Ташкенте",
    description:
      "Профессиональная гигиена GBT, эстетика, имплантация. Запишитесь на консультацию.",
    images: ["https://abclinic.uz/images/hero.png"],
  },
};

export default function HomePage() {
  const beforeAfterCases = getBeforeAfterCases();
  return <HomePageBody beforeAfterCases={beforeAfterCases} />;
}
