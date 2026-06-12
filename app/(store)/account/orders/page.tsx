import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";
import type { Metadata } from "next";
import { logout } from "@/app/actions/auth";

export const metadata: Metadata = {
  title: "My Orders — Aaram Living",
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

export default async function MyOrdersPage() {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.userId },
      select: { name: true, email: true },
    }),
    prisma.order.findMany({
      where: { userId: session.userId },
      include: {
        items: { select: { productName: true, quantity: true, subtotal: true } },
        payment: { select: { status: true, transactionId: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Account header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">My Orders</h1>
          <p className="text-stone-500 text-sm mt-0.5">{user?.email}</p>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-stone-500 hover:text-red-600 transition-colors font-medium"
          >
            Logout
          </button>
        </form>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-stone-50 rounded-2xl border border-stone-200">
          <p className="text-stone-400 mb-4">You have no orders yet.</p>
          <Link
            href="/products"
            className="inline-block bg-amber-600 hover:bg-amber-700 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border border-stone-200 rounded-2xl p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div>
                  <p className="font-mono text-sm font-bold text-stone-900">
                    {order.orderNumber}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {order.createdAt.toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLOURS[order.status]}`}
                  >
                    {order.status}
                  </span>
                  {order.payment && (
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        order.payment.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      Payment: {order.payment.status}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-sm text-stone-600 space-y-0.5 mb-3">
                {order.items.map((item, i) => (
                  <p key={i}>
                    {item.productName}{" "}
                    <span className="text-stone-400">× {item.quantity}</span>
                  </p>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-stone-900">
                  Total: ৳{Number(order.total).toLocaleString()}
                </span>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="text-xs font-medium text-amber-700 hover:underline"
                >
                  View Details →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
