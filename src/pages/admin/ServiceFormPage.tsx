import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getService, getCategories, createService, updateService } from '@/api/services';
import type { PriceItem } from '@/types/serviceData';
import ImageUploader from '@/components/admin/ImageUploader';
import MarkdownEditor from '@/components/admin/MarkdownEditor';
import { Plus, Trash2, ArrowLeft, Save } from 'lucide-react';

// ── helpers ──────────────────────────────────────────────────────────────────

const EMPTY: Partial<PriceItem> & { id: string; name: string; price: number; category: string } = {
  id: '',
  name: '',
  price: 0,
  category: '',
  categories: [],
  description: '',
  detailedDescription: '',
  duration: '',
  heroImage: '',
  backgroundPosition: '',
  popular: false,
  isSpecialOffer: false,
  includesConsultation: false,
  requiresConsultation: false,
  benefits: [],
  process: [],
  suitableFor: [],
  faqs: [],
  beforeAfterImages: [],
  serviceVideo: '',
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
        checked ? 'bg-blue-500' : 'bg-white/10 group-hover:bg-white/15'
      }`}
    >
      <span
        className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
          checked ? 'translate-x-5' : 'translate-x-1'
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

const ServiceFormPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId: string }>();
  const isEditing = !!serviceId && serviceId !== 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();

  const [form, setForm] = useState<typeof EMPTY>({ ...EMPTY });
  const [saveError, setSaveError] = useState<string | null>(null);

  // Load existing service
  const { data: existing, isLoading: loadingService } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => getService(serviceId!),
    enabled: isEditing,
  });

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
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
      ? (data: typeof form) => updateService(serviceId!, data as Partial<PriceItem>)
      : (data: typeof form) => createService(data as PriceItem),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['services'] });
      qc.invalidateQueries({ queryKey: ['service', serviceId] });
      navigate('/admin/services');
    },
    onError: (e: any) => setSaveError(e.message ?? 'Save failed'),
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
            onClick={() => navigate('/admin/services')}
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {isEditing ? 'Edit service' : 'New service'}
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
          {mutation.isPending ? 'Saving…' : 'Save'}
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
        <SectionTitle>Core</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextInput
            label="ID"
            required
            value={form.id}
            onChange={(e) => set('id', e.target.value)}
            placeholder="e.g. hygiene-regular"
            disabled={isEditing}
          />
          <TextInput
            label="Name"
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Service name"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <Field label="Price (сум)" required>
            <input
              type="number"
              min={0}
              value={form.price}
              onChange={(e) => set('price', Number(e.target.value))}
              className="w-full bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
            />
          </Field>

          <Field label="Primary category" required>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="w-full bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </Field>

          <TextInput
            label="Duration"
            value={form.duration ?? ''}
            onChange={(e) => set('duration', e.target.value)}
            placeholder="e.g. 60 мин"
          />
        </div>

        {/* Additional categories */}
        <Field label="Additional categories (multi-select)">
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const checked = form.categories?.includes(c.id) ?? false;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() =>
                    set(
                      'categories',
                      checked
                        ? (form.categories ?? []).filter((x) => x !== c.id)
                        : [...(form.categories ?? []), c.id]
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    checked
                      ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-white/5 text-gray-400 border border-white/10 hover:border-white/20'
                  }`}
                >
                  {c.title}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Short description">
          <textarea
            value={form.description ?? ''}
            onChange={(e) => set('description', e.target.value)}
            rows={2}
            className="w-full bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors resize-y"
            placeholder="One-line description shown in the list"
          />
        </Field>

        <Field label="Sort order">
          <input
            type="number"
            value={form.sortOrder ?? 0}
            onChange={(e) => set('sortOrder', Number(e.target.value))}
            className="w-32 bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
          />
        </Field>

        {/* ── Flags ── */}
        <SectionTitle>Flags</SectionTitle>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Toggle label="Popular" description="Show in 'Popular services' carousel" checked={!!form.popular} onChange={(v) => set('popular', v)} />
          <Toggle label="Special offer" description="Animated border, offer badge" checked={!!form.isSpecialOffer} onChange={(v) => set('isSpecialOffer', v)} />
          <Toggle label="Includes consultation" description="No separate consultation needed" checked={!!form.includesConsultation} onChange={(v) => set('includesConsultation', v)} />
          <Toggle label="Requires consultation" description="Must book consultation first" checked={!!form.requiresConsultation} onChange={(v) => set('requiresConsultation', v)} />
        </div>

        {/* ── Images ── */}
        <SectionTitle>Hero image</SectionTitle>
        <ImageUploader
          label="Hero image"
          value={form.heroImage ?? ''}
          onChange={(url) => set('heroImage', url)}
        />
        <TextInput
          label="Background position (CSS)"
          value={form.backgroundPosition ?? ''}
          onChange={(e) => set('backgroundPosition', e.target.value)}
          placeholder="e.g. 50% 35%"
        />

        {/* ── Detailed description ── */}
        <SectionTitle>Detailed description (Markdown)</SectionTitle>
        <MarkdownEditor
          value={form.detailedDescription ?? ''}
          onChange={(v) => set('detailedDescription', v)}
          rows={22}
        />

        {/* ── Benefits ── */}
        <SectionTitle>Benefits</SectionTitle>
        <StringList
          values={form.benefits ?? []}
          onChange={(v) => set('benefits', v)}
          placeholder="Add a benefit…"
        />

        {/* ── FAQ ── */}
        <SectionTitle>FAQs</SectionTitle>
        <FaqList
          values={form.faqs ?? []}
          onChange={(v) => set('faqs', v)}
        />

        {/* ── Gallery & video ── */}
        <SectionTitle>Gallery images</SectionTitle>
        <StringList
          values={form.galleryImages ?? []}
          onChange={(v) => set('galleryImages', v)}
          placeholder="/images/photo.jpg"
          renderItem={(url, onItemChange) => (
            <div className="flex items-center gap-2">
              {url && (
                <img src={url} alt="" className="h-10 w-14 object-cover rounded-lg border border-white/10 flex-shrink-0" />
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

        <SectionTitle>Before / After images</SectionTitle>
        <BeforeAfterList
          values={form.beforeAfterImages ?? []}
          onChange={(v) => set('beforeAfterImages', v)}
        />

        <TextInput
          label="Service video URL"
          value={form.serviceVideo ?? ''}
          onChange={(e) => set('serviceVideo', e.target.value)}
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
          {mutation.isPending ? 'Saving…' : 'Save service'}
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
  const add = () => onChange([...values, '']);

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
        Add
      </button>
    </div>
  );
};

const FaqList: React.FC<{
  values: { question: string; answer: string }[];
  onChange: (v: { question: string; answer: string }[]) => void;
}> = ({ values, onChange }) => {
  const update = (i: number, field: 'question' | 'answer', val: string) => {
    const next = values.map((item, idx) => (idx === i ? { ...item, [field]: val } : item));
    onChange(next);
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { question: '', answer: '' }]);

  return (
    <div className="space-y-4">
      {values.map((faq, i) => (
        <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">FAQ #{i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <input
            value={faq.question}
            onChange={(e) => update(i, 'question', e.target.value)}
            placeholder="Question"
            className="w-full bg-[#12161b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400"
          />
          <textarea
            value={faq.answer}
            onChange={(e) => update(i, 'answer', e.target.value)}
            placeholder="Answer"
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
        Add FAQ
      </button>
    </div>
  );
};

const BeforeAfterList: React.FC<{
  values: { before: string; after: string; description?: string }[];
  onChange: (v: { before: string; after: string; description?: string }[]) => void;
}> = ({ values, onChange }) => {
  const update = (i: number, field: 'before' | 'after' | 'description', val: string) => {
    onChange(values.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));
  };
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i));
  const add = () => onChange([...values, { before: '', after: '', description: '' }]);

  return (
    <div className="space-y-4">
      {values.map((pair, i) => (
        <div key={i} className="bg-white/3 border border-white/8 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500 font-medium">Pair #{i + 1}</span>
            <button
              type="button"
              onClick={() => remove(i)}
              className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <ImageUploader label="Before" value={pair.before} onChange={(url) => update(i, 'before', url)} />
            <ImageUploader label="After" value={pair.after} onChange={(url) => update(i, 'after', url)} />
          </div>
          <input
            value={pair.description ?? ''}
            onChange={(e) => update(i, 'description', e.target.value)}
            placeholder="Optional caption"
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
        Add pair
      </button>
    </div>
  );
};

export default ServiceFormPage;
