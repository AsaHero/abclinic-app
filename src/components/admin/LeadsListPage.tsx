"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getLeadsAction, updateLeadStatusAction, deleteLeadAction } from "@/lib/leads/actions";
import { Phone, Mail, Trash2 } from "lucide-react";

const STATUSES = ["new", "contacted", "closed"] as const;

// DB stores these as-is (leads.status) — only the on-screen label is
// translated, so existing rows and the filter logic stay untouched.
const STATUS_LABEL: Record<string, string> = {
  new: "новая",
  contacted: "на связи",
  closed: "закрыта",
};

const STATUS_STYLE: Record<string, string> = {
  new: "bg-orange-500/15 text-orange-400",
  contacted: "bg-blue-500/15 text-blue-400",
  closed: "bg-green-500/15 text-green-400",
};

// No leads UI existed anywhere in admin before this — the public contact
// form (ContactPageBody.tsx) has posted to /api/contact and landed rows in
// the `leads` table since the form shipped, with no way for staff to see
// them short of querying the SQLite file directly. This is that missing
// read/action surface.
const LeadsListPage: React.FC = () => {
  const qc = useQueryClient();

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["leads"],
    queryFn: () => getLeadsAction(),
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) => updateLeadStatusAction(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteLeadAction(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-white">Заявки</h1>
        <p className="text-gray-500 text-sm mt-0.5">
          Всего: {leads.length} · с формы обратной связи на /contact
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400" />
        </div>
      ) : leads.length === 0 ? (
        <div className="bg-[#1a1e25] border border-white/8 rounded-2xl px-5 py-10 text-center text-gray-500 text-sm">
          Заявок пока нет
        </div>
      ) : (
        <div className="bg-[#1a1e25] border border-white/8 rounded-2xl overflow-hidden">
          {leads.map((lead, i) => (
            <div
              key={lead.id}
              className={`px-5 py-4 ${i !== 0 ? "border-t border-white/5" : ""}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-white">{lead.name}</p>
                    <select
                      value={lead.status ?? "new"}
                      onChange={(e) => statusMutation.mutate({ id: lead.id, status: e.target.value })}
                      className={`text-xs rounded-lg px-2 py-0.5 border-0 focus:outline-none focus:ring-1 focus:ring-white/20 ${STATUS_STYLE[lead.status ?? "new"] ?? STATUS_STYLE.new}`}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-[#1a1e25] text-white">
                          {STATUS_LABEL[s]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-gray-400">
                    {lead.phone && (
                      <a href={`tel:${lead.phone}`} className="flex items-center gap-1 hover:text-white">
                        <Phone size={12} /> {lead.phone}
                      </a>
                    )}
                    {lead.email && (
                      <a href={`mailto:${lead.email}`} className="flex items-center gap-1 hover:text-white">
                        <Mail size={12} /> {lead.email}
                      </a>
                    )}
                    {lead.service && <span>Услуга: {lead.service}</span>}
                    <span>{new Date(lead.createdAt).toLocaleString("ru-RU")}</span>
                  </div>
                  {lead.message && <p className="mt-2 text-sm text-gray-300">{lead.message}</p>}
                </div>

                <button
                  onClick={() => deleteMutation.mutate(lead.id)}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
                  aria-label="Удалить заявку"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LeadsListPage;
