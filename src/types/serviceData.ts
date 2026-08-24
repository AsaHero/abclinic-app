// src/types/serviceData.ts
// Types only — data lives in SQLite (src/lib/db.ts), read via
// src/lib/services/queries.ts directly from Server Components (no HTTP
// round trip, unlike the old Express API).

// Patient-language groupings for the before/after gallery — not the
// price-list categories (see ServiceCategory below), which are organized
// by clinical department rather than by the problem a visitor recognizes
// in themselves. Fixed set, shared between the admin uploader and the
// homepage gallery so the two never drift apart.
export const BEFORE_AFTER_CATEGORIES = ["Чистые зубы", "Кариес", "Восстановление", "Ровные зубы"] as const;
export type BeforeAfterCategory = (typeof BEFORE_AFTER_CATEGORIES)[number];

export interface PriceItem {
  id: string;
  name: string;
  heroImage?: string;
  backgroundPosition?: string;
  price: number;
  /** Defaults true. false = staff-only pricing (e.g. loyalty rates) — excluded
   *  from every public query unless explicitly requested. */
  isPublic?: boolean;
  popular?: boolean;
  description?: string;
  detailedDescription?: string;
  duration?: string;
  category: string;
  categories?: string[];
  requiresConsultation?: boolean;
  isSpecialOffer?: boolean;
  includesConsultation?: boolean;
  benefits?: string[];
  process?: {
    step: number;
    title: string;
    description: string;
  }[];
  suitableFor?: string[];
  faqs?: {
    question: string;
    answer: string;
  }[];
  beforeAfterImages?: {
    before: string;
    after: string;
    description?: string;
    category?: BeforeAfterCategory;
  }[];
  serviceVideo?: string;
  galleryImages?: string[];
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

// A group of services that are really the same treatment offered at
// different material/quality tiers (e.g. an indirect restoration in
// hybrid ceramic vs e.max vs hand-layered feldspathic porcelain) — shown
// as one comparison card in the price list instead of N separate rows.
export interface ServiceGroup {
  id: string;
  title: string;
  tagline?: string;
  category: string;
  services: PriceItem[];
  recommendedServiceId?: string;
}

export interface ServiceCategory {
  id: string;
  title: string;
  icon?: React.ReactNode;
  requiresConsultation?: boolean;
  description?: string;
  sortOrder?: number;
}

/**
 * Determines whether a service requires a prior consultation.
 * Relies on fields always set by the DB layer.
 */
export function requiresConsultation(service: PriceItem): boolean {
  if (service.includesConsultation) return false;
  return service.requiresConsultation ?? false;
}
