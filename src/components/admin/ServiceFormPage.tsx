"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServiceAction,
  getCategoriesAction,
  createServiceAction,
  updateServiceAction,
} from "@/lib/services/actions";
import type { PriceItem, BeforeAfterCategory } from "@/types/serviceData";
import { BEFORE_AFTER_CATEGORIES } from "@/types/serviceData";
import ImageUploader from "@/components/admin/ImageUploader";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { Plus, Trash2, ArrowLeft, Save } from "lucide-react";

// ── helpers ──────────────────────────────────────────────────────────────────

const EMPTY: Partial<PriceItem> & { id: string; name: string; price: number; category: string } = {
  id: "",
  name: "",
  price: 0,
  category: "",
  categories: [],
  description: "",
  detailedDescription: "",
  duration: "",
  heroImage: "",
  backgroundPosition: "",
  popular: false,
  isSpecialOffer: false,
  includesConsultation: false,
  requiresConsultation: false,
  isPublic: true,
  benefits: [],
  process: [],
  suitableFor: [],
  faqs: [],
  beforeAfterImages: [],
  serviceVideo: "",
  galleryImages: [],
  sortOrder: 0,
};

// ── small field components ────────────────────────────────────────────────────

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

const Toggle: React.FC<{
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}> = ({ label, description, checked, onChange }) => (
  <label className="flex items-start gap-3 cursor-pointer group">
    <div
      onClick={() => onChange(!checked)}
      className={`relative mt-0.5 w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
        checked ? "bg-blue-500" : "bg-white/10 group-hover:bg-white/15"
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-1"
        }`}
      />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-200">{label}</p>
      {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
    </div>
  </label>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider pt-2 border-t border-white/8 mt-2">
    {children}
  </h3>
);

// ── main component ────────────────────────────────────────────────────────────

interface ServiceFormPageProps {
  serviceId?: string;
}

const ServiceFormPage: React.FC<ServiceFormPageProps> = ({ serviceId }) => {
  const isEditing = !!serviceId;
  const router = useRouter();
  const qc = useQueryClient();

  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load existing service
  const { data: existing, isLoading: loadingService } = useQuery({
    queryKey: ["service", serviceId],
    queryFn: () => getServiceAction(serviceId!),
    enabled: isEditing,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesAction(),
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (existing) {
      setForm({
        ...EMPTY,
        ...existing,
        categories: existing.categories ?? [],
        benefits: existing.benefits ?? [],
        process: existing.process ?? [],
        suitableFor: existing.suitableFor ?? [],
        faqs: existing.faqs ?? [],
        beforeAfterImages: existing.beforeAfterImages ?? [],
        galleryImages: existing.galleryImages ?? [],
      });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: isEditing
      ? (data: typeof form) => updateServiceAction(serviceId!, data as Partial<PriceItem>)
      : (data: typeof form) => createServiceAction(data as PriceItem),
    onSuccess: (result) => {
      if (!result.success) {
        setSaveError(result.error);
        return;
      }
      qc.invalidateQueries({ queryKey: ["services"] });
      qc.invalidateQueries({ queryKey: ["service", serviceId] });
      router.push("/admin/services");
    },
    onError: (e: any) => setSaveError(e.message ?? "Не удалось сохранить"),
  });

  const set = <K extends keyof typeof form>(key: K, value: typeof form[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    mutation.mutate(form);
  };

  if (isEditing && loadingService) {
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
            onClick={() => router.push("/admin/services")}
            aria-label="Назад к услугам"
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {isEditing ? "Редактировать услугу" : "Новая услуга"}
            </h1>
            {isEditing && <p className="text-xs text-gray-500 mt-0.5">{serviceId}</p>}
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
            placeholder="напр. hygiene-regular"
            disabled={isEditing}
          />
          <TextInput
            label="Название"
            required
            value={form.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="Название услуги"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Цена (сум)" required>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => set("price", Number(e.target.value))}
              className="w-full bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
            />
          </Field>

          <Field label="Основная категория" required>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="w-full bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
            >
              <option value="">Выберите…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </Field>

          <TextInput
            label="Длительность"
            value={form.duration ?? ""}
            onChange={(e) => set("duration", e.target.value)}
            placeholder="напр. 60 мин"
          />
        </div>

        {/* Additional categories */}
        <Field label="Дополнительные категории (можно несколько)">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const checked = form.categories?.includes(c.id) ?? false;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    set(
                      "categories",
                      checked
                        ? (form.categories ?? []).filter((x) => x !== c.id)
                        : [...(form.categories ?? []), c.id]
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    checked
                      ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                      : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20"
                  }`}
                >
                  {c.title}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Краткое описание">
          <textarea
            value={form.description ?? ""}
            onChange={(e) => set("description", e.target.value)}
            rows={2}
            className="w-full bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors resize-y"
            placeholder="Строка описания, показывается в списке"
          />
        </Field>

        <Field label="Порядок сортировки">
          <input
            type="number"
            value={form.sortOrder ?? 0}
            onChange={(e) => set("sortOrder", Number(e.target.value))}
            className="w-32 bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
          />
        </Field>

        {/* ── Flags ── */}
        <SectionTitle>Метки</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Toggle label="Популярно" description="Показывать в карусели «Популярные услуги»" checked={!!form.popular} onChange={(v) => set("popular", v)} />
          <Toggle label="Спецпредложение" description="Анимированная рамка, бейдж предложения" checked={!!form.isSpecialOffer} onChange={(v) => set("isSpecialOffer", v)} />
          <Toggle label="Включает консультацию" description="Отдельная консультация не нужна" checked={!!form.includesConsultation} onChange={(v) => set("includesConsultation", v)} />
          <Toggle label="Требует консультации" description="Сначала нужно записаться на консультацию" checked={!!form.requiresConsultation} onChange={(v) => set("requiresConsultation", v)} />
          <Toggle
            label="Публично"
            description="Выкл. = цена только для персонала, скрыта со всех публичных страниц/поиска/sitemap"
            checked={form.isPublic !== false}
            onChange={(v) => set("isPublic", v)}
          />
        </div>

        {/* ── Images ── */}
        <SectionTitle>Главное изображение</SectionTitle>
        <ImageUploader
          label="Главное изображение"
          value={form.heroImage ?? ""}
          onChange={(url) => set("heroImage", url)}
        />
        <TextInput
          label="Позиция фона (CSS)"
          value={form.backgroundPosition ?? ""}
          onChange={(e) => set("backgroundPosition", e.target.value)}
          placeholder="напр. 50% 35%"
        />

        {/* ── Detailed description ── */}
        <SectionTitle>Подробное описание (Markdown)</SectionTitle>
        <MarkdownEditor
          value={form.detailedDescription ?? ""}
          onChange={(v) => set("detailedDescription", v)}
          rows={22}
        />

        {/* ── Benefits ── */}
        <SectionTitle>Преимущества</SectionTitle>
        <StringList
          values={form.benefits ?? []}
          onChange={(v) => set("benefits", v)}
          placeholder="Добавить преимущество…"
        />

        {/* ── FAQ ── */}
        <SectionTitle>Вопросы и ответы</SectionTitle>
        <FaqList
          values={form.faqs ?? []}
          onChange={(v) => set("faqs", v)}
        />

        {/* ── Gallery & video ── */}
        <SectionTitle>Изображения галереи</SectionTitle>
        <StringList
          values={form.galleryImages ?? []}
          onChange={(v) => set("galleryImages", v)}
          placeholder="/images/photo.jpg"
          renderItem={(url, onItemChange) => (
            <div className="flex items-center gap-2">
              {url && (
                <img
                  src={url}
                  alt="Превью изображения галереи"
                  className="h-10 w-14 object-cover rounded-lg border border-white/10 flex-shrink-0"
                />
              )}
              <input
                value={url}
                onChange={(e) => onItemChange(e.target.value)}
                className="flex-1 bg-[#12161b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400"
                placeholder="/images/photo.jpg"
              />
            </div>
          )}
        />

        <SectionTitle>Фото «До / После»</SectionTitle>
        <BeforeAfterList
          values={form.beforeAfterImages ?? []}
          onChange={(v) => set("beforeAfterImages", v)}
        />

        <TextInput
          label="Ссылка на видео услуги"
          value={form.serviceVideo ?? ""}
          onChange={(e) => set("serviceVideo", e.target.value)}
          placeholder="https://www.youtube.com/watch?v=…"
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
          {mutation.isPending ? "Сохранение…" : "Сохранить услугу"}
        </button>
      </div>
    </form>
  );
};

// ── reusable list helpers ─────────────────────────────────────────────────────

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

const FaqList: React.FC<{
  values: { question: string; answer: string }[];
  onChange: (v: { question: string; answer: string }[]) => void;
}> = ({ values, onChange }) => {
  const update = (i: number, field: "question" | "answer", val: string) => {
    const next = values.map((item, idx) => (idx === i ? { ...item, [field]: val } : item));
    onChange(next);
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { question: "", answer: "" }]);

  return (
    <div className="space-y-4">
      {values.map((faq, i) => (
        <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Вопрос №{i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Удалить вопрос ${i + 1}`}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <input
            value={faq.question}
            onChange={(e) => update(i, "question", e.target.value)}
            placeholder="Вопрос"
            className="w-full bg-[#12161b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400"
          />
          <textarea
            value={faq.answer}
            onChange={(e) => update(i, "answer", e.target.value)}
            placeholder="Ответ"
            rows={2}
            className="w-full bg-[#12161b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 resize-y"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        <Plus size={14} />
        Добавить вопрос
      </button>
    </div>
  );
};

const BeforeAfterList: React.FC<{
  values: { before: string; after: string; description?: string; category?: BeforeAfterCategory }[];
  onChange: (v: { before: string; after: string; description?: string; category?: BeforeAfterCategory }[]) => void;
}> = ({ values, onChange }) => {
  const update = (
    i: number,
    field: "before" | "after" | "description" | "category",
    val: string,
  ) => {
    onChange(values.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { before: "", after: "", description: "", category: undefined }]);

  return (
    <div className="space-y-4">
      <p className="text-xs text-gray-500">
        Категория определяет, под какой вкладкой этот случай появится в галерее «До и после» на
        главной — в формулировках, которые сам пациент узнаёт про себя, не по прайс-листу.
      </p>
      {values.map((pair, i) => (
        <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Пара №{i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              aria-label={`Удалить пару до/после ${i + 1}`}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ImageUploader label="До" value={pair.before} onChange={(url) => update(i, "before", url)} />
            <ImageUploader label="После" value={pair.after} onChange={(url) => update(i, "after", url)} />
          </div>
          <select
            value={pair.category ?? ""}
            onChange={(e) => update(i, "category", e.target.value)}
            className="w-full bg-[#12161b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-400"
          >
            <option value="">Без категории (не появится в галерее на главной)</option>
            {BEFORE_AFTER_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            value={pair.description ?? ""}
            onChange={(e) => update(i, "description", e.target.value)}
            placeholder="Подпись (необязательно)"
            className="w-full bg-[#12161b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={add}
        className="inline-flex items-center gap-1.5 text-sm text-blue-400 hover:text-blue-300 transition-colors"
      >
        <Plus size={14} />
        Добавить пару
      </button>
    </div>
  );
};

export default ServiceFormPage;
