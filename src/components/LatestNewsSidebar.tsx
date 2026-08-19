import Link from "next/link";
import Image from "next/image";
import { PostSummary } from "@/lib/types";
import { getImageUrl } from "@/lib/getImageUrl";

export default function LatestNewsSidebar({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return null;

  return (
    <aside className="rounded-2xl overflow-hidden border border-gray-100 h-fit">
      <div className="bg-gradient-to-r from-sidebar-dark to-navy-light px-6 py-5">
        <h2 className="font-heading text-xl font-bold text-white">Latest News</h2>
      </div>
      <ul className="divide-y divide-gray-100">
        {posts.map((post) => {
          const imageUrl = getImageUrl(post.featured_image_url);
          return (
            <li key={post.id}>
              <Link href={`/news/${post.slug}`} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors">
                {imageUrl && (
                  <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                    <Image
                      src={imageUrl}
                      alt={post.featured_image_alt || post.title}
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                )}
                <span className="font-heading text-sm font-bold text-navy leading-snug line-clamp-3">
                  {post.title}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}