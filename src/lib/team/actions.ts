"use server";

import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getTeamMember, getTeamMembers } from "./queries";
import type { TeamMember } from "@/types/team";
import type { ActionResult } from "@/lib/services/actions";

export async function getTeamMembersAction() {
  return getTeamMembers();
}

export async function getTeamMemberAction(id: string) {
  return getTeamMember(id);
}

function serialize(member: Partial<TeamMember>) {
  return {
    education:
      Array.isArray(member.education) && member.education.length > 0
        ? JSON.stringify(member.education)
        : null,
    certificates:
      Array.isArray(member.certificates) && member.certificates.length > 0
        ? JSON.stringify(member.certificates)
        : null,
  };
}

export async function createTeamMemberAction(data: TeamMember): Promise<ActionResult> {
  await requireAdmin();

  if (!data.id?.trim() || !data.firstName?.trim() || !data.lastName?.trim() || !data.role?.trim()) {
    return { success: false, error: "id, firstName, lastName и role обязательны" };
  }
  if (getTeamMember(data.id)) {
    return { success: false, error: `Сотрудник с id "${data.id}" уже существует` };
  }

  const serialized = serialize(data);
  db.prepare(
    `INSERT INTO team_members (id, firstName, lastName, role, roleTitle, photo, bio, education, certificates, sortOrder)
     VALUES (@id, @firstName, @lastName, @role, @roleTitle, @photo, @bio, @education, @certificates, @sortOrder)`,
  ).run({
    id: data.id,
    firstName: data.firstName,
    lastName: data.lastName,
    role: data.role,
    roleTitle: data.roleTitle ?? null,
    photo: data.photo ?? null,
    bio: data.bio ?? null,
    education: serialized.education,
    certificates: serialized.certificates,
    sortOrder: data.sortOrder ?? 0,
  });

  return { success: true };
}

export async function updateTeamMemberAction(
  id: string,
  data: Partial<TeamMember>,
): Promise<ActionResult> {
  await requireAdmin();

  const existing = getTeamMember(id);
  if (!existing) {
    return { success: false, error: "Сотрудник не найден" };
  }

  const merged = { ...existing, ...data, id };
  const serialized = serialize(merged);
  db.prepare(
    `UPDATE team_members SET
      firstName = @firstName, lastName = @lastName, role = @role, roleTitle = @roleTitle,
      photo = @photo, bio = @bio, education = @education, certificates = @certificates,
      sortOrder = @sortOrder, updatedAt = datetime('now')
    WHERE id = @id`,
  ).run({
    id,
    firstName: merged.firstName,
    lastName: merged.lastName,
    role: merged.role,
    roleTitle: merged.roleTitle ?? null,
    photo: merged.photo ?? null,
    bio: merged.bio ?? null,
    education: serialized.education,
    certificates: serialized.certificates,
    sortOrder: merged.sortOrder ?? 0,
  });

  return { success: true };
}

export async function deleteTeamMemberAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const result = db.prepare("DELETE FROM team_members WHERE id = ?").run(id);
  if (result.changes === 0) {
    return { success: false, error: "Сотрудник не найден" };
  }
  return { success: true };
}
