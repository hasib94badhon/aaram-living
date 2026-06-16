export default function ProductDetailLoading() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb skeleton */}
        <div className="flex items-center gap-2 mb-8">
          {[56, 64, 80, 120].map((w) => (
            <div key={w} className="flex items-center gap-2">
              <div className="h-3 bg-stone-200 rounded animate-pulse" style={{ width: w }} />
              <div className="h-3 w-2 bg-stone-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image skeleton */}
          <div className="aspect-square bg-stone-200 rounded-3xl animate-pulse" />

          {/* Info skeleton */}
          <div className="space-y-4 animate-pulse">
            <div className="h-3 w-24 bg-stone-200 rounded" />
            <div className="h-8 w-3/4 bg-stone-200 rounded" />
            <div className="h-6 w-1/3 bg-stone-200 rounded" />
            <div className="h-10 w-36 bg-stone-200 rounded" />
            <div className="h-4 w-28 bg-stone-200 rounded" />
            <div className="border-t border-stone-100 pt-5 space-y-2">
              <div className="h-3 bg-stone-200 rounded" />
              <div className="h-3 bg-stone-200 rounded" />
              <div className="h-3 w-2/3 bg-stone-200 rounded" />
            </div>
            <div className="space-y-3 pt-2">
              <div className="h-12 bg-stone-200 rounded-full" />
              <div className="h-12 bg-stone-200 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
