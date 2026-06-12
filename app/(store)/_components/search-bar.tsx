"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

type SearchProduct = {
  id: number;
  name: string;
  slug: string;
  price: number;
  salePrice: number | null;
  viewCount: number;
  images: { url: string }[];
  category: { name: string };
};

type SearchCategory = {
  id: number;
  name: string;
  slug: string;
  viewCount: number;
};

type SearchResults = {
  products: SearchProduct[];
  categories: SearchCategory[];
};

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Debounced search
  useEffect(() => {
    if (query.length < 2) {
      setResults(null);
      setOpen(false);
      return;
    }
    setLoading(true);
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(query)}`
        );
        const data = await res.json();
        setResults(data);
        setOpen(true);
        setActiveIndex(-1);
      } finally {
        setLoading(false);
      }
    }, 280);
    return () => clearTimeout(timer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        !inputRef.current?.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const allItems = [
    ...(results?.categories.map((c) => ({
      type: "category" as const,
      label: c.name,
      href: `/products?category=${c.slug}`,
    })) ?? []),
    ...(results?.products.map((p) => ({
      type: "product" as const,
      label: p.name,
      href: `/products/${p.slug}`,
      image: p.images[0]?.url,
      price: Number(p.salePrice ?? p.price),
      category: p.category.name,
      viewCount: p.viewCount,
    })) ?? []),
  ];

  function navigate(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, allItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && allItems[activeIndex]) {
        navigate(allItems[activeIndex].href);
      } else if (query.trim()) {
        navigate(`/products?q=${encodeURIComponent(query.trim())}`);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const hasResults =
    results &&
    (results.products.length > 0 || results.categories.length > 0);

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Input */}
      <div
        className={`flex items-center bg-white rounded-2xl shadow-xl transition-all duration-200 ${
          open ? "ring-2 ring-amber-400" : "ring-1 ring-stone-200"
        }`}
      >
        <div className="pl-5 shrink-0 text-stone-400">
          {loading ? (
            <svg
              className="w-5 h-5 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 105.65 5.65a7.5 7.5 0 0011.3 11.3z"
              />
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder="Search products, categories…"
          className="flex-1 h-14 bg-transparent px-4 text-base text-stone-900 placeholder-stone-400 focus:outline-none"
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults(null);
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="pr-3 text-stone-400 hover:text-stone-600 transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}

        <button
          onClick={() =>
            query.trim() &&
            navigate(`/products?q=${encodeURIComponent(query.trim())}`)
          }
          className="m-1.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold px-5 h-11 rounded-xl transition-colors text-sm shrink-0"
        >
          Search
        </button>
      </div>

      {/* Dropdown */}
      {open && (
        <div
          ref={dropdownRef}
          className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-2xl border border-stone-100 z-50 overflow-hidden animate-scale-in"
        >
          {hasResults ? (
            <>
              {/* Categories */}
              {results!.categories.length > 0 && (
                <div className="px-3 pt-3 pb-1">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-2 mb-2">
                    Categories
                  </p>
                  {results!.categories.map((cat, idx) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        navigate(`/products?category=${cat.slug}`)
                      }
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                        activeIndex === idx
                          ? "bg-amber-50 text-amber-800"
                          : "hover:bg-stone-50 text-stone-700"
                      }`}
                    >
                      <span className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-sm">
                        📦
                      </span>
                      <span className="font-medium text-sm">{cat.name}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* Products */}
              {results!.products.length > 0 && (
                <div className="px-3 pb-3 pt-1">
                  {results!.categories.length > 0 && (
                    <p className="text-xs font-semibold text-stone-400 uppercase tracking-wider px-2 mb-2 mt-2">
                      Products
                    </p>
                  )}
                  {results!.products.map((product, idx) => {
                    const itemIdx =
                      (results!.categories.length > 0
                        ? results!.categories.length
                        : 0) + idx;
                    const displayPrice = Number(
                      product.salePrice ?? product.price
                    );
                    return (
                      <button
                        key={product.id}
                        onClick={() => navigate(`/products/${product.slug}`)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left transition-colors ${
                          activeIndex === itemIdx
                            ? "bg-amber-50"
                            : "hover:bg-stone-50"
                        }`}
                      >
                        <div className="w-10 h-10 bg-stone-100 rounded-lg overflow-hidden shrink-0">
                          {product.images[0] ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={product.images[0].url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-stone-300 text-lg">
                              🏷️
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-stone-900 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-stone-400">
                            {product.category.name}
                          </p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold text-amber-700">
                            ৳{displayPrice.toLocaleString()}
                          </p>
                          {product.viewCount > 0 && (
                            <p className="text-xs text-stone-400 flex items-center gap-1 justify-end">
                              <svg
                                className="w-3 h-3"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                />
                              </svg>
                              {product.viewCount}
                            </p>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* See all results */}
              <div className="border-t border-stone-100 px-4 py-3">
                <button
                  onClick={() =>
                    navigate(
                      `/products?q=${encodeURIComponent(query.trim())}`
                    )
                  }
                  className="text-sm text-amber-700 hover:text-amber-800 font-medium"
                >
                  See all results for &quot;{query}&quot; →
                </button>
              </div>
            </>
          ) : (
            <div className="px-4 py-6 text-center text-stone-400 text-sm">
              No results for &quot;{query}&quot;
            </div>
          )}
        </div>
      )}
    </div>
  );
}
