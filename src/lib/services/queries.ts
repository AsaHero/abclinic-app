import "server-only";
import db from "@/lib/db";
import type { PriceItem, ServiceCategory, ServiceGroup, BeforeAfterCategory } from "@/types/serviceData";

const JSON_COLS = [
  "categories",
  "benefits",
  "process",
  "suitableFor",
  "faqs",
  "beforeAfterImages",
  "galleryImages",
] as const;

// SQLite row shape before boolean/JSON coercion
type ServiceRow = Record<string, unknown>;

function parseServiceRow(row: ServiceRow | undefined): PriceItem | null {
  if (!row) return null;
  const parsed: ServiceRow = { ...row };
  for (const col of JSON_COLS) {
    if (parsed[col]) {
      try {
        parsed[col] = JSON.parse(parsed[col] as string);
      } catch {
        // leave as string
      }
    }
  }
  parsed.popular = Boolean(parsed.popular);
  parsed.isSpecialOffer = Boolean(parsed.isSpecialOffer);
  parsed.includesConsultation = Boolean(parsed.includesConsultation);
  parsed.requiresConsultation = Boolean(parsed.requiresConsultation);
  parsed.isPublic = parsed.isPublic === undefined || parsed.isPublic === null ? true : Boolean(parsed.isPublic);
  return parsed as unknown as PriceItem;
}

function parseCategoryRow(row: ServiceRow | undefined): ServiceCategory | null {
  if (!row) return null;
  return {
    ...(row as unknown as ServiceCategory),
    requiresConsultation: Boolean(row.requiresConsultation),
  };
}

// includeInternal: pass true only from admin code paths — every public page
// must go through the default (false) so isPublic=0 services (e.g. staff-only
// loyalty pricing) never surface in public listings, search, sitemap, or by
// guessing the URL.
export function getServices(categoryId?: string, includeInternal = false): PriceItem[] {
  const visibility = includeInternal ? "" : "AND isPublic = 1";
  let rows: ServiceRow[];
  if (categoryId && categoryId !== "all") {
    rows = db
      .prepare(
        `SELECT * FROM services
         WHERE (category = ? OR (categories IS NOT NULL AND categories LIKE ?)) ${visibility}
         ORDER BY sortOrder, name`,
      )
      .all(categoryId, `%"${categoryId}"%`) as ServiceRow[];
  } else {
    rows = db.prepare(`SELECT * FROM services WHERE 1=1 ${visibility} ORDER BY sortOrder, name`).all() as ServiceRow[];
  }
  return rows.map((row) => parseServiceRow(row)!);
}

export function getService(id: string, includeInternal = false): PriceItem | null {
  const visibility = includeInternal ? "" : "AND isPublic = 1";
  const row = db.prepare(`SELECT * FROM services WHERE id = ? ${visibility}`).get(id) as ServiceRow | undefined;
  return parseServiceRow(row);
}

export function getCategories(): ServiceCategory[] {
  const rows = db.prepare("SELECT * FROM categories ORDER BY sortOrder, title").all() as ServiceRow[];
  return rows.map((row) => parseCategoryRow(row)!);
}

export function getCategory(id: string): ServiceCategory | null {
  const row = db.prepare("SELECT * FROM categories WHERE id = ?").get(id) as ServiceRow | undefined;
  return parseCategoryRow(row);
}

// Groups tiers of the same treatment (e.g. one material choice vs another)
// into a single comparison card instead of separate price-list rows. Resolves
// each group's serviceIds into full service objects so callers don't have to.
export function getServiceGroups(): ServiceGroup[] {
  const rows = db.prepare("SELECT * FROM serviceGroups ORDER BY sortOrder, title").all() as ServiceRow[];
  return rows
    .map((row): ServiceGroup | null => {
      let serviceIds: string[];
      try {
        serviceIds = JSON.parse(row.serviceIds as string);
      } catch {
        return null;
      }
      const services = serviceIds.map((id) => getService(id)).filter((s): s is PriceItem => s !== null);
      if (services.length === 0) return null;
      return {
        id: row.id as string,
        title: row.title as string,
        tagline: (row.tagline as string) ?? undefined,
        category: row.category as string,
        services,
        recommendedServiceId: (row.recommendedServiceId as string) ?? undefined,
      };
    })
    .filter((g): g is ServiceGroup => g !== null);
}

export interface BeforeAfterCase {
  serviceId: string;
  serviceName: string;
  before: string;
  after: string;
  description?: string;
  category?: BeforeAfterCategory;
}

// Flattens every service's beforeAfterImages into one list for the
// homepage carousel — real case photos live per-service (added via the
// admin panel), this just aggregates whatever exists rather than
// maintaining a separate hardcoded list.
export function getBeforeAfterCases(): BeforeAfterCase[] {
  const rows = db
    .prepare("SELECT id, name, beforeAfterImages FROM services WHERE beforeAfterImages IS NOT NULL AND beforeAfterImages != ''")
    .all() as { id: string; name: string; beforeAfterImages: string }[];

  const cases: BeforeAfterCase[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    let images: { before: string; after: string; description?: string; category?: BeforeAfterCategory }[];
    try {
      images = JSON.parse(row.beforeAfterImages);
    } catch {
      continue;
    }
    for (const image of images) {
      if (!image.before || !image.after || !image.category) continue;
      // The same case photos sometimes get attached to more than one
      // service — dedupe by the actual image pair so the carousel
      // doesn't repeat one case under two different service labels.
      const key = `${image.before}|${image.after}`;
      if (seen.has(key)) continue;
      seen.add(key);
      cases.push({ serviceId: row.id, serviceName: row.name, ...image });
    }
  }
  return cases;
}
