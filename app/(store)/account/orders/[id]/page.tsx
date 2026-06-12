import { getSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Detail — Aaram Living",
};

const STATUS_COLOURS: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  CONFIRMED: "bg-blue-100 text-blue-800",
  PROCESSING: "bg-purple-100 text-purple-800",
  SHIPPED: "bg-indigo-100 text-indigo-800",
  DELIVERED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
  REFUNDED: "bg-stone-100 text-stone-800",
};

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const order = await prisma.order.findUnique({
    where: { id: Number(id), userId: session.userId },
    include: {
      items: true,
      address: true,
      payment: true,
    },
  });

  if (!order) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/account/orders"
          className="text-sm text-stone-500 hover:text-stone-800 transition-colors"
        >
          ← My Orders
        </Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-3 mb-8">
        <div>
          <h1 className="text-xl font-bold text-stone-900 font-mono">
            {order.orderNumber}
          </h1>
          <p className="text-xs text-stone-400 mt-0.5">
            Placed on{" "}
            {order.createdAt.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${STATUS_COLOURS[order.status]}`}
        >
          {order.status}
        </span>
      </div>

      <div className="space-y-6">
        {/* Order items */}
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-stone-100">
            <h2 className="text-sm font-semibold text-stone-900">Items</h2>
          </div>
          <div className="divide-y divide-stone-100">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="px-5 py-3 flex justify-between items-center text-sm"
              >
                <div>
                  <p className="font-medium text-stone-800">{item.productName}</p>
                  <p className="text-xs text-stone-400">
                    ৳{Number(item.price).toLocaleString()} × {item.quantity}
                  </p>
                </div>
                <span className="font-semibold text-stone-900">
                  ৳{Number(item.subtotal).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <div className="px-5 py-4 bg-stone-50 border-t border-stone-200 space-y-2 text-sm">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>৳{Number(order.subtotal).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-stone-600">
              <span>Shipping</span>
              <span>৳{Number(order.shippingCost).toLocaleString()}</span>
            </div>
            <div className="flex justify-between font-bold text-stone-900 text-base">
              <span>Total</span>
              <span>৳{Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Delivery address */}
        {order.address && (
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-stone-900 mb-3">
              Delivery Address
            </h2>
            <div className="text-sm text-stone-600 space-y-0.5">
              <p className="font-medium text-stone-800">
                {order.address.fullName}
              </p>
              <p>{order.address.phone}</p>
              <p>{order.address.line1}</p>
              <p>
                {order.address.city}, {order.address.district}
              </p>
            </div>
          </div>
        )}

        {/* Payment */}
        {order.payment && (
          <div className="bg-white border border-stone-200 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-stone-900 mb-3">
              Payment
            </h2>
            <div className="text-sm text-stone-600 space-y-1">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium capitalize text-stone-800">
                  {order.payment.method}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Status</span>
                <span
                  className={`font-semibold text-xs px-2 py-0.5 rounded-full ${
                    order.payment.status === "COMPLETED"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}
                >
                  {order.payment.status}
                </span>
              </div>
              {order.payment.bkashNumber && (
                <div className="flex justify-between">
                  <span>bKash No.</span>
                  <span className="font-mono text-stone-800">
                    {order.payment.bkashNumber}
                  </span>
                </div>
              )}
              {order.payment.transactionId && (
                <div className="flex justify-between">
                  <span>Transaction ID</span>
                  <span className="font-mono text-stone-800">
                    {order.payment.transactionId}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {order.notes && (
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-stone-900 mb-2">
              Notes
            </h2>
            <p className="text-sm text-stone-600">{order.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
