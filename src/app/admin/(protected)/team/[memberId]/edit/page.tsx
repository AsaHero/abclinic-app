import type { Metadata } from "next";
import TeamFormPage from "@/components/admin/TeamFormPage";

export const metadata: Metadata = {
  title: "Редактировать сотрудника — abclinic.uz",
  robots: { index: false, follow: false },
};

export default async function AdminEditTeamMemberPage({
  params,
}: {
  params: Promise<{ memberId: string }>;
}) {
  const { memberId } = await params;
  return <TeamFormPage memberId={memberId} />;
}
