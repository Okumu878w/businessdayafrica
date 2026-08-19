"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PostEditorForm from "@/components/admin/PostEditorForm";
import { adminFetch } from "@/lib/adminApi";
import { AdminPostDetail } from "@/lib/adminTypes";

export default function EditPostPage() {
  const params = useParams<{ slug: string }>();
  const [post, setPost] = useState<AdminPostDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminFetch<AdminPostDetail>(`/api/posts/${params.slug}`)
      .then(setPost)
      .catch((err) => setError(err instanceof Error ? err.message : "Couldn't load this article."));
  }, [params.slug]);

  if (error) {
    return <div className="p-8 text-sm text-red-600">{error}</div>;
  }

  if (!post) {
    return <div className="p-8 text-sm text-gray-400">Loading article...</div>;
  }

  return <PostEditorForm mode="edit" initialPost={post} />;
}
