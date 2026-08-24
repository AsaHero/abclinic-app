import type { Metadata } from "next";
import TeamFormPage from "@/components/admin/TeamFormPage";

export const metadata: Metadata = {
  title: "Новый сотрудник — abclinic.uz",
  robots: { index: false, follow: false },
};

export default function AdminNewTeamMemberPage() {
  return <TeamFormPage />;
}
