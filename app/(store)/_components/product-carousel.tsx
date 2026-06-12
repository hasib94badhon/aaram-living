"use client";

import { useRef } from "react";
import Link from "next/link";
import CarouselCard from "./carousel-card";

type CarouselProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  viewCount: number;
  images: { url: string; altText: string | null }[];
  isFeatured?: boolean;
};

export default function ProductCarousel({
  title,
  emoji,
  products,
  viewAllHref,
}: {
  title: string;
  emoji?: string;
  products: CarouselProduct[];
  viewAllHref?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (dir: "left" | "right") => {
    ref.current?.scrollBy({
      left: dir === "right" ? 680 : -680,
      behavior: "smooth",
    });
  };

  if (products.length === 0) return null;

  return (
    <section className="animate-fade-in-up">
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
          {emoji && <span>{emoji}</span>}
          {title}
        </h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-xs font-semibold text-amber-700 hover:text-amber-800 transition-colors flex items-center gap-1"
          >
            View all
            <svg
              className="w-3 h-3"
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
          </Link>
        )}
      </div>

      {/* Carousel with arrow buttons */}
      <div className="relative group/carousel">
        {/* Left button */}
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 z-10 bg-white border border-stone-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center text-stone-600 hover:text-amber-700 hover:border-amber-300 transition-all opacity-0 group-hover/carousel:opacity-100 duration-200"
          aria-label="Scroll left"
        >
          <svg
            className="w-4 h-4"
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
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 z-10 bg-white border border-stone-200 shadow-md rounded-full w-9 h-9 flex items-center justify-center text-stone-600 hover:text-amber-700 hover:border-amber-300 transition-all opacity-0 group-hover/carousel:opacity-100 duration-200"
          aria-label="Scroll right"
        >
          <svg
            className="w-4 h-4"
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

        {/* Scroll container */}
        <div
          ref={ref}
          className="flex gap-3.5 overflow-x-auto scrollbar-hide snap-x snap-mandatory scroll-smooth pb-2"
        >
          {products.map((product, i) => (
            <div
              key={product.id}
              className="animate-fade-in-up"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <CarouselCard
                product={product}
                size={i === 0 && product.viewCount > 30 ? "large" : "normal"}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
