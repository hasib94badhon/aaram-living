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
            select: {
              name: true,
              price: true,
              salePrice: true,
              stock: true,
              id: true,
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { url: true },
              },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) redirect("/cart");

  // Convert Prisma Decimal to plain numbers before passing to client component
  const items = cart.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    product: {
      name: item.product.name,
      price: Number(item.product.price),
      salePrice: item.product.salePrice ? Number(item.product.salePrice) : null,
      imageUrl: item.product.images[0]?.url ?? null,
    },
  }));

  const subtotal = items.reduce((sum, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return sum + price * item.quantity;
  }, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-2xl font-bold text-stone-900 mb-8">Checkout</h1>
      <CheckoutForm items={items} subtotal={subtotal} />
    </div>
  );
}
