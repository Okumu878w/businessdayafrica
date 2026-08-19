import { notFound } from "next/navigation";
import { getPosts, getCategories } from "@/lib/api";
import CategoryBanner from "@/components/CategoryBanner";
import ArticleCard from "@/components/ArticleCard";
import PageSidebar from "@/components/PageSidebar";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  return { title: category?.name || "Category" };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Number(pageParam) || 1;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const [{ posts, pagination }, { posts: latestPosts }] = await Promise.all([
    getPosts({ category: slug, page, limit: 12 }),
    getPosts({ limit: 5 }),
  ]);

  return (
    <div>
      <CategoryBanner title={category.name} />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {posts.map((post) => (
                <ArticleCard key={post.id} post={post} />
              ))}
              {posts.length === 0 && (
                <p className="text-gray-500 col-span-full text-center py-10">
                  No articles in this section yet.
                </p>
              )}
            </div>

            {pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => {
                  const isActive = p === page;
                  const pageUrl = "/category/" + slug + "?page=" + p;
                  const buttonClass = isActive
                    ? "w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-brand-red text-white"
                    : "w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors bg-gray-100 text-navy hover:bg-gray-200";
                  return (
                    <a key={p} href={pageUrl} className={buttonClass}>
                      {p}
                    </a>
                  );
                })}
              </div>
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