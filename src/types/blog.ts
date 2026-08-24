// Two content registers share one type, distinguished by `category`: SEO/
// educational articles and behind-the-scenes clinic-life posts — see the
// homepage-structure conversation for why this is one section with a
// category filter, not two separate top-level sections.
export interface BlogPost {
  id: string;
  title: string;
  excerpt?: string;
  content?: string;
  coverImage?: string;
  category?: string;
  published: boolean;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const BLOG_CATEGORIES = ["Образование", "Из жизни клиники"] as const;
