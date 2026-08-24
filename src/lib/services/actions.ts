"use server";

import db from "@/lib/db";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getServices, getService, getCategories, getCategory } from "./queries";
import type { PriceItem, ServiceCategory } from "@/types/serviceData";

// Thin read wrappers so admin client components can call these the same way
// they call the mutations below — TanStack Query's queryFn can invoke a
// Server Action directly, no separate HTTP/fetch layer needed. Public pages
// should keep calling queries.ts directly from Server Components instead —
// these wrappers exist only so the admin panel's existing useQuery pattern
// ports over with a minimal diff.
export async function getServicesAction(categoryId?: string) {
  // includeInternal: admin must see isPublic=0 (staff-only) services too.
  return getServices(categoryId, true);
}

export async function getServiceAction(id: string) {
  return getService(id, true);
}

export async function getCategoriesAction() {
  return getCategories();
}

export async function getCategoryAction(id: string) {
  return getCategory(id);
}

const JSON_FIELDS = [
  "categories",
  "benefits",
  "process",
  "suitableFor",
  "faqs",
  "beforeAfterImages",
  "galleryImages",
] as const;

function serializeService(svc: Partial<PriceItem>) {
  const row: Record<string, unknown> = { ...svc };
  for (const key of JSON_FIELDS) {
    if (key in row) {
      const val = row[key];
      row[key] = Array.isArray(val) && val.length > 0 ? JSON.stringify(val) : null;
    }
  }
  row.popular = svc.popular ? 1 : 0;
  row.isSpecialOffer = svc.isSpecialOffer ? 1 : 0;
  row.includesConsultation = svc.includesConsultation ? 1 : 0;
  row.requiresConsultation = svc.requiresConsultation ? 1 : 0;
  row.isPublic = svc.isPublic === false ? 0 : 1;
  return row;
}

export type ActionResult = { success: true } | { success: false; error: string };

export async function createServiceAction(data: PriceItem): Promise<ActionResult> {
  await requireAdmin();

  if (!data.id?.trim() || !data.name?.trim() || !data.category?.trim()) {
    return { success: false, error: "id, name и category обязательны" };
  }
  if (getService(data.id, true)) {
    return { success: false, error: `Услуга с id "${data.id}" уже существует` };
  }

  const row = serializeService(data);
  db.prepare(
    `INSERT INTO services (
      id, name, price, category, categories, description, detailedDescription,
      duration, heroImage, backgroundPosition, popular, isSpecialOffer,
      includesConsultation, requiresConsultation, isPublic, benefits, process,
      suitableFor, faqs, beforeAfterImages, serviceVideo, galleryImages, sortOrder
    ) VALUES (
      @id, @name, @price, @category, @categories, @description, @detailedDescription,
      @duration, @heroImage, @backgroundPosition, @popular, @isSpecialOffer,
      @includesConsultation, @requiresConsultation, @isPublic, @benefits, @process,
      @suitableFor, @faqs, @beforeAfterImages, @serviceVideo, @galleryImages, @sortOrder
    )`,
  ).run({
    id: row.id,
    name: row.name,
    price: row.price ?? 0,
    category: row.category,
    categories: row.categories ?? null,
    description: row.description ?? null,
    detailedDescription: row.detailedDescription ?? null,
    duration: row.duration ?? null,
    heroImage: row.heroImage ?? null,
    backgroundPosition: row.backgroundPosition ?? null,
    popular: row.popular,
    isSpecialOffer: row.isSpecialOffer,
    includesConsultation: row.includesConsultation,
    requiresConsultation: row.requiresConsultation,
    isPublic: row.isPublic,
    benefits: row.benefits ?? null,
    process: row.process ?? null,
    suitableFor: row.suitableFor ?? null,
    faqs: row.faqs ?? null,
    beforeAfterImages: row.beforeAfterImages ?? null,
    serviceVideo: row.serviceVideo ?? null,
    galleryImages: row.galleryImages ?? null,
    sortOrder: row.sortOrder ?? 0,
  });

  return { success: true };
}

