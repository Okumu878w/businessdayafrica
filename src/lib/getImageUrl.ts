// frontend/src/lib/getImageUrl.ts
//
// Turns a relative upload path (e.g. "/uploads/petrol.jpg", as stored in
// the database and returned by the API) into an absolute URL pointing at
// the backend, so next/image can load it. Works in both local dev
// (http://localhost:4000) and production, based on NEXT_PUBLIC_API_URL.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function getImageUrl(path: string | null | undefined): string | null {
  if (!path) return null;

  // Already absolute (e.g. an external image URL) — leave it alone.
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  // Relative path from the API — prefix with the backend's base URL.
  return `${API_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}