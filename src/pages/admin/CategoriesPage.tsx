import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getCategories, createCategory, updateCategory, deleteCategory } from '@/api/services';
import type { ServiceCategory } from '@/types/serviceData';
import { Plus, Pencil, Trash2, Check, X } from 'lucide-react';

const EMPTY_FORM = { id: '', title: '', description: '', requiresConsultation: false, sortOrder: 0 };

const CategoriesPage: React.FC = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<string | null>(null); // category id being edited
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { data: categories = [], isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => createCategory(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      setAdding(false);
      setForm({ ...EMPTY_FORM });
      setError(null);
    },
    onError: (e: any) => setError(e.message ?? 'Failed to create'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<ServiceCategory> }) =>
      updateCategory(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      setEditing(null);
      setError(null);
    },
    onError: (e: any) => setError(e.message ?? 'Failed to update'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
      setConfirmDelete(null);
    },
  });

  const startEdit = (cat: ServiceCategory) => {
    setEditing(cat.id);
    setAdding(false);
    setForm({
      id: cat.id,
      title: cat.title,
      description: cat.description ?? '',
      requiresConsultation: cat.requiresConsultation ?? false,
      sortOrder: cat.sortOrder ?? 0,
    });
    setError(null);
  };

  const cancelEdit = () => {
    setEditing(null);
    setAdding(false);
    setForm({ ...EMPTY_FORM });
    setError(null);
  };

  const handleSave = () => {
    if (!form.title.trim()) { setError('Title is required'); return; }
    if (adding) {
      if (!form.id.trim()) { setError('ID is required'); return; }
      createMutation.mutate(form);
    } else if (editing) {
      updateMutation.mutate({ id: editing, data: form });
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-white">Categories</h1>
          <p className="text-gray-500 text-sm mt-0.5">{categories.length} total</p>
        </div>
        {!adding && !editing && (
          <button
            onClick={() => { setAdding(true); setEditing(null); setForm({ ...EMPTY_FORM }); setError(null); }}
            className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2.5 rounded-xl transition-colors"
          >
            <Plus size={18} />
            Add category
          </button>
        )}
      </div>

      {/* Inline add form */}
      {adding && (
        <CategoryForm
          form={form}
          setForm={setForm}
          isNew
          onSave={handleSave}
          onCancel={cancelEdit}
          isPending={isPending}
          error={error}
        />
      )}

      {/* List */}
      {isLoading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-400" />
        </div>
      ) : (
        <div className="bg-[#1a1e25] border border-white/8 rounded-2xl overflow-hidden">
          {categories.length === 0 && (
            <p className="text-center text-gray-500 text-sm py-10">No categories yet</p>
          )}
          {categories.map((cat, i) => (
            <div key={cat.id}>
              {i !== 0 && <div className="border-t border-white/5" />}

              {editing === cat.id ? (
                <div className="p-5">
                  <CategoryForm
                    form={form}
                    setForm={setForm}
                    isNew={false}
                    onSave={handleSave}
                    onCancel={cancelEdit}
                    isPending={isPending}
                    error={error}
                  />
                </div>
              ) : (
                <div className="flex items-start justify-between gap-4 px-5 py-4 hover:bg-white/3 transition-colors">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-medium text-white">{cat.title}</p>
                      <span className="text-xs text-gray-600 font-mono">#{cat.id}</span>
                      {cat.requiresConsultation && (
                        <span className="text-xs bg-orange-500/15 text-orange-400 px-2 py-0.5 rounded-full">
                          Requires consultation
                        </span>
                      )}
                    </div>
                    {cat.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">{cat.description}</p>
                    )}
                    <p className="text-xs text-gray-600 mt-0.5">Sort order: {cat.sortOrder ?? 0}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => startEdit(cat)}
                      className="p-2 text-gray-500 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setConfirmDelete(cat.id)}
                      className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-[#1a1e25] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-white mb-2">Delete category?</h3>
            <p className="text-gray-400 text-sm mb-6">
              Services in this category will not be deleted, but may appear uncategorised.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(confirmDelete)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-medium transition-colors"
              >
                {deleteMutation.isPending ? 'Deleting…' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Inline form ───────────────────────────────────────────────────────────────

interface CategoryFormProps {
  form: typeof EMPTY_FORM;
  setForm: React.Dispatch<React.SetStateAction<typeof EMPTY_FORM>>;
  isNew: boolean;
  onSave: () => void;
  onCancel: () => void;
  isPending: boolean;
  error: string | null;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  form, setForm, isNew, onSave, onCancel, isPending, error,
}) => {
  const set = <K extends keyof typeof form>(k: K, v: typeof form[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const inputClass =
    'w-full bg-[#12161b] border border-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-blue-400 transition-colors';

  return (
    <div className="bg-white/3 border border-white/10 rounded-xl p-5 space-y-4">
      <p className="text-sm font-semibold text-white">{isNew ? 'New category' : 'Edit category'}</p>

      {error && (
        <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {isNew && (
          <div>
            <label className="block text-xs text-gray-400 mb-1">ID <span className="text-red-400">*</span></label>
            <input
              value={form.id}
              onChange={(e) => set('id', e.target.value)}
              placeholder="e.g. orthodontics"
              className={inputClass}
            />
          </div>
        )}
        <div className={isNew ? '' : 'sm:col-span-2'}>
          <label className="block text-xs text-gray-400 mb-1">Title <span className="text-red-400">*</span></label>
          <input
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            placeholder="Category name"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className="block text-xs text-gray-400 mb-1">Description</label>
        <textarea
          value={form.description}
          onChange={(e) => set('description', e.target.value)}
          rows={2}
          placeholder="Shown on the services page under the category banner"
          className={inputClass + ' resize-y'}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Sort order</label>
          <input
            type="number"
            value={form.sortOrder}
            onChange={(e) => set('sortOrder', Number(e.target.value))}
            className={inputClass}
          />
        </div>
        <label className="flex items-center gap-3 cursor-pointer mt-5">
          <div
            onClick={() => set('requiresConsultation', !form.requiresConsultation)}
            className={`relative w-10 h-6 rounded-full transition-colors flex-shrink-0 ${
              form.requiresConsultation ? 'bg-blue-500' : 'bg-white/10'
            }`}
          >
            <span
              className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                form.requiresConsultation ? 'translate-x-5' : 'translate-x-1'
              }`}
            />
          </div>
          <span className="text-sm text-gray-300">Requires consultation</span>
        </label>
      </div>

      <div className="flex gap-2 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-sm text-gray-300 transition-colors"
        >
          <X size={14} />
          Cancel
        </button>
        <button
          type="button"
          onClick={onSave}
          disabled={isPending}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-sm text-white font-medium transition-colors"
        >
          <Check size={14} />
          {isPending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
};

export default CategoriesPage;
