import { getPosts, getCategories } from "@/lib/api";
import HeroCarousel from "@/components/HeroCarousel";
import ArticleCard from "@/components/ArticleCard";
import PageSidebar from "@/components/PageSidebar";

// Revalidate the homepage every 60s (ISR) so new stories appear without a
// full rebuild. The backend also actively pings /api/revalidate on publish
// for near-instant updates.
export const revalidate = 60;

export default async function HomePage() {
  const [{ posts }, categories] = await Promise.all([
    getPosts({ limit: 13 }),
    getCategories(),
  ]);

  const heroPosts = posts.slice(0, 5);
  const gridPosts = posts.slice(5);
  const latestPosts = posts.slice(0, 5);

  return (
    <div>
      {heroPosts.length > 0 && <HeroCarousel posts={heroPosts} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {gridPosts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
            {gridPosts.length === 0 && (
              <p className="text-gray-500 col-span-full text-center py-10">
                No articles published yet. Check back soon.
              </p>
            )}
          </div>

          <div className="lg:col-span-1">
            <PageSidebar categories={categories} latestPosts={latestPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}