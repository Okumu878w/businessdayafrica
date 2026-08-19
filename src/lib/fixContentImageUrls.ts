// frontend/src/lib/fixContentImageUrls.ts
//
// Article body content (content_html) comes from the WordPress migration as
// raw HTML and is rendered with dangerouslySetInnerHTML. Any <img src="/uploads/...">
// tags inside it are plain HTML — they don't go through next/image or
// getImageUrl(), so they still 404 against the frontend's own origin.
// This rewrites relative /uploads/ src attributes to absolute backend URLs
// before the HTML is rendered.

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export function fixContentImageUrls(html: string): string {
  if (!html) return html;

  // Matches src="/uploads/..." or src='/uploads/...' and prefixes it with
  // the backend's base URL. Leaves already-absolute URLs (http/https) alone.
  return html.replace(
    /src=(["'])\/uploads\//g,
    `src=$1${API_URL}/uploads/`
  );
}