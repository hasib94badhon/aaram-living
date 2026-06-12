"use client";

import { useActionState } from "react";
import { buyNow } from "@/app/actions/cart";

export default function BuyNowButton({
  productId,
  quantity,
}: {
  productId: number;
  quantity?: number;
}) {
  const [state, action, pending] = useActionState(buyNow, undefined);

  return (
    <form action={action}>
      <input type="hidden" name="productId" value={productId} />
      <input type="hidden" name="quantity" value={quantity ?? 1} />
      {state?.error && (
        <p className="text-xs text-red-600 mb-2">{state.error}</p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="w-full bg-stone-900 hover:bg-stone-800 disabled:opacity-60 text-white font-semibold py-3 rounded-full transition-colors text-sm"
      >
        {pending ? "Redirecting…" : "Buy Now"}
      </button>
    </form>
  );
}
