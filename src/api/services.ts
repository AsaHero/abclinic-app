import type { PriceItem, ServiceCategory } from '../types/serviceData';

const BASE = '/api';

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem('admin_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
  const res = await fetch(`${BASE}${path}`, { ...options, headers });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

// ── Services ──────────────────────────────────────────────────────────────────

export function getServices(categoryId?: string): Promise<PriceItem[]> {
  const qs = categoryId && categoryId !== 'all' ? `?category=${encodeURIComponent(categoryId)}` : '';
  return request<PriceItem[]>(`/services${qs}`);
}

export function getService(id: string): Promise<PriceItem> {
  return request<PriceItem>(`/services/${encodeURIComponent(id)}`);
}

export function createService(data: Omit<PriceItem, 'createdAt' | 'updatedAt'>): Promise<PriceItem> {
  return request<PriceItem>('/services', { method: 'POST', body: JSON.stringify(data) });
}

export function updateService(id: string, data: Partial<PriceItem>): Promise<PriceItem> {
  return request<PriceItem>(`/services/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteService(id: string): Promise<void> {
  return request<void>(`/services/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// ── Categories ────────────────────────────────────────────────────────────────

export function getCategories(): Promise<ServiceCategory[]> {
  return request<ServiceCategory[]>('/categories');
}

export function getCategory(id: string): Promise<ServiceCategory> {
  return request<ServiceCategory>(`/categories/${encodeURIComponent(id)}`);
}

export function createCategory(data: Omit<ServiceCategory, 'sortOrder'>): Promise<ServiceCategory> {
  return request<ServiceCategory>('/categories', { method: 'POST', body: JSON.stringify(data) });
}

export function updateCategory(id: string, data: Partial<ServiceCategory>): Promise<ServiceCategory> {
  return request<ServiceCategory>(`/categories/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id: string): Promise<void> {
  return request<void>(`/categories/${encodeURIComponent(id)}`, { method: 'DELETE' });
}

// ── Upload ────────────────────────────────────────────────────────────────────

export async function uploadFile(file: File): Promise<{ url: string }> {
  const token = localStorage.getItem('admin_token');
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json();
}

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function login(password: string): Promise<{ token: string }> {
  return request<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ password }),
  });
}
