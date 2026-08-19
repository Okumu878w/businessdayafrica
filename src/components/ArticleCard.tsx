import Link from "next/link";
import Image from "next/image";
import { PostSummary } from "@/lib/types";
import { getImageUrl } from "@/lib/getImageUrl";

function formatDate(dateString: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Ordinal suffix ("10th", "7th") to match the original site's date format
function formatDateOrdinal(dateString: string | null) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? "st" : day % 10 === 2 && day !== 12 ? "nd" : day % 10 === 3 && day !== 13 ? "rd" : "th";
  const month = date.toLocaleDateString("en-US", { month: "long" });
  return `${month} ${day}${suffix}, ${date.getFullYear()}`;
}

export default function ArticleCard({ post }: { post: PostSummary }) {
  const imageUrl = getImageUrl(post.featured_image_url);

  return (
    <Link
      href={`/news/${post.slug}`}
      className="group block bg-card-bg rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="relative w-full aspect-[16/10] bg-gray-200">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={post.featured_image_alt || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
            Business Day Africa
          </div>
        )}
      </div>

      <div className="p-5">
        {post.category_name && (
          <span className="inline-block bg-brand-red text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-3">
            {post.category_name}
          </span>
        )}
        <p className="text-xs text-gray-500 font-medium mb-2">{formatDateOrdinal(post.published_at)}</p>
        <h3 className="font-heading text-lg font-bold text-navy leading-snug mb-2 line-clamp-2 group-hover:text-brand-red transition-colors">
          {post.title}
        </h3>
        {post.author_name && (
          <p className="text-sm text-gray-600">
            By <span className="font-semibold text-navy">{post.author_name}</span>
          </p>
        )}
      </div>
    </Link>
  );
}

export { formatDate, formatDateOrdinal };