"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getServicesAction, getCategoriesAction, deleteServiceAction } from "@/lib/services/actions";
import { Plus, Search, Pencil, Trash2, Star, Sparkles, ExternalLink } from "lucide-react";

const ServicesListPage: React.FC = () => {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services"],
    queryFn: () => getServicesAction(),
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: () => getCategoriesAction(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteServiceAction(id),
    onSuccess: (result) => {
      if (!result.success) {
        setDeleteError(result.error);
        return;
      }
      qc.invalidateQueries({ queryKey: ["services"] });
      setConfirmDelete(null);
      setDeleteError(null);
    },
  });

  const filtered = services.filter((s) => {
    const matchCat = filterCategory === "all" || s.category === filterCategory || s.categories?.includes(filterCategory);
    const matchSearch =
      !search.trim() ||
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.description?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Услуги</h1>
          <p className="text-gray-500 text-sm mt-0.5">Всего: {services.length}</p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={18} />
          Добавить услугу
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск услуг…"
            className="w-full bg-[#1a1e25] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-400"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="bg-[#1a1e25] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-400"
        >
          <option value="all">Все категории</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.title}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400" />
        </div>
      ) : (
        <div className="bg-[#1a1e25] border border-white/8 rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_auto_auto_auto] gap-4 px-5 py-3 border-b border-white/8 text-xs font-medium text-gray-500 uppercase tracking-wider">
            <span>Название</span>
            <span className="text-right">Цена</span>
            <span>Метки</span>
            <span>Действия</span>
          </div>

          {filtered.length === 0 ? (
            <div className="px-5 py-10 text-center text-gray-500 text-sm">Услуги не найдены</div>
          ) : (
            filtered.map((svc, i) => (
              <div
                key={svc.id}
                className={`grid grid-cols-[1fr_auto_auto_auto] gap-4 items-center px-5 py-4 hover:bg-white/3 transition-colors ${
                  i !== 0 ? "border-t border-white/5" : ""
                }`}
              >
                {/* Name + meta */}
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{svc.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {categories.find((c) => c.id === svc.category)?.title ?? svc.category}
                    {svc.duration && ` · ${svc.duration}`}
                  </p>
                </div>

                {/* Price */}
                <span className="text-sm text-gray-300 text-right whitespace-nowrap">
                  {svc.price.toLocaleString("ru-RU")} сум
                </span>

                {/* Flags */}
                <div className="flex items-center gap-1.5">
                  {svc.popular && (
                    <span title="Популярно" className="p-1 bg-blue-500/15 rounded-lg">
                      <Star size={13} className="text-blue-400" />
                    </span>
                  )}
                  {svc.isSpecialOffer && (
                    <span title="Спецпредложение" className="p-1 bg-pink-500/15 rounded-lg">
                      <Sparkles size={13} className="text-pink-400" />
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <a
                    href={`/services/${svc.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-500 hover:text-gray-300 hover:bg-white/5 rounded-lg transition-colors"
                    title="Смотреть на сайте"
                  >
                    <ExternalLink size={15} />
                  </a>
                  <Link
                    href={`/admin/services/${svc.id}/edit`}
                    className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                    title="Редактировать"
                  >
                    <Pencil size={15} />
                  </Link>
                  <button
                    onClick={() => { setConfirmDelete(svc.id); setDeleteError(null); }}
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
            <h3 className="text-lg font-semibold text-white mb-2">Удалить услугу?</h3>
            <p className="text-gray-400 text-sm mb-4">
              Действие необратимо. Услуга будет удалена без возможности восстановления.
            </p>
            {deleteError && (
              <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 mb-4">
                {deleteError}
              </p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setConfirmDelete(null); setDeleteError(null); }}
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

export default ServicesListPage;
