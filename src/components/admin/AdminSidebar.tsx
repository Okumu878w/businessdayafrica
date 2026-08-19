"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FileText, PlusCircle, Users, Tag, LogOut, X } from "lucide-react";
import { useAuthStore } from "@/lib/authStore";
import { adminFetch } from "@/lib/adminApi";

interface Props {
  mobileOpen: boolean;
  onClose: () => void;
}

export default function AdminSidebar({ mobileOpen, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, refreshToken, logout } = useAuthStore();

  const navItems = [
    { href: "/admin/posts", label: "Articles", icon: FileText },
    { href: "/admin/posts/new", label: "New Article", icon: PlusCircle },
    { href: "/admin/categories", label: "Categories", icon: Tag },
    ...(user?.role === "admin" || user?.role === "editor"
      ? [{ href: "/admin/users", label: "Team", icon: Users }]
      : []),
  ];

  async function handleLogout() {
    await adminFetch("/api/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    }).catch(() => {});
    logout();
    router.push("/admin/login");
  }

  return (
    <>
      {/* Backdrop — mobile only, closes the drawer on tap */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed lg:static top-0 left-0 z-50 w-64 shrink-0 bg-sidebar-dark min-h-screen flex flex-col
          transform transition-transform duration-200 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <div>
            <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-white">
              Business Day
            </span>
            <p className="text-xs text-gray-400 mt-1">Newsroom Admin</p>
          </div>
          <button
            aria-label="Close menu"
            onClick={onClose}
            className="lg:hidden text-gray-400 hover:text-white"
          >
            <X size={22} />
          </button>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={`flex items-center gap-3 px-6 py-3 text-sm transition-colors ${
                  active ? "bg-white/10 text-white font-medium" : "text-gray-300 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 py-4 border-t border-white/10">
          <p className="text-sm text-white font-medium">{user?.name}</p>
          <p className="text-xs text-gray-400 capitalize mb-3">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}