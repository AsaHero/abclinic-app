import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTeamMember } from "@/lib/team/queries";
import TeamMemberPageBody from "@/components/team/TeamMemberPageBody";

const SITE = "https://abclinic.uz";

type Params = Promise<{ memberId: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { memberId } = await params;
  const member = getTeamMember(memberId);

  if (!member) {
    return {
      title: "Специалист не найден — abclinic.uz",
      robots: { index: false, follow: false },
    };
  }

  const title = `${member.firstName} ${member.lastName} — abclinic.uz`;
  const description = `${member.roleTitle || member.role} в клинике abclinic.uz.`;
  const url = `${SITE}/team/${memberId}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { type: "profile", title, description, url },
    twitter: { card: "summary", title, description },
  };
}

export default async function TeamMemberPage({ params }: { params: Params }) {
  const { memberId } = await params;
  const member = getTeamMember(memberId);
  if (!member) notFound();

  return <TeamMemberPageBody member={member} />;
}
