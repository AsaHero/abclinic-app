"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBlogPostsAction, deleteBlogPostAction } from "@/lib/blog/actions";
import { Plus, Search, Pencil, Trash2, ExternalLink, FileText } from "lucide-react";

const BlogListPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: () => getBlogPostsAction(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteBlogPostAction(id),
    onSuccess: (result) => {
      if (!result.success) {
        setDeleteError(result.error);
        return;
      }
      qc.invalidateQueries({ queryKey: ["blog-posts"] });
      setConfirmDelete(null);
      setDeleteError(null);
    },
  });

  const filtered = posts.filter((p) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || (p.category ?? "").toLowerCase().includes(q);
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Блог</h1>
          <p className="text-gray-500 text-sm mt-0.5">Всего: {posts.length}</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={18} />
          Добавить статью
        </Link>
      </div>

      {/* Filters */}
      <div className="relative flex-1">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск статей…"
          className="w-full bg-[#1a1e25] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
        />
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400" />
        </div>
      ) : (
        <div className="bg-[#1a1e25] border border-white/8 rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/8 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span>Обложка</span>
            <span>Заголовок / категория</span>
            <span>Статус</span>
            <span>Дата</span>
            <span>Действия</span>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-500 text-sm">Статьи не найдены</div>
          ) : (
            filtered.map((post, i) => (
              <div
                key={post.id}
                className={`grid grid-cols-[auto_1fr_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-white/3 transition-colors ${
                  i !== 0 ? "border-t border-white/5" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center flex-shrink-0">
                  {post.coverImage ? (
                    <img src={post.coverImage} alt={post.title} className="w-full h-full object-cover" />
                  ) : (
                    <FileText size={16} className="text-gray-600" />
                  )}
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{post.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{post.category || "Без категории"}</p>
                </div>

                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                    post.published ? "bg-green-500/15 text-green-400" : "bg-white/5 text-gray-400"
                  }`}
                >
                  {post.published ? "Опубликовано" : "Черновик"}
                </span>

                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {post.publishedAt ? new Date(post.publishedAt).toLocaleDateString("ru-RU") : "—"}
                </span>

                <div className="flex items-center gap-1">
                  {post.published && (
                    <a
                      href={`/blog/${post.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                      title="Смотреть на сайте"
                    >
                      <ExternalLink size={15} />
                    </a>
                  )}
                  <Link
                    href={`/admin/blog/${post.id}/edit`}
                    className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => {
                      setConfirmDelete(post.id);
                      setDeleteError(null);
                    }}
                    className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    title="Удалить"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1a1e25] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Удалить статью?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Действие необратимо. Статья будет удалена без возможности восстановления.
            </p>
            {deleteError && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
                {deleteError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setConfirmDelete(null);
                  setDeleteError(null);
                }}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmDelete)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {deleteMutation.isPending ? "Удаление…" : "Удалить"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogListPage;
