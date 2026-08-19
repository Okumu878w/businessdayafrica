"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Pencil, Trash2, Eye, PlusCircle, AlertTriangle } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";
import { AdminPostListItem } from "@/lib/adminTypes";
import { useAuthStore } from "@/lib/authStore";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
  { value: "scheduled", label: "Scheduled" },
  { value: "archived", label: "Archived" },
] as const;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default function AdminPostsPage() {
  const isAdmin = useAuthStore((s) => s.user?.role === "admin");
  const [posts, setPosts] = useState<AdminPostListItem[]>([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<number | null>(null);

  // Permanent delete needs a stronger confirmation than a plain confirm()
  // dialog — the writer has to type the article title back to proceed.
  const [confirmDeletePost, setConfirmDeletePost] = useState<AdminPostListItem | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const loadPosts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = statusFilter ? `?status=${statusFilter}&limit=50` : "?limit=50";
      const data = await adminFetch<{ posts: AdminPostListItem[] }>(`/api/posts${qs}`);
      setPosts(data.posts);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't load articles.");
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  async function handleArchive(id: number, title: string) {
    if (!window.confirm(`Archive "${title}"? It will be removed from the site but not permanently deleted.`)) return;
    setBusyId(id);
    try {
      await adminFetch(`/api/posts/${id}`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to archive article.");
    } finally {
      setBusyId(null);
    }
  }

  async function handlePermanentDelete() {
    if (!confirmDeletePost) return;
    setBusyId(confirmDeletePost.id);
    try {
      await adminFetch(`/api/posts/${confirmDeletePost.id}/permanent`, { method: "DELETE" });
      setPosts((prev) => prev.filter((p) => p.id !== confirmDeletePost.id));
      setConfirmDeletePost(null);
      setConfirmText("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to permanently delete article.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h1 className="font-heading text-2xl font-bold text-navy">Articles</h1>
        <Link
          href="/admin/posts/new"
          className="flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white text-sm font-medium rounded-lg px-4 py-2.5 transition-colors w-fit"
        >
          <PlusCircle size={16} />
          New Article
        </Link>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setStatusFilter(f.value)}
            className={`text-sm px-4 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              statusFilter === f.value ? "bg-navy text-white" : "bg-white border border-gray-200 text-navy hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {statusFilter === "archived" && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm rounded-lg px-4 py-3 mb-6">
          Archived articles are hidden from the live site but kept in the database.
          {isAdmin
            ? " As an admin, you can permanently delete them from here — this cannot be undone."
            : " Only an admin can permanently delete them."}
        </div>
      )}

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <p className="text-sm text-gray-400 px-6 py-10 text-center">Loading...</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-gray-400 px-6 py-10 text-center">No articles found.</p>
          ) : (
            <table className="w-full text-sm min-w-[720px]">
              <thead className="bg-gray-50 text-left text-xs text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="px-6 py-3 font-medium">Title</th>
                  <th className="px-6 py-3 font-medium">Author</th>
                  <th className="px-6 py-3 font-medium">Category</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                  <th className="px-6 py-3 font-medium">Views</th>
                  <th className="px-6 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-navy max-w-xs truncate">{post.title}</td>
                    <td className="px-6 py-4 text-gray-600">{post.author_name || "—"}</td>
                    <td className="px-6 py-4 text-gray-600">{post.category_name || "—"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                          post.status === "published"
                            ? "bg-green-100 text-green-700"
                            : post.status === "scheduled"
                            ? "bg-blue-100 text-blue-700"
                            : post.status === "archived"
                            ? "bg-gray-100 text-gray-500"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{post.view_count}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-3">
                        {post.status === "published" && (
                          <a
                            href={`${SITE_URL}/news/${post.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View live"
                            className="text-gray-400 hover:text-navy"
                          >
                            <Eye size={16} />
                          </a>
                        )}
                        <Link href={`/admin/posts/${post.slug}/edit`} aria-label="Edit" className="text-gray-400 hover:text-navy">
                          <Pencil size={16} />
                        </Link>

                        {post.status === "archived" ? (
                          isAdmin && (
                            <button
                              onClick={() => setConfirmDeletePost(post)}
                              disabled={busyId === post.id}
                              aria-label="Permanently delete"
                              title="Permanently delete"
                              className="text-gray-400 hover:text-red-700 disabled:opacity-50"
                            >
                              <AlertTriangle size={16} />
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => handleArchive(post.id, post.title)}
                            disabled={busyId === post.id}
                            aria-label="Archive"
                            title="Archive"
                            className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Permanent delete confirmation modal */}
      {confirmDeletePost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center gap-2 text-red-600 mb-3">
              <AlertTriangle size={20} />
              <h2 className="font-heading font-bold text-lg">Permanently delete article</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              This cannot be undone. To confirm, type the article title exactly:
              <br />
              <span className="font-medium text-navy">{confirmDeletePost.title}</span>
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="Type the title to confirm"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:border-red-500"
              autoFocus
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setConfirmDeletePost(null);
                  setConfirmText("");
                }}
                className="text-sm px-4 py-2 rounded-lg text-navy hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePermanentDelete}
                disabled={confirmText !== confirmDeletePost.title || busyId === confirmDeletePost.id}
                className="text-sm px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {busyId === confirmDeletePost.id ? "Deleting..." : "Permanently delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}