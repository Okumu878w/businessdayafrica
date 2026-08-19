"use client";

import Link from "next/link";
import { useState } from "react";

function Twitter({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export default function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("submitting");
    // NOTE: wire this up to your actual newsletter provider (Mailchimp,
    // Brevo, etc.) or a /api/newsletter endpoint on the backend once
    // you've chosen one. Left as a stub for now.
    try {
      await new Promise((r) => setTimeout(r, 500));
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <footer className="bg-white border-t border-gray-100 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-brand-red mb-4">
            Business Day Africa
          </h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            Business Day Africa is an online publication that focuses on unbiased, balanced and
            factual news around the continent. Our CONTENT is original and thoroughly researched
            to ensure that we give the best to our readers.
          </p>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-navy mb-4">BDA Links</h3>
          <ul className="flex flex-col gap-2 text-sm">
            <li>
              <Link href="/" className="text-navy hover:text-brand-red transition-colors">
                {">"} Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-navy hover:text-brand-red transition-colors">
                {">"} About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-navy hover:text-brand-red transition-colors">
                {">"} Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-heading text-lg font-bold text-navy mb-4">Newsletter</h3>
          <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
            <label htmlFor="newsletter-email" className="text-sm text-navy">
              Email Address:
            </label>
            <input
              id="newsletter-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Please specify a valid email address."
              className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-brand-red"
            />
            <button
              type="submit"
              disabled={status === "submitting"}
              className="border-2 border-navy text-navy rounded px-4 py-2 text-sm font-medium hover:bg-navy hover:text-white transition-colors w-fit disabled:opacity-50"
            >
              {status === "submitting" ? "Subscribing..." : "Subscribe"}
            </button>
            {status === "done" && <p className="text-xs text-green-600">Subscribed — thank you!</p>}
            {status === "error" && <p className="text-xs text-red-600">Please enter a valid email.</p>}
          </form>
        </div>
      </div>

      <div className="border-t border-gray-100 py-5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © Copyright {new Date().getFullYear()} - Business Day Africa All rights Reserved
          </p>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="w-9 h-9 rounded-full bg-navy flex items-center justify-center text-white hover:bg-brand-red transition-colors"
          >
            <Twitter size={16} />
          </a>
        </div>
      </div>
    </footer>
  );
}
