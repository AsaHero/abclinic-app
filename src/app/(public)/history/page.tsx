import type { Metadata } from "next";
import HistoryPageBody from "@/components/history/HistoryPageBody";

const SITE = "https://abclinic.uz";

export const metadata: Metadata = {
  title: "История клиники — abclinic.uz",
  description:
    "Три поколения стоматологов Азимовых — от 1936 года до основания abclinic.uz в 2020 году и сегодняшнего дня.",
  alternates: { canonical: `${SITE}/history` },
  openGraph: {
    type: "website",
    title: "История клиники — abclinic.uz",
    description:
      "Три поколения стоматологов Азимовых — от 1936 года до основания abclinic.uz в 2020 году и сегодняшнего дня.",
    url: `${SITE}/history`,
    images: [`${SITE}/images/timeline/2020.jpg`],
  },
};

export default function HistoryPage() {
  return <HistoryPageBody />;
}
