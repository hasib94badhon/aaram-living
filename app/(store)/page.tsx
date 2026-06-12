import prisma from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import SearchBar from "./_components/search-bar";
import CategoryStrip from "./_components/category-strip";
import ProductCarousel from "./_components/product-carousel";

export const metadata: Metadata = {
  title: "Aaram Living — Discover Premium Home Essentials",
  description:
    "Shop quality home & lifestyle products delivered across Bangladesh.",
};

export default async function HomePage() {
  const [categories, trendingProducts, categoriesWithProducts] =
    await Promise.all([
      // Active categories sorted by viewCount (most popular first)
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { viewCount: "desc" },
      }),

      // Trending: all active products sorted by viewCount
      prisma.product.findMany({
        where: { isActive: true },
        include: {
          images: { where: { isPrimary: true }, take: 1 },
        },
        orderBy: { viewCount: "desc" },
        take: 16,
      }),

      // Active products grouped by active category (sorted by viewCount)
      prisma.category.findMany({
        where: { isActive: true },
        orderBy: { viewCount: "desc" },
        include: {
          products: {
            where: { isActive: true },
            include: { images: { where: { isPrimary: true }, take: 1 } },
            orderBy: { viewCount: "desc" },
            take: 12,
          },
        },
      }),
    ]);

  const activeCategories = categoriesWithProducts.filter(
    (c) => c.products.length > 0
  );

  // Serialize Prisma Decimal → number before crossing server→client boundary
  function serProduct(p: (typeof trendingProducts)[0]) {
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      price: Number(p.price),
      salePrice: p.salePrice != null ? Number(p.salePrice) : null,
      viewCount: p.viewCount,
      isFeatured: p.isFeatured,
      images: p.images,
    };
  }

  const trendingSer = trendingProducts.map(serProduct);
  const categoriesSer = activeCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    slug: cat.slug,
    products: cat.products.map(serProduct),
  }));

  // Popular search tags (top categories + some static keywords)
  const popularTags = categories.slice(0, 5).map((c) => c.name);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* ── Hero ────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-stone-900 via-stone-800 to-amber-950 overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-32 -left-16 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          {/* Eyebrow */}
          <p className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold tracking-widest uppercase mb-4 animate-fade-in">
            <span className="w-6 h-px bg-amber-400/60" />
            Aaram Living
            <span className="w-6 h-px bg-amber-400/60" />
          </p>

          {/* Headline */}
          <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight mb-4 animate-fade-in-up delay-75">
            Discover Your Perfect
            <br />
            <span className="text-amber-400">Home Essentials</span>
          </h1>

          <p className="text-stone-400 text-base md:text-lg mb-8 max-w-xl mx-auto animate-fade-in-up delay-150">
            Curated home & lifestyle products — delivered with care across Bangladesh.
          </p>

          {/* Search bar */}
          <div className="animate-fade-in-up delay-225 max-w-2xl mx-auto">
            <SearchBar />
          </div>

          {/* Popular tags */}
          {popularTags.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 animate-fade-in-up delay-300">
              <span className="text-stone-500 text-xs">Popular:</span>
              {popularTags.map((tag) => (
                <Link
                  key={tag}
                  href={`/products?q=${encodeURIComponent(tag)}`}
                  className="text-xs text-stone-400 hover:text-amber-400 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full border border-white/10"
                >
                  {tag}
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Category Strip ──────────────────────────── */}
      {categories.length > 0 && (
        <section className="bg-white border-b border-stone-100 sticky top-16 z-30 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <CategoryStrip categories={categories} />
          </div>
        </section>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* ── Trending Now ──────────────────────────── */}
        {trendingSer.length > 0 && (
          <ProductCarousel
            title="Trending Now"
            emoji="🔥"
            products={trendingSer}
            viewAllHref="/products"
          />
        )}

        {/* ── Per-category carousels ─────────────────── */}
        {categoriesSer.map((cat, idx) => (
          <div
            key={cat.id}
            className="animate-fade-in-up"
            style={{ animationDelay: `${idx * 80}ms` }}
          >
            <ProductCarousel
              title={cat.name}
              emoji="📦"
              products={cat.products}
              viewAllHref={`/products?category=${cat.slug}`}
            />
          </div>
        ))}

        {/* ── Empty state ───────────────────────────── */}
        {trendingSer.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🏡</div>
            <h2 className="text-xl font-bold text-stone-700 mb-2">
              Products coming soon
            </h2>
            <p className="text-stone-400 text-sm mb-6">
              Check back shortly — we are stocking up.
            </p>
            <Link
              href="/products"
              className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
            >
              Browse All Products
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
