"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FileText, ImageIcon, User } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";
import { getImageUrl } from "@/lib/getImageUrl";

interface SearchResults {
  posts: { id: number; title: string; slug: string; status: string; updated_at: string }[];
  media: { id: number; file_name: string; url: string; thumbnail_url: string | null; alt_text: string | null }[];
  users: { id: number; name: string; email: string; role: string }[];
}

export default function AdminSearchPage() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";

  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q) {
      setResults(null);
      return;
    }
    setLoading(true);
    adminFetch<SearchResults>(`/api/search?q=${encodeURIComponent(q)}`)
      .then(setResults)
      .finally(() => setLoading(false));
  }, [q]);

  const hasResults =
    results && (results.posts.length > 0 || results.media.length > 0 || results.users.length > 0);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="font-heading text-2xl font-bold text-navy mb-1">Search results</h1>
      <p className="text-sm text-gray-500 mb-8">
        {q ? (
          <>
            Showing results for <span className="font-medium text-navy">&quot;{q}&quot;</span>
          </>
        ) : (
          "Enter a search term to get started."
        )}
      </p>

      {loading && <p className="text-sm text-gray-400">Searching...</p>}

      {!loading && q && !hasResults && (
        <p className="text-sm text-gray-500">No matches found for &quot;{q}&quot;.</p>
      )}

      {results && results.posts.length > 0 && (
        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-navy uppercase tracking-wide mb-3">
            <FileText size={16} /> Articles
          </h2>
          <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
            {results.posts.map((post) => (
              <Link
                key={post.id}
                href={`/admin/posts/${post.slug}/edit`}
                className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors"
              >
                <span className="text-sm font-medium text-navy">{post.title}</span>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    post.status === "published"
                      ? "bg-green-100 text-green-700"
                      : post.status === "scheduled"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {post.status}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {results && results.media.length > 0 && (
        <section className="mb-8">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-navy uppercase tracking-wide mb-3">
            <ImageIcon size={16} /> Media
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {results.media.map((item) => {
              const thumb = getImageUrl(item.thumbnail_url || item.url);
              return (
                <div key={item.id} className="rounded-xl overflow-hidden border border-gray-100">
                  {thumb && (
                    <div className="relative w-full aspect-square bg-gray-100">
                      <Image src={thumb} alt={item.alt_text || item.file_name} fill className="object-cover" />
                    </div>
                  )}
                  <p className="text-xs text-gray-600 px-2 py-1.5 truncate">{item.file_name}</p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {results && results.users.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold text-navy uppercase tracking-wide mb-3">
            <User size={16} /> Team
          </h2>
          <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
            {results.users.map((u) => (
              <div key={u.id} className="flex items-center justify-between px-5 py-3">
                <div>
                  <p className="text-sm font-medium text-navy">{u.name}</p>
                  <p className="text-xs text-gray-500">{u.email}</p>
                </div>
                <span className="text-xs text-gray-500 capitalize">{u.role}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}