export async function updateServiceAction(id: string, data: Partial<PriceItem>): Promise<ActionResult> {
  await requireAdmin();

  const existing = getService(id, true);
  if (!existing) {
    return { success: false, error: "Услуга не найдена" };
  }

  const merged = serializeService({ ...existing, ...data, id });
  db.prepare(
    `UPDATE services SET
      name = @name, price = @price, category = @category, categories = @categories,
      description = @description, detailedDescription = @detailedDescription,
      duration = @duration, heroImage = @heroImage, backgroundPosition = @backgroundPosition,
      popular = @popular, isSpecialOffer = @isSpecialOffer,
      includesConsultation = @includesConsultation, requiresConsultation = @requiresConsultation,
      isPublic = @isPublic,
      benefits = @benefits, process = @process, suitableFor = @suitableFor,
      faqs = @faqs, beforeAfterImages = @beforeAfterImages, serviceVideo = @serviceVideo,
      galleryImages = @galleryImages, sortOrder = @sortOrder,
      updatedAt = datetime('now')
    WHERE id = @id`,
  ).run({
    id,
    name: merged.name,
    price: merged.price ?? 0,
    category: merged.category,
    categories: merged.categories ?? null,
    description: merged.description ?? null,
    detailedDescription: merged.detailedDescription ?? null,
    duration: merged.duration ?? null,
    heroImage: merged.heroImage ?? null,
    backgroundPosition: merged.backgroundPosition ?? null,
    popular: merged.popular,
    isSpecialOffer: merged.isSpecialOffer,
    includesConsultation: merged.includesConsultation,
    requiresConsultation: merged.requiresConsultation,
    isPublic: merged.isPublic,
    benefits: merged.benefits ?? null,
    process: merged.process ?? null,
    suitableFor: merged.suitableFor ?? null,
    faqs: merged.faqs ?? null,
    beforeAfterImages: merged.beforeAfterImages ?? null,
    serviceVideo: merged.serviceVideo ?? null,
    galleryImages: merged.galleryImages ?? null,
    sortOrder: merged.sortOrder ?? 0,
  });

  return { success: true };
}

export async function deleteServiceAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const result = db.prepare("DELETE FROM services WHERE id = ?").run(id);
  if (result.changes === 0) {
    return { success: false, error: "Услуга не найдена" };
  }
  return { success: true };
}

export async function createCategoryAction(data: ServiceCategory): Promise<ActionResult> {
  await requireAdmin();

  if (!data.id?.trim() || !data.title?.trim()) {
    return { success: false, error: "id и title обязательны" };
  }
  if (getCategory(data.id)) {
    return { success: false, error: `Категория с id "${data.id}" уже существует` };
  }

  db.prepare(
    `INSERT INTO categories (id, title, description, requiresConsultation, sortOrder)
     VALUES (@id, @title, @description, @requiresConsultation, @sortOrder)`,
  ).run({
    id: data.id,
    title: data.title,
    description: data.description ?? null,
    requiresConsultation: data.requiresConsultation ? 1 : 0,
    sortOrder: data.sortOrder ?? 0,
  });

  return { success: true };
}

export async function updateCategoryAction(
  id: string,
  data: Partial<ServiceCategory>,
): Promise<ActionResult> {
  await requireAdmin();

  const existing = getCategory(id);
  if (!existing) {
    return { success: false, error: "Категория не найдена" };
  }

  db.prepare(
    `UPDATE categories SET
      title = @title, description = @description,
      requiresConsultation = @requiresConsultation, sortOrder = @sortOrder
    WHERE id = @id`,
  ).run({
    id,
    title: data.title ?? existing.title,
    description: data.description ?? existing.description ?? null,
    requiresConsultation: (data.requiresConsultation ?? existing.requiresConsultation) ? 1 : 0,
    sortOrder: data.sortOrder ?? existing.sortOrder ?? 0,
  });

  return { success: true };
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  await requireAdmin();

  const result = db.prepare("DELETE FROM categories WHERE id = ?").run(id);
  if (result.changes === 0) {
    return { success: false, error: "Категория не найдена" };
  }
  return { success: true };
}
