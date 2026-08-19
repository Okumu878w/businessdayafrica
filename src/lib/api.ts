import { PaginatedPosts, PostDetail, Category } from "./types";

// Set NEXT_PUBLIC_API_URL in your environment (see .env.example).
// Falls back to localhost for local development.
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function apiFetch<T>(path: string, revalidateSeconds?: number): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    // Static-generate by default; pages that need fresher data pass a
    // revalidate window (ISR) so new articles show up without a full rebuild.
    next: revalidateSeconds !== undefined ? { revalidate: revalidateSeconds } : undefined,
  });

  if (!res.ok) {
    throw new Error(`API request failed: ${path} (${res.status})`);
  }
  return res.json();
}

// Homepage / listing feeds refresh every 60s so new stories appear quickly
// without needing a full site rebuild on every publish.
export function getPosts(params: {
  category?: string;
  tag?: string;
  search?: string;
  page?: number;
  limit?: number;
} = {}): Promise<PaginatedPosts> {
  const qs = new URLSearchParams();
  if (params.category) qs.set("category", params.category);
  if (params.tag) qs.set("tag", params.tag);
  if (params.search) qs.set("search", params.search);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));

  return apiFetch<PaginatedPosts>(`/api/posts?${qs.toString()}`, 60);
}

export function getPostBySlug(slug: string): Promise<PostDetail> {
  // Individual articles rarely change after publish — revalidate less often.
  // The backend also pings /api/revalidate on publish/edit for instant updates.
  return apiFetch<PostDetail>(`/api/posts/${slug}`, 300);
}

export function getCategories(): Promise<Category[]> {
  return apiFetch<Category[]>(`/api/categories`, 300);
}
