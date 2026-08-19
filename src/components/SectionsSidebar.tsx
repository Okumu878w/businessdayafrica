import Link from "next/link";
import { ChevronsRight } from "lucide-react";
import { Category } from "@/lib/types";

export default function SectionsSidebar({ categories }: { categories: Category[] }) {
  return (
    <aside className="rounded-2xl overflow-hidden border border-gray-100 h-fit">
      <div className="bg-gradient-to-r from-sidebar-dark to-navy-light px-6 py-5">
        <h2 className="font-heading text-xl font-bold text-white">Sections</h2>
      </div>
      <ul className="divide-y divide-gray-100">
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link
              href={`/category/${cat.slug}`}
              className="flex items-center gap-2 px-6 py-4 text-navy hover:text-brand-red hover:bg-gray-50 transition-colors"
            >
              <ChevronsRight size={16} className="text-gray-400" />
              <span>{cat.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
