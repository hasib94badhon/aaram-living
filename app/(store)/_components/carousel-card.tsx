import Link from "next/link";
import Image from "next/image";

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

export default function CarouselCard({
  product,
  size = "normal",
}: {
  product: CarouselProduct;
  size?: "normal" | "large";
}) {
  const price = Number(product.price);
  const salePrice = product.salePrice ? Number(product.salePrice) : null;
  const displayPrice = salePrice ?? price;
  const hasDiscount = salePrice !== null && salePrice < price;
  const discountPct = hasDiscount
    ? Math.round(((price - salePrice!) / price) * 100)
    : 0;
  const image = product.images[0];
  const isTrending = product.viewCount >= 20;
  const isHot = product.viewCount >= 50;

  const width = size === "large" ? "w-56" : "w-44";

  return (
    <Link
      href={`/products/${product.slug}`}
      className={`${width} shrink-0 snap-start group block bg-white rounded-2xl overflow-hidden border border-stone-200 hover:border-amber-300 card-hover`}
    >
      {/* Image */}
      <div className="relative aspect-square bg-stone-100 overflow-hidden">
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? product.name}
            fill
            sizes="(max-width: 640px) 176px, 224px"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-200">
            <svg
              className="w-10 h-10"
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

        {/* Top-left badge */}
        {isHot ? (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            🔥 Hot
          </span>
        ) : isTrending ? (
          <span className="absolute top-2 left-2 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            📈 Trending
          </span>
        ) : hasDiscount ? (
          <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
            -{discountPct}%
          </span>
        ) : null}

        {/* View count badge */}
        {product.viewCount > 0 && (
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded-full flex items-center gap-1">
            <svg
              className="w-2.5 h-2.5"
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
            {product.viewCount >= 1000
              ? `${(product.viewCount / 1000).toFixed(1)}k`
              : product.viewCount}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <p className="text-xs font-medium text-stone-900 line-clamp-2 leading-snug mb-1.5 group-hover:text-amber-700 transition-colors">
          {product.name}
        </p>
        <div className="flex items-baseline gap-1.5">
          <span className="text-sm font-bold text-amber-700">
            ৳{displayPrice.toLocaleString()}
          </span>
          {hasDiscount && (
            <span className="text-[10px] text-stone-400 line-through">
              ৳{price.toLocaleString()}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
