"use client";

import { useActionState } from "react";
import { addToCart } from "@/app/actions/cart";

export default function AddToCartForm({ productId }: { productId: number }) {
  const [state, action, pending] = useActionState(addToCart, undefined);

  return (
    <form action={action} className="space-y-4">
      <input type="hidden" name="productId" value={productId} />

      <div className="flex items-center gap-3">
        <label className="text-sm font-medium text-stone-700">Qty:</label>
        <input
          type="number"
          name="quantity"
          defaultValue={1}
          min={1}
          max={99}
          className="w-20 border border-stone-300 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>

      {state?.error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 px-3 py-2 rounded-lg">
          {state.error}
        </p>
      )}

      {state?.success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 px-3 py-2 rounded-lg">
          ✓ Added to cart!
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors flex items-center justify-center gap-2"
      >
        {pending ? (
          "Adding…"
        ) : (
          <>
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
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Add to Cart
          </>
        )}
      </button>
    </form>
  );
}
