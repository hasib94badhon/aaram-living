import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import CheckoutForm from "./_components/checkout-form";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout — Aaram Living",
};

export default async function CheckoutPage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const cart = await prisma.cart.findUnique({
    where: { userId: session.userId },
    include: {
      items: {
        include: {
          product: {
            include: { images: { where: { isPrimary: true }, take: 1 } },
          },
        },
      },
    },
  });

  const items = cart?.items ?? [];

  if (items.length === 0) {
    redirect("/cart");
  }

  const subtotal = items.reduce((sum, item) => {
    const price = Number(item.product.salePrice ?? item.product.price);
    return sum + price * item.quantity;
  }, 0);

  const shippingCost = 80;
  const total = subtotal + shippingCost;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Checkout</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Form */}
        <div className="flex-1">
          <CheckoutForm />
        </div>

        {/* Order review */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-6 sticky top-24">
            <h2 className="text-base font-semibold text-stone-900 mb-4">
              Your Order
            </h2>

            <div className="space-y-3 mb-4">
              {items.map((item) => {
                const price = Number(
                  item.product.salePrice ?? item.product.price
                );
                const image = item.product.images[0];
                return (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-200 rounded-lg overflow-hidden shrink-0">
                      {image && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={image.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-stone-800 truncate">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-stone-500">
                        {item.quantity} × ৳{price.toLocaleString()}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-stone-900 shrink-0">
                      ৳{(price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-stone-200 pt-3 space-y-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>৳{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Shipping</span>
                <span>৳{shippingCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-stone-900 text-base pt-1">
                <span>Total</span>
                <span>৳{total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
