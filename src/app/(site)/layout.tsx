import type { Metadata } from "next";

// Self-hosted fonts (via @fontsource) rather than next/font/google — this
// avoids any runtime/build-time dependency on Google's font CDN being
// reachable, which matters on shared hosting behind restrictive firewalls.
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/700.css";
import "@fontsource/poppins/400.css";
import "@fontsource/poppins/500.css";
import "@fontsource/poppins/600.css";
import "@fontsource/poppins/700.css";

import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import { getCategories } from "@/lib/api";

export const metadata: Metadata = {
  title: {
    default: "Business Day Africa",
    template: "%s | Business Day Africa",
  },
  description:
    "Business Day Africa is an online publication that focuses on unbiased, balanced and factual news around the continent.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Categories drive the main nav — fetched once per request, cached by
  // the API layer, shared between header (desktop+mobile) and footer.
  const categories = await getCategories().catch(() => []);

  return (
    <html lang="en">
      <body className="antialiased flex min-h-screen flex-col">
        <Header categories={categories} />
        <main className="flex-1">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
