"use server";

import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth/require-admin";

export interface Lead {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  service: string | null;
  message: string | null;
  source: string;
  status: string | null;
  createdAt: string;
}

// The public /api/contact route inserts here directly (no admin check
// needed there — it's the public submission endpoint); everything below is
// admin-only reads/mutations for actually working the leads it creates.
export async function getLeadsAction(): Promise<Lead[]> {
  await requireAdmin();
  return db.prepare("SELECT * FROM leads ORDER BY createdAt DESC").all() as Lead[];
}

export async function updateLeadStatusAction(id: number, status: string) {
  await requireAdmin();
  db.prepare("UPDATE leads SET status = ? WHERE id = ?").run(status, id);
  return { success: true };
}

export async function deleteLeadAction(id: number) {
  await requireAdmin();
  db.prepare("DELETE FROM leads WHERE id = ?").run(id);
  return { success: true };
}
