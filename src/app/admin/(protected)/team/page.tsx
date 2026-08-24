import type { Metadata } from "next";
import TeamListPage from "@/components/admin/TeamListPage";

export const metadata: Metadata = {
  title: "Команда — abclinic.uz",
  robots: { index: false, follow: false },
};

export default function AdminTeamPage() {
  return <TeamListPage />;
}
