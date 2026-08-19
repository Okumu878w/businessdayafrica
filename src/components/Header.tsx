"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { Category } from "@/lib/types";

// Only these categories appear in the main nav bar. Everything else
// (Explainer, Features, Main Stories, Opinion, CSR & Promotions, etc.)
// still exists as a real category and shows up elsewhere (e.g. SectionsSidebar).
const PRIMARY_NAV_SLUGS = [
  "economy",
  "company-news",
  "markets-commodities",
  "logistics",
  "comesa-news",
  "climate-change",
  "africa-world",
];

export default function Header({ categories }: { categories: Category[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Fall back to the known section list if the API is unreachable at build
  // time, so the nav never renders empty.
  const navItems =
    categories.length > 0
      ? categories.filter((cat) => PRIMARY_NAV_SLUGS.includes(cat.slug))
      : [
          { id: 1, name: "Economy", slug: "economy", description: null, parent_id: null, post_count: 0 },
          { id: 2, name: "Company News", slug: "company-news", description: null, parent_id: null, post_count: 0 },
          { id: 3, name: "Markets & Commodities", slug: "markets-commodities", description: null, parent_id: null, post_count: 0 },
          { id: 4, name: "Logistics", slug: "logistics", description: null, parent_id: null, post_count: 0 },
          { id: 5, name: "Comesa", slug: "comesa", description: null, parent_id: null, post_count: 0 },
          { id: 6, name: "Climate Change", slug: "climate-change", description: null, parent_id: null, post_count: 0 },
          { id: 7, name: "Africa & World", slug: "africa-world", description: null, parent_id: null, post_count: 0 },
        ];

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery.trim())}`;
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="font-[family-name:var(--font-playfair)] text-2xl sm:text-3xl font-bold text-brand-red whitespace-nowrap"
            >
              Business Day Africa
            </Link>

            {/* Mobile hamburger */}
            <button
              aria-label="Open menu"
              className="lg:hidden text-navy"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={28} />
            </button>
          </div>

          {/* Desktop nav — its own row below the logo */}
          <nav className="hidden lg:flex items-center gap-7 mt-3">
            {navItems.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                className="text-navy font-medium text-[15px] hover:text-brand-red transition-colors whitespace-nowrap"
              >
                {cat.name}
              </Link>
            ))}
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((v) => !v)}
              className="text-navy hover:text-brand-red transition-colors"
            >
              <Search size={20} />
            </button>
          </nav>
        </div>

        {searchOpen && (
          <form onSubmit={handleSearchSubmit} className="hidden lg:flex pb-4">
            <input
              type="search"
              autoFocus
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search articles..."
              className="w-full max-w-md border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-red"
            />
          </form>
        )}
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 right-0 w-full max-w-sm h-full bg-white shadow-xl flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-brand-red">
                Business Day Africa
              </span>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} className="text-navy">
                <X size={26} />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="px-5 py-3 border-b border-gray-100">
              <input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                className="w-full border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:border-brand-red"
              />
            </form>

            <nav className="flex-1 overflow-y-auto bg-sidebar-dark">
              {navItems.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="block px-5 py-4 uppercase text-sm tracking-wide text-gray-200 border-b border-white/10 hover:bg-white/5 transition-colors"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}