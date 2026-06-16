export default function HomeLoading() {
  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Hero skeleton */}
      <div className="bg-stone-900 py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <div className="h-3 w-28 bg-stone-700 rounded-full mx-auto animate-pulse" />
          <div className="h-10 w-72 bg-stone-700 rounded-lg mx-auto animate-pulse" />
          <div className="h-4 w-56 bg-stone-700 rounded mx-auto animate-pulse" />
          <div className="h-11 max-w-2xl bg-stone-700 rounded-full mx-auto animate-pulse" />
        </div>
      </div>

      {/* Category strip skeleton */}
      <div className="bg-white border-b border-stone-100 py-3">
        <div className="max-w-7xl mx-auto px-4 flex gap-2 overflow-hidden">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-8 w-20 shrink-0 bg-stone-100 rounded-full animate-pulse" />
          ))}
        </div>
      </div>

      {/* Carousel skeletons */}
      <div className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {[0, 1, 2].map((s) => (
          <div key={s}>
            <div className="flex items-center justify-between mb-4">
              <div className="h-6 w-40 bg-stone-200 rounded animate-pulse" />
              <div className="h-4 w-16 bg-stone-200 rounded animate-pulse" />
            </div>
            <div className="flex gap-3.5 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-44 shrink-0 animate-pulse">
                  <div className="aspect-square bg-stone-200 rounded-2xl mb-2" />
                  <div className="h-3 bg-stone-200 rounded mb-1.5" />
                  <div className="h-3 w-16 bg-stone-200 rounded" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
