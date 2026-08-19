export const metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="font-heading text-3xl font-bold text-navy mb-8">About Us</h1>

      <div className="flex flex-col gap-6 text-gray-600 leading-relaxed">
        <p>
          Business Day Africa is an online publication that focuses on unbiased, balanced
          and factual news around the continent. Our content is original and thoroughly
          researched to ensure that we give the best to our readers.
        </p>
        <p>
          Apart from news, we also organize media coverage for corporate entities that
          would like to have their events covered.
        </p>
        <p>
          We also run sponsored content, which is clearly labeled in order to distinguish
          it from the editorial content. To partner with us, send an email to{" "}
          <a href="mailto:news@businessdayafrica.org" className="text-brand-red hover:underline">
            news@businessdayafrica.org
          </a>{" "}
          or twitter handle{" "}
          <span className="italic">@Africa_newsday</span>.
        </p>
      </div>
    </div>
  );
}