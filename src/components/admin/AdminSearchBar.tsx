"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

// Two visual modes, controlled by `variant`:
//  - "bar": always-visible input (used in the desktop topbar)
//  - "icon": a magnifying-glass button that expands into an input when
//    tapped, then collapses again on submit/close (used in the mobile header,
//    where there isn't room for a permanent search bar)
export default function AdminSearchBar({ variant = "bar" }: { variant?: "bar" | "icon" }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState(variant === "bar");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    router.push(`/admin/search?q=${encodeURIComponent(trimmed)}`);
    if (variant === "icon") setExpanded(false);
  }

  if (variant === "icon" && !expanded) {
    return (
      <button
        aria-label="Search"
        onClick={() => setExpanded(true)}
        className="text-white"
      >
        <Search size={22} />
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="relative flex-1 max-w-md">
      <Search
        size={18}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        autoFocus={variant === "icon"}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles, media, team..."
        className="w-full border border-gray-300 rounded-full pl-10 pr-9 py-2 text-sm bg-white focus:outline-none focus:border-brand-red"
      />
      {variant === "icon" && (
        <button
          type="button"
          aria-label="Close search"
          onClick={() => {
            setExpanded(false);
            setQuery("");
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-navy"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}