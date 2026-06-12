"use client";

import { useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Category = {
  id: number;
  name: string;
  slug: string;
  viewCount: number;
};

const EMOJI_MAP: Record<string, string> = {
  bedroom: "🛏️",
  bed: "🛏️",
  kitchen: "🍳",
  cooking: "🍳",
  living: "🛋️",
  sofa: "🛋️",
  decor: "🪴",
  decoration: "🪴",
  bath: "🚿",
  outdoor: "🌿",
  lighting: "💡",
  storage: "📦",
  pillow: "🛏️",
  curtain: "🪟",
  table: "🪑",
  chair: "🪑",
};

function getCategoryEmoji(slug: string) {
  const lower = slug.toLowerCase();
  for (const [key, emoji] of Object.entries(EMOJI_MAP)) {
    if (lower.includes(key)) return emoji;
  }
  return "🏡";
}

export default function CategoryStrip({
  categories,
}: {
  categories: Category[];
}) {
  const ref = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const active = searchParams.get("category");

  const scroll = (dir: "left" | "right") => {
    ref.current?.scrollBy({
      left: dir === "right" ? 320 : -320,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative group/strip">
      {/* Left fade + button */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-stone-200 shadow rounded-full w-8 h-8 flex items-center justify-center text-stone-500 hover:text-amber-700 transition-all opacity-0 group-hover/strip:opacity-100 duration-200"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Right button */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/90 backdrop-blur-sm border border-stone-200 shadow rounded-full w-8 h-8 flex items-center justify-center text-stone-500 hover:text-amber-700 transition-all opacity-0 group-hover/strip:opacity-100 duration-200"
      >
        <svg
          className="w-3.5 h-3.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>

      {/* Scrollable strip */}
      <div
        ref={ref}
        className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1 snap-x"
      >
        {/* All button */}
        <Link
          href="/products"
          className={`shrink-0 snap-start flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
            !active
              ? "bg-amber-600 text-white shadow-md shadow-amber-200"
              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
          }`}
        >
          🏡 All
        </Link>

        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/products?category=${cat.slug}`}
            className={`shrink-0 snap-start flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
              active === cat.slug
                ? "bg-amber-600 text-white shadow-md shadow-amber-200"
                : "bg-stone-100 text-stone-600 hover:bg-stone-200"
            }`}
          >
            {getCategoryEmoji(cat.slug)} {cat.name}
            {cat.viewCount > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  active === cat.slug
                    ? "bg-amber-500 text-white"
                    : "bg-stone-200 text-stone-500"
                }`}
              >
                {cat.viewCount >= 1000
                  ? `${(cat.viewCount / 1000).toFixed(1)}k`
                  : cat.viewCount}
              </span>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
