export default function CartLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="h-8 w-52 bg-stone-200 rounded mb-8 animate-pulse" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items skeleton */}
        <div className="flex-1 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-4 animate-pulse"
            >
              <div className="w-20 h-20 bg-stone-200 rounded-xl shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-4 w-3/4 bg-stone-200 rounded" />
                <div className="h-4 w-20 bg-stone-200 rounded" />
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-7 w-24 bg-stone-200 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary skeleton */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 animate-pulse space-y-3">
            <div className="h-5 w-32 bg-stone-200 rounded" />
            <div className="h-4 bg-stone-200 rounded" />
            <div className="h-4 bg-stone-200 rounded" />
            <div className="border-t border-stone-200 pt-3">
              <div className="h-5 bg-stone-200 rounded" />
            </div>
            <div className="h-12 bg-stone-200 rounded-full mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
