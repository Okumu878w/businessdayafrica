export interface AdminCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  parent_id: number | null;
  post_count: number;
}

export interface AdminTag {
  id: number;
  name: string;
  slug: string;
}

export interface AdminPostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  status: "draft" | "published" | "scheduled" | "archived";
  published_at: string | null;
  view_count: number;
  author_name: string | null;
  author_id: number | null;
  category_name: string | null;
  category_slug: string | null;
  featured_image_url: string | null;
}

export interface AdminPostDetail extends AdminPostListItem {
  content_html: string;
  category_id: number | null;
  featured_media_id: number | null;
  seo_title: string | null;
  seo_description: string | null;
  scheduled_for: string | null;
  tags: AdminTag[];
}

export interface AdminUserItem {
  id: number;
  name: string;
  email: string;
  role: "admin" | "editor" | "writer";
}
