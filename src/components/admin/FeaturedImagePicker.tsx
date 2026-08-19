"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { adminFetch } from "@/lib/adminApi";
import { getImageUrl } from "@/lib/getImageUrl";

interface Props {
  mediaId: number | null;
  imageUrl: string | null;
  onChange: (mediaId: number | null, url: string | null) => void;
}

export default function FeaturedImagePicker({ mediaId, imageUrl, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const previewUrl = getImageUrl(imageUrl);

  async function handleFile(file: File) {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const media = await adminFetch<{ id: number; url: string }>("/api/media", {
        method: "POST",
        body: formData,
      });
      onChange(media.id, media.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-2">Featured image</label>

      {previewUrl ? (
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 group">
          <Image src={previewUrl} alt="Featured" fill className="object-cover" />
          <button
            type="button"
            onClick={() => onChange(null, null)}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove featured image"
          >
            <X size={16} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="w-full aspect-video rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-brand-red hover:text-brand-red transition-colors disabled:opacity-50"
        >
          <ImagePlus size={28} />
          <span className="text-sm">{uploading ? "Uploading..." : "Click to upload"}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}