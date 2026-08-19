"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "./RichTextEditor";
import FeaturedImagePicker from "./FeaturedImagePicker";
import TagInput from "./TagInput";
import { adminFetch } from "@/lib/adminApi";
import { AdminCategory, AdminPostDetail, AdminTag } from "@/lib/adminTypes";

type Status = "draft" | "published" | "scheduled";

interface Props {
  mode: "create" | "edit";
  initialPost?: AdminPostDetail;
}

export default function PostEditorForm({ mode, initialPost }: Props) {
  const router = useRouter();

  const [title, setTitle] = useState(initialPost?.title || "");
  const [excerpt, setExcerpt] = useState(initialPost?.excerpt || "");
  const [content, setContent] = useState(initialPost?.content_html || "");
  const [categoryId, setCategoryId] = useState<number | null>(initialPost?.category_id ?? null);
  const [tags, setTags] = useState<AdminTag[]>(initialPost?.tags || []);
  const [featuredMediaId, setFeaturedMediaId] = useState<number | null>(initialPost?.featured_media_id ?? null);
  const [featuredImageUrl, setFeaturedImageUrl] = useState<string | null>(initialPost?.featured_image_url ?? null);
  const [status, setStatus] = useState<Status>((initialPost?.status as Status) || "draft");
  const [scheduledFor, setScheduledFor] = useState(initialPost?.scheduled_for?.slice(0, 16) || "");
  const [seoTitle, setSeoTitle] = useState(initialPost?.seo_title || "");
  const [seoDescription, setSeoDescription] = useState(initialPost?.seo_description || "");
  const [showSeo, setShowSeo] = useState(false);

  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<AdminCategory[]>("/api/categories")
      .then(setCategories)
      .catch(() => setError("Couldn't load categories."));
  }, []);

  async function handleSave(targetStatus: Status) {
    if (!title.trim()) {
      setError("Please add a title before saving.");
      return;
    }
    if (!content.trim() || content === "<p></p>") {
      setError("Please write some article content before saving.");
      return;
    }
    if (targetStatus === "scheduled" && !scheduledFor) {
      setError("Pick a date/time to schedule this article for.");
      return;
    }

    setSaving(true);
    setError(null);

    const payload = {
      title: title.trim(),
      excerpt: excerpt.trim() || null,
      content_html: content,
      category_id: categoryId,
      tag_ids: tags.map((t) => t.id),
      featured_media_id: featuredMediaId,
      status: targetStatus,
      scheduled_for: targetStatus === "scheduled" ? new Date(scheduledFor).toISOString() : undefined,
      seo_title: seoTitle.trim() || null,
      seo_description: seoDescription.trim() || null,
    };

    try {
      if (mode === "create") {
        const result = await adminFetch<{ id: number; slug: string }>("/api/posts", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        router.push(`/admin/posts/${result.slug}/edit?saved=1`);
      } else if (initialPost) {
        await adminFetch(`/api/posts/${initialPost.id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
        setStatus(targetStatus);
        router.refresh();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-2xl font-bold text-navy">
          {mode === "create" ? "New Article" : "Edit Article"}
        </h1>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-medium px-3 py-1 rounded-full ${
              status === "published"
                ? "bg-green-100 text-green-700"
                : status === "scheduled"
                ? "bg-blue-100 text-blue-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {status}
          </span>
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-6">{error}</div>}

      <div className="flex flex-col gap-6">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Article title"
          className="w-full text-2xl font-heading font-bold text-navy border-b border-gray-200 pb-3 focus:outline-none focus:border-brand-red"
        />

        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          placeholder="Short excerpt / summary (shown in article cards)"
          rows={2}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red resize-none"
        />

        <RichTextEditor content={content} onChange={setContent} />

        <FeaturedImagePicker
          mediaId={featuredMediaId}
          imageUrl={featuredImageUrl}
          onChange={(id, url) => {
            setFeaturedMediaId(id);
            setFeaturedImageUrl(url);
          }}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-navy mb-2">Category</label>
            <select
              value={categoryId ?? ""}
              onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : null)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red bg-white"
            >
              <option value="">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <TagInput tags={tags} onChange={setTags} />
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowSeo((v) => !v)}
            className="text-sm text-brand-red font-medium"
          >
            {showSeo ? "Hide" : "Show"} SEO settings
          </button>
          {showSeo && (
            <div className="mt-4 flex flex-col gap-4 bg-gray-50 rounded-lg p-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1">SEO title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  placeholder="Defaults to the article title if left blank"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1">SEO description</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={2}
                  placeholder="Defaults to the excerpt if left blank"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red resize-none"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-6">
          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("draft")}
            className="border border-navy text-navy rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-navy hover:text-white transition-colors disabled:opacity-50"
          >
            Save as draft
          </button>

          <div className="flex items-center gap-2">
            <input
              type="datetime-local"
              value={scheduledFor}
              onChange={(e) => setScheduledFor(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
            />
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSave("scheduled")}
              className="border border-blue-600 text-blue-600 rounded-lg px-5 py-2.5 text-sm font-medium hover:bg-blue-600 hover:text-white transition-colors disabled:opacity-50"
            >
              Schedule
            </button>
          </div>

          <button
            type="button"
            disabled={saving}
            onClick={() => handleSave("published")}
            className="bg-brand-red hover:bg-brand-red-dark text-white rounded-lg px-6 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 ml-auto"
          >
            {saving ? "Saving..." : status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
