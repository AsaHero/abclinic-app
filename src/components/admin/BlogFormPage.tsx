"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogPostAction, createBlogPostAction, updateBlogPostAction } from "@/lib/blog/actions";
import type { BlogPost } from "@/types/blog";
import { BLOG_CATEGORIES } from "@/types/blog";
import ImageUploader from "@/components/admin/ImageUploader";
import MarkdownEditor from "@/components/admin/MarkdownEditor";
import { ArrowLeft, Save } from "lucide-react";

// ── helpers (mirrors TeamFormPage.tsx) ────────────────────────────────────

const EMPTY: BlogPost = {
  id: "",
  title: "",
  excerpt: "",
  content: "",
  coverImage: "",
  category: BLOG_CATEGORIES[0],
  published: false,
  publishedAt: "",
};

const Field: React.FC<{ label: string; required?: boolean; children: React.ReactNode }> = ({
  label,
  required,
  children,
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

// ── main component ──────────────────────────────────────────────────────

interface BlogFormPageProps {
  postId?: string;
}

const BlogFormPage: React.FC<BlogFormPageProps> = ({ postId }) => {
  const isEditing = !!postId;
  const router = useRouter();
  const qc = useQueryClient();

  const [form, setForm] = useState<BlogPost>({ ...EMPTY });
  const [saveError, setSaveError] = useState<string | null>(null);

  const { data: existing, isLoading: loadingPost } = useQuery({
    queryKey: ["blog-post", postId],
    queryFn: () => getBlogPostAction(postId!),
    enabled: isEditing,
  });

  useEffect(() => {
    if (existing) {
      setForm({ ...EMPTY, ...existing });
    }
  }, [existing]);

  const mutation = useMutation({
    mutationFn: isEditing
      ? (data: BlogPost) => updateBlogPostAction(postId!, data)
      : (data: BlogPost) => createBlogPostAction(data),
    onSuccess: (result) => {
      if (!result.success) {
        setSaveError(result.error);
        return;
      }
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
      qc.invalidateQueries({ queryKey: ["blog-post", postId] });
      router.push("/admin/blog");
    },
    onError: (e: any) => setSaveError(e.message ?? "Не удалось сохранить"),
  });

  const set = <K extends keyof BlogPost>(key: K, value: BlogPost[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError(null);
    mutation.mutate(form);
  };

  if (isEditing && loadingPost) {
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
            onClick={() => router.push("/admin/blog")}
            aria-label="Назад к блогу"
            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-semibold text-white">{isEditing ? "Редактировать статью" : "Новая статья"}</h1>
            {isEditing && <p className="text-xs text-gray-500 mt-0.5">{postId}</p>}
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

      <div className="bg-[#1a1e25] border border-white/8 rounded-2xl p-6 space-y-6">
        <SectionTitle>Основное</SectionTitle>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TextInput
            label="ID (адрес страницы)"
            required
            value={form.id}
            onChange={(e) => set("id", e.target.value)}
            placeholder="напр. kak-chasto-nuzhno-chistit-zuby"
            disabled={isEditing}
          />
          <Field label="Категория">
            <select
              value={form.category ?? ""}
              onChange={(e) => set("category", e.target.value)}
              className="w-full bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400 transition-colors"
            >
              {BLOG_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <TextInput
          label="Заголовок"
          required
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Заголовок статьи"
        />

        <Field label="Краткое описание (для карточки)">
          <textarea
            value={form.excerpt ?? ""}
            onChange={(e) => set("excerpt", e.target.value)}
            rows={2}
            className="w-full bg-[#12161b] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors resize-y"
            placeholder="Короткое описание для карточки статьи"
          />
        </Field>

        <div className="flex items-center gap-3 pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.published}
              onChange={(e) => set("published", e.target.checked)}
              className="size-4 rounded border-white/20 bg-[#12161b] accent-blue-500"
            />
            <span className="text-sm text-gray-300">Опубликовано</span>
          </label>
          {!form.published && (
            <span className="text-xs text-gray-500">Черновик не виден на публичном сайте</span>
          )}
        </div>

        {/* Cover image */}
        <SectionTitle>Обложка</SectionTitle>
        <ImageUploader label="Обложка" value={form.coverImage ?? ""} onChange={(url) => set("coverImage", url)} />

        {/* Content */}
        <SectionTitle>Содержание (Markdown)</SectionTitle>
        <MarkdownEditor value={form.content ?? ""} onChange={(v) => set("content", v)} rows={20} />
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-medium px-6 py-3 rounded-xl transition-colors"
        >
          <Save size={16} />
          {mutation.isPending ? "Сохранение…" : "Сохранить статью"}
        </button>
      </div>
    </form>
  );
};

export default BlogFormPage;
