// src/types/serviceData.ts
// Types only — all data now lives in the SQLite database and is fetched via /api

export interface PriceItem {
  id: string;
  name: string;
  heroImage?: string;
  backgroundPosition?: string;
  price: number;
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
  }[];
  serviceVideo?: string;
  galleryImages?: string[];
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
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
 * Relies on fields always set by the API (seeded from the original data).
 */
export function requiresConsultation(service: PriceItem): boolean {
  if (service.includesConsultation) return false;
  return service.requiresConsultation ?? false;
}
