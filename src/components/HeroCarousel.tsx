"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PostSummary } from "@/lib/types";
import { getImageUrl } from "@/lib/getImageUrl";

export default function HeroCarousel({ posts }: { posts: PostSummary[] }) {
  const [index, setIndex] = useState(0);

  const next = useCallback(() => setIndex((i) => (i + 1) % posts.length), [posts.length]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + posts.length) % posts.length), [posts.length]);

  // Auto-advance every 6s, pause isn't implemented for simplicity — a real
  // newsroom slider usually just loops continuously
  useEffect(() => {
    if (posts.length <= 1) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, posts.length]);

  if (!posts.length) return null;
  const post = posts[index];
  const imageUrl = getImageUrl(post.featured_image_url);

  return (
    <div className="relative w-full h-[380px] sm:h-[460px] lg:h-[560px] bg-gray-200 overflow-hidden">
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={post.featured_image_alt || post.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-300" />
      )}

      {/* Dark gradient rising from the bottom so text stays legible while
          the image remains visible through it, rather than being covered
          by an opaque card */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

      <Link
        href={`/news/${post.slug}`}
        className="absolute left-0 bottom-0 p-6 sm:p-10 max-w-2xl group"
      >
        {post.category_name && (
          <span className="inline-block bg-brand-red text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4">
            {post.category_name}
          </span>
        )}
        <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight mb-4 group-hover:text-gray-200 transition-colors">
          {post.title}
        </h1>
        {post.author_name && <p className="font-semibold text-gray-200">{post.author_name}</p>}
      </Link>

      {posts.length > 1 && (
        <>
          <button
            aria-label="Previous story"
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-navy shadow"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            aria-label="Next story"
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-navy shadow"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}
    </div>
  );
}