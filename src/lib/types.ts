export interface PostSummary {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: string;
  published_at: string | null;
  view_count: number;
  author_name: string | null;
  author_id: number | null;
  category_name: string | null;
  category_slug: string | null;
  featured_image_url: string | null;
  featured_image_alt: string | null;
}

export interface PostDetail extends PostSummary {
  content_html: string;
  author_avatar: string | null;
  author_bio: string | null;
  seo_title: string | null;
  seo_description: string | null;
  tags: { id: number; name: string; slug: string }[];
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  post_count: number;
}

export interface PaginatedPosts {
  posts: PostSummary[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
