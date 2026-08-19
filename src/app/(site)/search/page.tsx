import { getPosts, getCategories } from "@/lib/api";
import ArticleCard from "@/components/ArticleCard";

export const revalidate = 60;

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  return { title: q ? `Search: ${q}` : "Search" };
}

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  const { posts } = query
    ? await getPosts({ search: query, limit: 24 })
    : { posts: [] };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-2xl sm:text-3xl font-bold text-navy mb-2">
        {query ? (
          <>
            Search results for <span className="text-brand-red">&quot;{query}&quot;</span>
          </>
        ) : (
          "Search"
        )}
      </h1>

      {!query && (
        <p className="text-gray-500 mt-4">Enter a search term to find articles.</p>
      )}

      {query && posts.length === 0 && (
        <p className="text-gray-500 mt-4">
          No articles found for &quot;{query}&quot;. Try a different search term.
        </p>
      )}

      {posts.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mt-1 mb-8">
            {posts.length} article{posts.length === 1 ? "" : "s"} found
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <ArticleCard key={post.id} post={post} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}