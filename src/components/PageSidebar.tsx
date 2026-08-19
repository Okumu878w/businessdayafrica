import SectionsSidebar from "./SectionsSidebar";
import LatestNewsSidebar from "./LatestNewsSidebar";
import { Category, PostSummary } from "@/lib/types";

export default function PageSidebar({
  categories,
  latestPosts,
}: {
  categories: Category[];
  latestPosts: PostSummary[];
}) {
  return (
    <div className="flex flex-col gap-8">
      <SectionsSidebar categories={categories} />
      <LatestNewsSidebar posts={latestPosts} />
    </div>
  );
}