import type { MetadataRoute } from "next";
import { getServices } from "@/lib/services/queries";
import { getAllPackages } from "@/types/packageData";
import { getTeamMembers } from "@/lib/team/queries";
import { getPublishedBlogPosts } from "@/lib/blog/queries";

// services/team/blog rows come from the admin-managed DB — must render
// per-request, not get frozen at build time (the Docker build runs against
// an empty data/ dir).
export const dynamic = "force-dynamic";

const SITE = "https://abclinic.uz";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, changeFrequency: "weekly", priority: 1.0 },
    { url: `${SITE}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE}/history`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE}/team`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/services`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE}/complex-treatment`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE}/documents`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.6 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = getServices().map((svc) => ({
    url: `${SITE}/services/${svc.id}`,
    lastModified: svc.updatedAt ? new Date(svc.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const packageRoutes: MetadataRoute.Sitemap = getAllPackages().map((pkg) => ({
    url: `${SITE}/complex-treatment/${pkg.id}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const teamRoutes: MetadataRoute.Sitemap = getTeamMembers().map((member) => ({
    url: `${SITE}/team/${member.id}`,
    lastModified: member.updatedAt ? new Date(member.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.5,
  }));

  const blogRoutes: MetadataRoute.Sitemap = getPublishedBlogPosts().map((post) => ({
    url: `${SITE}/blog/${post.id}`,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : now,
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  return [...staticRoutes, ...serviceRoutes, ...packageRoutes, ...teamRoutes, ...blogRoutes];
}
