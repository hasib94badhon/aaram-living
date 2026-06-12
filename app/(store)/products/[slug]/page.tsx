import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import AddToCartForm from "./_components/add-to-cart-form";
import BuyNowButton from "./_components/buy-now-button";
import ViewTracker from "./_components/view-tracker";
import CarouselCard from "../../_components/carousel-card";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!product) return { title: "Product not found" };
  return {
    title: `${product.name} — Aaram Living`,
    description: product.description ?? undefined,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const [product, relatedProducts] = await Promise.all([
    prisma.product.findUnique({
      where: { slug, isActive: true },
      include: {
        images: { orderBy: [{ isPrimary: "desc" }, { id: "asc" }] },
        category: { select: { name: true, slug: true } },
      },
    }),
    // loaded after product.categoryId is known — handled below
    Promise.resolve(null),
  ]);

  if (!product) notFound();

  // Fetch related products (same category, different product)
  const related = await prisma.product.findMany({
    where: {
      categoryId: product.categoryId,
      isActive: true,
      NOT: { id: product.id },
    },
    include: { images: { where: { isPrimary: true }, take: 1 } },
    orderBy: { viewCount: "desc" },
    take: 8,
  });

  const price = Number(product.price);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  const displayPrice = salePrice ?? price;
  const hasDiscount = salePrice !== null && salePrice < price;
  const discountPct = hasDiscount
    ? Math.round(((price - salePrice!) / price) * 100)
    : 0;
  const inStock = product.stock > 0;
  const primaryImage =
    product.images.find((i) => i.isPrimary) ?? product.images[0];

  // Trending status for badge
  const isTrending = product.viewCount >= 20;
  const isHot = product.viewCount >= 50;

  return (
    <div className="bg-stone-50 min-h-screen">
      {/* View tracker — increments viewCount on mount */}
      <ViewTracker productId={product.id} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-400 mb-8">
          <Link href="/" className="hover:text-stone-600 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            href="/products"
            className="hover:text-stone-600 transition-colors"
          >
            Products
          </Link>
          <span>/</span>
          <Link
            href={`/products?category=${product.category.slug}`}
            className="hover:text-stone-600 transition-colors"
          >
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-stone-700 truncate max-w-[140px]">
            {product.name}
          </span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 animate-fade-in-up">
          {/* ── Images ───────────────────────────── */}
          <div className="space-y-3">
            <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-sm border border-stone-200">
              {primaryImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={primaryImage.url}
                  alt={primaryImage.altText ?? product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-200">
                  <svg
                    className="w-20 h-20"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01"
                    />
                  </svg>
                </div>
              )}

              {/* Hot/Trending overlay */}
              {(isHot || isTrending) && (
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg ${
                      isHot ? "bg-red-500" : "bg-amber-500"
                    }`}
                  >
                    {isHot ? "🔥 Hot" : "📈 Trending"}
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                {product.images.map((img) => (
                  <div
                    key={img.id}
                    className="shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white border border-stone-200 shadow-sm"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url}
                      alt={img.altText ?? ""}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Product info ──────────────────────── */}
          <div>
            <Link
              href={`/products?category=${product.category.slug}`}
              className="text-xs font-bold text-amber-700 uppercase tracking-widest hover:underline"
            >
              {product.category.name}
            </Link>

            <h1 className="text-2xl md:text-3xl font-extrabold text-stone-900 mt-2 mb-3 leading-tight">
              {product.name}
            </h1>

            {/* View count */}
            {product.viewCount > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-4">
                <svg
                  className="w-4 h-4"
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
                <span>
                  {product.viewCount.toLocaleString()} people viewed this
                </span>
                {isHot && (
                  <span className="ml-1 bg-red-100 text-red-600 font-semibold px-2 py-0.5 rounded-full">
                    🔥 High Demand
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-2">
              <span className="text-3xl font-extrabold text-amber-700">
                ৳{displayPrice.toLocaleString()}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-stone-400 line-through">
                    ৳{price.toLocaleString()}
                  </span>
                  <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                    -{discountPct}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <p
              className={`text-sm font-semibold mb-5 ${
                inStock ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {inStock
                ? `✓ In stock (${product.stock} available)`
                : "✗ Out of stock"}
            </p>

            {/* Description */}
            {product.description && (
              <p className="text-stone-600 text-sm leading-relaxed mb-6 border-t border-stone-100 pt-5">
                {product.description}
              </p>
            )}

            {/* CTA buttons */}
            {inStock ? (
              <div className="space-y-3">
                {/* Add to Cart */}
                <AddToCartForm productId={product.id} />

                {/* Buy Now */}
                <BuyNowButton productId={product.id} />
              </div>
            ) : (
              <button
                disabled
                className="w-full bg-stone-200 text-stone-400 py-3 rounded-full font-semibold cursor-not-allowed text-sm"
              >
                Out of Stock
              </button>
            )}

            {/* SKU */}
            {product.sku && (
              <p className="mt-5 text-xs text-stone-400">
                SKU: {product.sku}
              </p>
            )}
          </div>
        </div>

        {/* ── Related products ───────────────────── */}
        {related.length > 0 && (
          <div className="mt-14 animate-fade-in-up delay-300">
            <h2 className="text-lg font-bold text-stone-900 mb-5 flex items-center gap-2">
              ✨ You Might Also Like
            </h2>
            <div className="flex gap-3.5 overflow-x-auto scrollbar-hide snap-x scroll-smooth pb-2">
              {related.map((p) => (
                <CarouselCard
                  key={p.id}
                  product={{
                    id: p.id,
                    name: p.name,
                    slug: p.slug,
                    price: Number(p.price),
                    salePrice: p.salePrice != null ? Number(p.salePrice) : null,
                    viewCount: p.viewCount,
                    isFeatured: p.isFeatured,
                    images: p.images,
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
