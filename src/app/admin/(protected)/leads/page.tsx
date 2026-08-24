import type { Metadata } from "next";
import LeadsListPage from "@/components/admin/LeadsListPage";

export const metadata: Metadata = {
  title: "Заявки — abclinic.uz",
  robots: { index: false, follow: false },
};

export default function AdminLeadsPage() {
  return <LeadsListPage />;
}
