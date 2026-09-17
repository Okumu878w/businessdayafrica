"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ImagePlus, Loader2, Trash2 } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";
import { getImageUrl } from "@/lib/getImageUrl";
import { useAuthStore } from "@/lib/authStore";

export interface MediaItem {
  id: number;
  file_name: string;
  url: string;
  thumbnail_url: string | null;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

interface Props {
  onClose: () => void;
  onSelect: (media: { id: number; url: string }) => void;
}

const PAGE_SIZE = 40;

export default function MediaLibraryModal({ onClose, onSelect }: Props) {
  const { user } = useAuthStore();
  const canDelete = user?.role === "admin" || user?.role === "editor";

  const [tab, setTab] = useState<"library" | "upload">("library");

  const [items, setItems] = useState<MediaItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPage = useCallback(async (pageNum: number) => {
    setLoading(true);
    setLoadError(null);
    try {
      const results = await adminFetch<MediaItem[]>(`/api/media?page=${pageNum}&limit=${PAGE_SIZE}`);
      setItems((prev) => (pageNum === 1 ? results : [...prev, ...results]));
      setHasMore(results.length === PAGE_SIZE);
      setPage(pageNum);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to load media.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (tab === "library" && items.length === 0 && !loading) {
      loadPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  async function handleUploadFile(file: File) {
    setUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const media = await adminFetch<{ id: number; url: string }>("/api/media", {
        method: "POST",
        body: formData,
      });
      onSelect({ id: media.id, url: media.url });
      onClose();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await adminFetch(`/api/media/${id}`, { method: "DELETE" });
      setItems((prev) => prev.filter((item) => item.id !== id));
      setConfirmId(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : "Failed to delete image.");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab("library")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === "library" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Media library
            </button>
            <button
              type="button"
              onClick={() => setTab("upload")}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                tab === "upload" ? "bg-navy text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              Upload new
            </button>
          </div>
          <button aria-label="Close" onClick={onClose} className="text-gray-400 hover:text-navy">
            <X size={22} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {tab === "library" ? (
            <>
              {loadError && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
                  {loadError}
                </div>
              )}

              {items.length === 0 && !loading && !loadError && (
                <p className="text-sm text-gray-500 text-center py-12">
                  No images uploaded yet. Switch to &ldquo;Upload new&rdquo; to add one.
                </p>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {items.map((item) => {
                  const thumbSrc = getImageUrl(item.thumbnail_url || item.url);
                  const isConfirming = confirmId === item.id;
                  const isDeleting = deletingId === item.id;

                  return (
                    <div
                      key={item.id}
                      className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 border-transparent hover:border-brand-red transition-colors group"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          onSelect({ id: item.id, url: item.url });
                          onClose();
                        }}
                        className="absolute inset-0 w-full h-full"
                        title={item.alt_text || item.file_name}
                        disabled={isDeleting}
                      >
                        {thumbSrc && (
                          <Image
                            src={thumbSrc}
                            alt={item.alt_text || item.file_name}
                            fill
                            sizes="200px"
                            className="object-cover"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                      </button>

                      {canDelete && !isConfirming && (
                        <button
                          type="button"
                          aria-label="Delete image"
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmId(item.id);
                          }}
                          disabled={isDeleting}
                          className="absolute top-1.5 right-1.5 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 disabled:opacity-50"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}

                      {isConfirming && (
                        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2 p-2">
                          <p className="text-white text-xs text-center leading-snug">Delete this image?</p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              disabled={isDeleting}
                              className="bg-red-600 hover:bg-red-700 text-white text-xs font-medium px-2.5 py-1 rounded disabled:opacity-50"
                            >
                              {isDeleting ? "..." : "Delete"}
                            </button>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setConfirmId(null);
                              }}
                              disabled={isDeleting}
                              className="bg-white/20 hover:bg-white/30 text-white text-xs font-medium px-2.5 py-1 rounded"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {loading && (
                <div className="flex items-center justify-center py-8 text-gray-400">
                  <Loader2 size={22} className="animate-spin" />
                </div>
              )}

              {!loading && hasMore && items.length > 0 && (
                <div className="flex justify-center mt-6">
                  <button
                    type="button"
                    onClick={() => loadPage(page + 1)}
                    className="text-sm font-medium text-brand-red hover:text-brand-red-dark"
                  >
                    Load more
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full max-w-sm aspect-video rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-brand-red hover:text-brand-red transition-colors disabled:opacity-50"
              >
                <ImagePlus size={28} />
                <span className="text-sm">{uploading ? "Uploading..." : "Click to upload from your device"}</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleUploadFile(file);
                  e.target.value = "";
                }}
              />
              {uploadError && <p className="text-xs text-red-600 mt-3">{uploadError}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}