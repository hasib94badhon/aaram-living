"use client";

import { useTransition } from "react";
import { updateCartItemQuantity, removeCartItem } from "@/app/actions/cart";
import Image from "next/image";
import Link from "next/link";

type CartItem = {
  id: number;
  quantity: number;
  product: {
    id: number;
    name: string;
    slug: string;
    price: number;
    salePrice: number | null;
    images: { url: string; altText: string | null }[];
  };
};

function CartItemRow({ item }: { item: CartItem }) {
  const [pending, startTransition] = useTransition();
  const price = item.product.salePrice ?? item.product.price;
  const originalPrice = item.product.price;
  const hasDiscount = item.product.salePrice !== null && item.product.salePrice < originalPrice;
  const image = item.product.images[0];
  const lineTotal = price * item.quantity;

  function changeQty(qty: number) {
    const fd = new FormData();
    fd.set("cartItemId", String(item.id));
    fd.set("quantity", String(qty));
    startTransition(() => updateCartItemQuantity(fd));
  }

  function remove() {
    const fd = new FormData();
    fd.set("cartItemId", String(item.id));
    startTransition(() => removeCartItem(fd));
  }

  return (
    <div
      className={`bg-white border border-stone-200 rounded-2xl p-4 flex gap-4 transition-opacity duration-200 ${
        pending ? "opacity-50 pointer-events-none" : ""
      }`}
    >
      {/* Image */}
      <Link
        href={`/products/${item.product.slug}`}
        className="relative shrink-0 w-20 h-20 bg-stone-100 rounded-xl overflow-hidden"
      >
        {image ? (
          <Image
            src={image.url}
            alt={image.altText ?? item.product.name}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-stone-300">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01" />
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
          {/* Quantity controls */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => changeQty(item.quantity - 1)}
              disabled={pending}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-600 text-sm font-bold transition-colors"
            >
              −
            </button>
            <span className="w-8 text-center text-sm font-semibold text-stone-900">
              {pending ? "…" : item.quantity}
            </span>
            <button
              type="button"
              onClick={() => changeQty(item.quantity + 1)}
              disabled={pending}
              className="w-7 h-7 flex items-center justify-center rounded-full bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-600 text-sm font-bold transition-colors"
            >
              +
            </button>
          </div>

          {/* Line total + remove */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-stone-900">
              ৳{lineTotal.toLocaleString()}
            </span>
            <button
              type="button"
              onClick={remove}
              disabled={pending}
              className="text-stone-300 hover:text-red-500 disabled:opacity-40 transition-colors"
              aria-label="Remove"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartClient({ items }: { items: CartItem[] }) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItemRow key={item.id} item={item} />
      ))}
    </div>
  );
}
