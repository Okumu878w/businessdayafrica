"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/authStore";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminMobileHeader from "@/components/admin/AdminMobileHeader";
import AdminTopbar from "@/components/admin/AdminTopbar";

import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";
import "../globals.css";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { accessToken } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close the mobile drawer automatically whenever the route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // zustand's persist middleware rehydrates from localStorage after mount,
  // not during SSR — wait for that before deciding whether to redirect,
  // otherwise every admin page briefly bounces to /login on refresh.
  useEffect(() => {
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (hydrated && !accessToken && !isLoginPage) {
      router.replace("/admin/login");
    }
  }, [hydrated, accessToken, isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;

  if (!hydrated || !accessToken) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400 text-sm">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar mobileOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
      <div className="flex-1 min-w-0">
        <AdminMobileHeader onOpenMenu={() => setMobileMenuOpen(true)} />
        <AdminTopbar />
        {children}
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AdminGuard>{children}</AdminGuard>
      </body>
    </html>
  );
}