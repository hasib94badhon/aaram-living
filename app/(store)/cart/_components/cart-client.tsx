"use client";

import { updateCartItemQuantity, removeCartItem } from "@/app/actions/cart";
import Link from "next/link";

type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: { toString(): string } | number;
    salePrice: { toString(): string } | number | null;
    images: { url: string; altText: string | null }[];
  };
};

export default function CartClient({ items }: { items: CartItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => {
        const price = Number(item.product.salePrice ?? item.product.price);
        const originalPrice = Number(item.product.price);
        const hasDiscount =
          item.product.salePrice !== null &&
          Number(item.product.salePrice) < originalPrice;
        const image = item.product.images[0];
        const lineTotal = price * item.quantity;

        return (
          <div
            key={item.id}
            className="bg-white border border-stone-200 rounded-2xl p-4 flex gap-4"
          >
            {/* Image */}
            <Link
              href={`/products/${item.product.slug}`}
              className="shrink-0 w-20 h-20 bg-stone-100 rounded-xl overflow-hidden"
            >
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={image.url}
                  alt={image.altText ?? item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-stone-300">
                  <svg
                    className="w-8 h-8"
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
            </Link>

            {/* Details */}
            <div className="flex-1 min-w-0">
              <Link
                href={`/products/${item.product.slug}`}
                className="font-semibold text-stone-900 text-sm hover:text-amber-700 line-clamp-2"
              >
                {item.product.name}
              </Link>

              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-sm font-bold text-amber-700">
                  ৳{price.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-stone-400 line-through">
                    ৳{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between mt-3 gap-2">
                {/* Quantity form */}
                <form action={updateCartItemQuantity} className="flex items-center gap-1">
                  <input type="hidden" name="cartItemId" value={item.id} />
                  <button
                    type="submit"
                    name="quantity"
                    value={item.quantity - 1}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-bold transition-colors"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-stone-900">
                    {item.quantity}
                  </span>
                  <button
                    type="submit"
                    name="quantity"
                    value={item.quantity + 1}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 text-sm font-bold transition-colors"
                  >
                    +
                  </button>
                </form>

                {/* Line total + remove */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-stone-900">
                    ৳{lineTotal.toLocaleString()}
                  </span>
                  <form action={removeCartItem}>
                    <input type="hidden" name="cartItemId" value={item.id} />
                    <button
                      type="submit"
                      className="text-stone-300 hover:text-red-500 transition-colors"
                      aria-label="Remove"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
