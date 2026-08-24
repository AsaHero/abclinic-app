import "server-only";
import db from "@/lib/db";
import type { TeamMember } from "@/types/team";

type Row = Record<string, unknown>;

function parseRow(row: Row | undefined): TeamMember | null {
  if (!row) return null;
  const parsed: Row = { ...row };
  if (parsed.education) {
    try {
      parsed.education = JSON.parse(parsed.education as string);
    } catch {
      // leave as-is
    }
  }
  if (parsed.certificates) {
    try {
      parsed.certificates = JSON.parse(parsed.certificates as string);
    } catch {
      // leave as-is
    }
  }
  return parsed as unknown as TeamMember;
}

export function getTeamMembers(): TeamMember[] {
  const rows = db.prepare("SELECT * FROM team_members ORDER BY sortOrder, lastName").all() as Row[];
  return rows.map((row) => parseRow(row)!);
}

export function getTeamMember(id: string): TeamMember | null {
  const row = db.prepare("SELECT * FROM team_members WHERE id = ?").get(id) as Row | undefined;
  return parseRow(row);
}
