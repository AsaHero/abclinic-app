"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getTeamMemberAction,
  createTeamMemberAction,
  updateTeamMemberAction,
} from "@/lib/team/actions";
import type { TeamMember } from "@/types/team";
import ImageUploader from "@/components/admin/ImageUploader";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

const ROLE_OPTIONS = ["DOCTOR", "MANAGER", "ADMINISTRATOR", "ASSISTANT"] as const;

const EMPTY: TeamMember = {
  id: "",
  firstName: "",
  lastName: "",
  role: "DOCTOR",
  roleTitle: "",
  photo: "",
  bio: "",
  education: [],
  certificates: [],
  sortOrder: 0,
};

// ── small field components (mirrors ServiceFormPage.tsx) ─────────────────────

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({
  label, required, children,
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-300 mb-1.5">
      {label}
      {required && <span className="text-red-400 ml-0.5">*</span>}
    </label>
    {children}
  </div>
);

const TextInput: React.FC<
  React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean }
> = ({ label, required, ...props }) => (
  <Field label={label} required={required}>
    <input
      {...props}
      className="w-full bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors"
    />
  </Field>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-2 border-t border-white/8 mt-2">
    {children}
  </h3>
);

const StringList: React.FC<{
  values: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  renderItem?: (val: string, onChange: (v: string) => void) => React.ReactNode;
}> = ({ values, onChange, placeholder, renderItem }) => {
  const update = (i: number, val: string) => {
    const next = [...values];
    next[i] = val;
    onChange(next);
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, ""]);

  return (
    <div className="space-y-2">
      {values.map((val, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex-1">
            {renderItem ? (
              renderItem(val, (v) => update(i, v))
            ) : (
              <input
                value={val}
                onChange={(e) => update(i, e.target.value)}
                placeholder={placeholder}
                className="w-full bg-[#12161b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400"
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => remove(i)}
            aria-label={`Удалить пункт ${i + 1}`}
            className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors flex-shrink-0"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        <Plus size={14} />
        Добавить
      </button>
    </div>
  );
};

// ── main component ────────────────────────────────────────────────────────────

interface TeamFormPageProps {
  memberId?: string;
}

const TeamFormPage: React.FC<TeamFormPageProps> = ({ memberId }) => {
  const isEditing = !!memberId;
  const router = useRouter();
  const qc = useQueryClient();

  const [form, setForm] = useState<TeamMember>({ ...EMPTY });
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load existing member
  const { data: existing, isLoading: loadingMember } = useQuery({
    queryKey: ["team-member", memberId],
    queryFn: () => getTeamMemberAction(memberId!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        ...EMPTY,
        ...existing,
        education: existing.education ?? [],
        certificates: existing.certificates ?? [],
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: isEditing
      ? (data: TeamMember) => updateTeamMemberAction(memberId!, data)
      : (data: TeamMember) => createTeamMemberAction(data),
    onSuccess: (result) => {
      if (!result.success) {
        setSaveError(result.error);
        return;
      }
      qc.invalidateQueries({ queryKey: ["team-members"] });
      qc.invalidateQueries({ queryKey: ["team-member", memberId] });
      router.push("/admin/team");
    },
    onError: (e: any) => setSaveError(e.message ?? "Не удалось сохранить"),
  });

  const set = <K extends keyof TeamMember>(key: K, value: TeamMember[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    mutation.mutate(form);
  };

  if (isEditing && loadingMember) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/team")}
            aria-label="Назад к команде"
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {isEditing ? "Редактировать сотрудника" : "Новый сотрудник"}
            </h1>
            {isEditing && <p className="text-xs text-gray-500 mt-0.5">{memberId}</p>}
          </div>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium px-5 py-2.5 rounded-xl transition-colors"
        >
          <Save size={16} />
          {mutation.isPending ? "Сохранение…" : "Сохранить"}
        </button>
      </div>

      {saveError && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
          {saveError}
        </p>
      )}

      {/* Card wrapper */}
      <div className="bg-[#1a1e25] border border-white/8 rounded-2xl p-6 space-y-6">

        {/* ── Core fields ── */}
        <SectionTitle>Основное</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextInput
            label="ID"
            required
            value={form.id}
            onChange={(e) => set("id", e.target.value)}
            placeholder="напр. ivanov-ivan"
            disabled={isEditing}
          />
          <Field label="Роль" required>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextInput
            label="Имя"
            required
            value={form.firstName}
            onChange={(e) => set("firstName", e.target.value)}
            placeholder="Иван"
          />
          <TextInput
            label="Фамилия"
            required
            value={form.lastName}
            onChange={(e) => set("lastName", e.target.value)}
            placeholder="Иванов"
          />
        </div>

        <TextInput
          label="Должность (для сайта)"
          value={form.roleTitle ?? ""}
          onChange={(e) => set("roleTitle", e.target.value)}
          placeholder="напр. Стоматолог-терапевт"
        />

        <Field label="Порядок сортировки">
          <input
            type="number"
            value={form.sortOrder ?? 0}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
            className="w-32 bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
          />
        </Field>

        {/* ── Photo ── */}
        <SectionTitle>Фото</SectionTitle>
        <ImageUploader
          label="Фото"
          value={form.photo ?? ""}
          onChange={(url) => set("photo", url)}
        />

        {/* ── Bio ── */}
        <SectionTitle>Биография (Markdown)</SectionTitle>
        <MarkdownEditor
          value={form.bio ?? ""}
          onChange={(v) => set("bio", v)}
          rows={16}
        />

        {/* ── Education ── */}
        <SectionTitle>Образование</SectionTitle>
        <StringList
          values={form.education ?? []}
          onChange={(v) => set("education", v)}
          placeholder="напр. ТашГосСМИ, стоматологический факультет, 2015"
        />

        {/* ── Certificates ── */}
        <SectionTitle>Сертификаты / дипломы (изображения)</SectionTitle>
        <StringList
          values={form.certificates ?? []}
          onChange={(v) => set("certificates", v)}
          placeholder="/images/certificate.jpg"
          renderItem={(url, onItemChange) => (
            <ImageUploader value={url} onChange={onItemChange} />
          )}
        />
      </div>

      {/* Bottom save */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          <Save size={16} />
          {mutation.isPending ? "Сохранение…" : "Сохранить сотрудника"}
        </button>
      </div>
    </form>
  );
};

export default TeamFormPage;
