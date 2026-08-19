import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPostBySlug, getPosts, getCategories } from "@/lib/api";
import { formatDateOrdinal } from "@/components/ArticleCard";
import PageSidebar from "@/components/PageSidebar";
import { getImageUrl } from "@/lib/getImageUrl";
import { fixContentImageUrls } from "@/lib/fixContentImageUrls";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const post = await getPostBySlug(slug);
    const ogImage = getImageUrl(post.featured_image_url);
    return {
      title: post.seo_title || post.title,
      description: post.seo_description || post.excerpt || undefined,
      openGraph: {
        title: post.seo_title || post.title,
        description: post.seo_description || post.excerpt || undefined,
        images: ogImage ? [ogImage] : undefined,
        type: "article",
      },
    };
  } catch {
    return { title: "Article" };
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  let post;
  try {
    post = await getPostBySlug(slug);
  } catch {
    notFound();
  }

  const [{ posts: latestPosts }, categories] = await Promise.all([
    getPosts({ limit: 5 }),
    getCategories(),
  ]);

  const featuredImageUrl = getImageUrl(post.featured_image_url);
  const authorAvatarUrl = getImageUrl(post.author_avatar);
  const contentHtml = fixContentImageUrls(post.content_html);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <article className="lg:col-span-3">
          {post.category_name && (
            <Link
              href={`/category/${post.category_slug}`}
              className="inline-block bg-brand-red text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-4"
            >
              {post.category_name}
            </Link>
          )}

          <h1 className="font-heading text-3xl sm:text-4xl font-extrabold text-navy leading-tight mb-4">
            {post.title}
          </h1>

          <div className="flex items-center gap-3 text-sm text-gray-600 mb-6 pb-6 border-b border-gray-100">
            {post.author_name && <span className="font-semibold text-navy">By {post.author_name}</span>}
            <span aria-hidden="true">•</span>
            <span>{formatDateOrdinal(post.published_at)}</span>
          </div>

          {featuredImageUrl && (
            <div className="relative w-full aspect-[16/9] rounded-2xl overflow-hidden bg-gray-200 mb-8">
              <Image
                src={featuredImageUrl}
                alt={post.featured_image_alt || post.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 800px"
                className="object-cover"
              />
            </div>
          )}

          {/* Content is trusted HTML authored by logged-in writers through
              the admin panel's rich text editor — not arbitrary user input.
              Image src attributes are rewritten to absolute backend URLs
              via fixContentImageUrls before rendering. */}
          <div
            className="prose prose-lg max-w-none prose-headings:font-heading prose-headings:text-navy prose-a:text-brand-red"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-gray-100">
              {post.tags.map((tag) => (
                <Link
                  key={tag.id}
                  href={`/tag/${tag.slug}`}
                  className="text-xs bg-gray-100 text-navy px-3 py-1.5 rounded-full hover:bg-gray-200 transition-colors"
                >
                  #{tag.name}
                </Link>
              ))}
            </div>
          )}

          {post.author_bio && (
            <div className="mt-10 pt-6 border-t border-gray-100 flex items-start gap-4">
              {authorAvatarUrl && (
                <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 bg-gray-200">
                  <Image src={authorAvatarUrl} alt={post.author_name || ""} fill className="object-cover" />
                </div>
              )}
              <div>
                <p className="font-heading font-bold text-navy">{post.author_name}</p>
                <p className="text-sm text-gray-600 mt-1">{post.author_bio}</p>
              </div>
            </div>
          )}
        </article>

        <div className="lg:col-span-1">
          <PageSidebar categories={categories} latestPosts={latestPosts.filter((p) => p.slug !== post.slug)} />
        </div>
      </div>
    </div>
  );
}