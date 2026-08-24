import type { Metadata } from "next";
import { getCategories } from "@/lib/services/queries";
import ContactPageBody from "@/components/contact/ContactPageBody";

// categories come from the admin-managed DB — must render per-request, not
// get frozen at build time (the Docker build runs against an empty data/ dir).
export const dynamic = "force-dynamic";

const SITE = "https://abclinic.uz";
const OG_IMAGE = `${SITE}/images/hero.png`;

export const metadata: Metadata = {
  title: "Контакты — abclinic.uz",
  description:
    "Запишитесь на приём: телефон, email, адрес и режим работы abclinic.uz. Гигиена GBT, эстетика, имплантация.",
  alternates: { canonical: `${SITE}/contact` },
  openGraph: {
    type: "website",
    title: "Контакты — abclinic.uz",
    description:
      "Запишитесь на приём: телефон, email, адрес и режим работы abclinic.uz. Гигиена GBT, эстетика, имплантация.",
    url: `${SITE}/contact`,
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Контакты — abclinic.uz",
    description:
      "Запишитесь на приём: телефон, email, адрес и режим работы abclinic.uz. Гигиена GBT, эстетика, имплантация.",
    images: [OG_IMAGE],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Dentist",
  name: "abclinic.uz",
  url: SITE,
  image: OG_IMAGE,
  telephone: "+998951228855",
  email: "abclinicuz@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressCountry: "UZ",
    addressLocality: "Tashkent",
    streetAddress: "ул. Нукусс, 88/55",
  },
  geo: { "@type": "GeoCoordinates", latitude: 41.288424, longitude: 69.27495 },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: ["https://t.me/abclinic_support", "https://www.instagram.com/abclinic"],
};

export default function ContactPage() {
  const categories = getCategories();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ContactPageBody categories={categories} />
    </>
  );
}
