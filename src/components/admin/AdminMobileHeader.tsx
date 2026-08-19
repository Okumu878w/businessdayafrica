"use client";

import { Menu } from "lucide-react";
import AdminSearchBar from "./AdminSearchBar";

export default function AdminMobileHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <div className="lg:hidden sticky top-0 z-30 bg-sidebar-dark flex items-center justify-between gap-3 px-4 py-4">
      <span className="font-[family-name:var(--font-playfair)] text-lg font-bold text-white shrink-0">
        Business Day Admin
      </span>
      <div className="flex items-center gap-4">
        <AdminSearchBar variant="icon" />
        <button aria-label="Open menu" onClick={onOpenMenu} className="text-white">
          <Menu size={24} />
        </button>
      </div>
    </div>
  );
}