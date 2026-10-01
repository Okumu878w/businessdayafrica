"use client";

import { useEffect, useRef } from "react";

interface Props {
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
  layout?: "in-article"; // AdSense's special in-article ad type
  layoutKey?: string; // for in-feed fluid ads, provided by AdSense per unit
  className?: string;
  textAlignCenter?: boolean;
  // Reserve space before the ad loads so layout doesn't shift (protects CLS/SEO)
  minHeight?: number;
}

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export default function AdUnit({
  slot,
  format = "auto",
  layout,
  layoutKey,
  className = "",
  textAlignCenter = false,
  minHeight = 250,
}: Props) {
  const insRef = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    if (pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch (err) {
      console.error("AdSense push failed:", err);
    }
  }, []);

  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;
  if (!client) return null; // avoids broken ad slots in local/dev if env var isn't set

  return (
    <div className={`w-full flex justify-center overflow-hidden ${className}`} style={{ minHeight }}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block", width: "100%", ...(textAlignCenter ? { textAlign: "center" } : {}) }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        {...(layout ? { "data-ad-layout": layout } : {})}
        {...(layoutKey ? { "data-ad-layout-key": layoutKey } : {})}
        {...(format === "auto" ? { "data-full-width-responsive": "true" } : {})}
      />
    </div>
  );
}