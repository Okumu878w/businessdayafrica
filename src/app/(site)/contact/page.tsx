import { Mail, MapPin } from "lucide-react";

// lucide-react dropped the old bird "Twitter" icon after the X rebrand —
// using a small inline SVG instead avoids depending on an icon that may
// not exist in your installed version.
function XIcon({ size = 18, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export const metadata = {
  title: "Contact Us",
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-3xl font-bold text-navy mb-8">Contact Us</h1>

      <p className="text-gray-600 leading-relaxed mb-8">
        Have a story tip, partnership inquiry, or general question? Reach out to us through
        any of the channels below.
      </p>

      <div className="flex flex-col gap-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <Mail size={18} className="text-brand-red" />
          </div>
          <div>
            <p className="font-medium text-navy">Email</p>
            <a href="mailto:news@businessdayafrica.org" className="text-gray-600 hover:text-brand-red transition-colors">
              news@businessdayafrica.org
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <XIcon size={16} className="text-brand-red" />
          </div>
          <div>
            <p className="font-medium text-navy">X (Twitter)</p>
            <a
              href="https://x.com/Africa_newsday"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-brand-red transition-colors"
            >
              @Africa_newsday
            </a>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
            <MapPin size={18} className="text-brand-red" />
          </div>
          <div>
            <p className="font-medium text-navy">Address</p>
            <p className="text-gray-600">Nairobi, Kenya</p>
          </div>
        </div>
      </div>
    </div>
  );
}