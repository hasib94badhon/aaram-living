import prisma from "@/lib/prisma";
import ProductCard from "../_components/product-card";
import CategoryTracker from "./_components/category-tracker";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Products — Aaram Living",
};

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category: categorySlug, q: search } = await searchParams;

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(categorySlug && { category: { slug: categorySlug } }),
        ...(search && {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }),
      },
      include: {
        images: { where: { isPrimary: true }, take: 1 },
        category: { select: { name: true } },
      },
      orderBy: { viewCount: "desc" },
    }),
    prisma.category.findMany({
      where: { parentId: null, isActive: true },
      orderBy: { viewCount: "desc" },
    }),
  ]);

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* Track category view silently */}
      {categorySlug && <CategoryTracker categorySlug={categorySlug} />}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page header */}
        <div className="mb-6 animate-fade-in-up">
          <h1 className="text-2xl font-extrabold text-stone-900">
            {activeCategory ? activeCategory.name : search ? `Results for "${search}"` : "All Products"}
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            {products.length} product{products.length !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-52 shrink-0 animate-fade-in-up delay-75">
            <p className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
              Categories
            </p>
            <ul className="space-y-1">
              <li>
                <Link
                  href="/products"
                  className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                    !categorySlug
                      ? "bg-amber-600 text-white font-semibold"
                      : "text-stone-600 hover:bg-stone-100"
                  }`}
                >
                  <span>🏡 All Products</span>
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.slug}`}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                      cat.slug === categorySlug
                        ? "bg-amber-600 text-white font-semibold"
                        : "text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    <span>{cat.name}</span>
                    {cat.viewCount > 0 && (
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          cat.slug === categorySlug
                            ? "bg-amber-500/60 text-white"
                            : "bg-stone-200 text-stone-500"
                        }`}
                      >
                        {cat.viewCount}
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </aside>

          {/* Product grid */}
          <div className="flex-1">
            {products.length === 0 ? (
              <div className="text-center py-20 text-stone-400 animate-fade-in">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-lg font-medium mb-2">No products found.</p>
                <Link
                  href="/products"
                  className="text-sm text-amber-700 hover:underline font-medium"
                >
                  Clear filters
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {products.map((product, i) => (
                  <div
                    key={product.id}
                    className="animate-fade-in-up"
                    style={{ animationDelay: `${i * 40}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
