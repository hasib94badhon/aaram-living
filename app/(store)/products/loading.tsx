export default function ProductsLoading() {
  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header skeleton */}
        <div className="mb-6 space-y-2">
          <div className="h-7 w-36 bg-stone-200 rounded animate-pulse" />
          <div className="h-4 w-24 bg-stone-200 rounded animate-pulse" />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar skeleton */}
          <aside className="lg:w-52 shrink-0 space-y-1.5">
            {Array.from({ length: 7 }).map((_, i) => (
              <div key={i} className="h-9 bg-stone-200 rounded-xl animate-pulse" />
            ))}
          </aside>

          {/* Product grid skeleton */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square bg-stone-200 rounded-2xl mb-2" />
                <div className="px-1 space-y-1.5">
                  <div className="h-3 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-200 rounded w-full" />
                  <div className="h-4 w-20 bg-stone-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
