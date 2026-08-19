export default function CategoryBanner({ title }: { title: string }) {
  return (
    <div className="w-full bg-gradient-to-r from-brand-red-dark to-brand-red py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="w-16 h-0.5 bg-white/70 mx-auto mb-5" />
        <h1 className="font-heading text-3xl sm:text-5xl font-extrabold text-white">{title}</h1>
      </div>
    </div>
  );
}
