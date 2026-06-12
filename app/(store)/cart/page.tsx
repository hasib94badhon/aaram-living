import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import Link from "next/link";
import CartClient from "./_components/cart-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cart — Aaram Living",
};

export default async function CartPage() {
  const session = await getSession();

  if (!session?.userId) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-stone-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          Please log in to view your cart or continue shopping.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/login"
            className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
          >
            Login
          </Link>
          <Link
            href="/products"
            className="bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session.userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
        orderBy: { id: "asc" },
      },
    },
  });

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-stone-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">
          Your cart is empty
        </h2>
        <p className="text-stone-500 text-sm mb-6">
          Looks like you have not added anything yet.
        </p>
        <Link
          href="/products"
          className="bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-full transition-colors text-sm"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  // Serialize Decimal → number before passing to CartClient (client component)
  const itemsSer = items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: {
      id: item.product.id,
      name: item.product.name,
      slug: item.product.slug,
      price: Number(item.product.price),
      salePrice: item.product.salePrice != null ? Number(item.product.salePrice) : null,
      images: item.product.images,
    },
  }));

  const subtotal = itemsSer.reduce((sum, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  const shippingCost = 80;
  const total = subtotal + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">
        Shopping Cart
        <span className="ml-2 text-base font-normal text-stone-400">
          ({items.length} item{items.length !== 1 ? "s" : ""})
        </span>
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1">
          <CartClient items={itemsSer} />
        </div>

        {/* Order summary */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sticky top-24">
            <h2 className="text-base font-semibold text-stone-900 mb-4">
              Order Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>৳{shippingCost.toLocaleString()}</span>
              </div>
              <div className="border-t border-stone-200 pt-3 flex justify-between font-bold text-stone-900 text-base">
                <span>Total</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
            </div>

            <Link
              href="/checkout"
              className="mt-6 w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-full text-sm text-center transition-colors block"
            >
              Proceed to Checkout
            </Link>

            <Link
              href="/products"
              className="mt-3 w-full bg-transparent text-stone-600 hover:text-stone-900 font-medium py-2 rounded-full text-sm text-center transition-colors block"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
