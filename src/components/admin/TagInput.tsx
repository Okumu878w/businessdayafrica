"use client";

import { useState, KeyboardEvent } from "react";
import { X } from "lucide-react";
import { AdminTag } from "@/lib/adminTypes";
import { adminFetch } from "@/lib/adminApi";

interface Props {
  tags: AdminTag[];
  onChange: (tags: AdminTag[]) => void;
}

export default function TagInput({ tags, onChange }: Props) {
  const [inputValue, setInputValue] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function addTag() {
    const name = inputValue.trim();
    if (!name || submitting) return;
    if (tags.some((t) => t.name.toLowerCase() === name.toLowerCase())) {
      setInputValue("");
      return;
    }

    setSubmitting(true);
    try {
      const results = await adminFetch<AdminTag[]>("/api/tags/find-or-create", {
        method: "POST",
        body: JSON.stringify({ names: [name] }),
      });
      if (results[0]) onChange([...tags, results[0]]);
      setInputValue("");
    } catch {
      // silently ignore — worst case the writer retries
    } finally {
      setSubmitting(false);
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
  }

  return (
    <div>
      <label className="block text-sm font-medium text-navy mb-2">Tags</label>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <span
            key={tag.id}
            className="flex items-center gap-1 bg-gray-100 text-navy text-xs px-3 py-1.5 rounded-full"
          >
            {tag.name}
            <button
              type="button"
              onClick={() => onChange(tags.filter((t) => t.id !== tag.id))}
              aria-label={`Remove ${tag.name}`}
              className="text-gray-400 hover:text-brand-red"
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        placeholder="Type a tag and press Enter"
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
      />
    </div>
  );
}
