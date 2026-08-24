import type { Metadata } from "next";
import { getTeamMembers } from "@/lib/team/queries";
import TeamPageBody from "@/components/team/TeamPageBody";

const SITE = "https://abclinic.uz";

export const metadata: Metadata = {
  title: "Команда — abclinic.uz",
  description: "Специалисты клиники abclinic.uz — врачи и сотрудники, которые вас принимают.",
  alternates: { canonical: `${SITE}/team` },
  openGraph: {
    type: "website",
    title: "Команда — abclinic.uz",
    description: "Специалисты клиники abclinic.uz — врачи и сотрудники, которые вас принимают.",
    url: `${SITE}/team`,
  },
};

export default function TeamPage() {
  const members = getTeamMembers();
  return <TeamPageBody members={members} />;
}
