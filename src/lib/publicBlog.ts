import { env } from "@/config/env";

export interface PublicPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  seoTitle: string;
  seoDescription: string;
  publishedAt: string | null;
  updatedAt: string;
}

export interface PublicBlog {
  businessName: string;
  publicSlug: string;
  posts: PublicPost[];
}

async function get<T>(path: string): Promise<T | null> {
  try {
    const res = await fetch(`${env.apiUrl}${path}`, { next: { revalidate: 60 } });
    return res.ok ? ((await res.json()) as T) : null;
  } catch {
    return null;
  }
}

export async function fetchPublicBlog(site: string): Promise<PublicBlog | null> {
  const data = await get<{ site: PublicBlog }>(`/api/public/blog-site/${encodeURIComponent(site)}`);
  return data?.site ?? null;
}

export async function fetchPublicPost(site: string, slug: string): Promise<{ businessName: string; post: PublicPost } | null> {
  return get<{ businessName: string; post: PublicPost }>(`/api/public/blog-site/${encodeURIComponent(site)}/${encodeURIComponent(slug)}`);
}

export const blogUrl = (site: string, slug?: string) => `${env.appUrl}/b/${site}${slug ? `/${slug}` : ""}`;

export const formatDate = (iso: string | null) =>
  iso ? new Date(iso).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" }) : "";
