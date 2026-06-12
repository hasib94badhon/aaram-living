import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function AdminDashboard() {
  await verifyAdmin();

  const [
    totalProducts,
    activeProducts,
    hiddenProducts,
    totalCategories,
    activeCategories,
    orderCount,
    userCount,
    pendingOrders,
    topProduct,
    topCategory,
    recentOrders,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.product.count({ where: { isActive: true } }),
    prisma.product.count({ where: { isActive: false } }),
    prisma.category.count(),
    prisma.category.count({ where: { isActive: true } }),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.product.findFirst({
      where: { isActive: true },
      orderBy: { viewCount: "desc" },
      select: { name: true, viewCount: true, slug: true },
    }),
    prisma.category.findFirst({
      where: { isActive: true },
      orderBy: { viewCount: "desc" },
      select: { name: true, viewCount: true, slug: true },
    }),
    prisma.order.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* ── Primary stats ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Products" value={totalProducts} href="/admin/products" />
        <StatCard label="Orders" value={orderCount} href="/admin/orders" />
        <StatCard label="Customers" value={userCount} />
        <StatCard
          label="Pending Orders"
          value={pendingOrders}
          href="/admin/orders"
          highlight={pendingOrders > 0}
        />
      </div>

      {/* ── Product visibility stats ───────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Products" value={activeProducts} href="/admin/products" color="green" />
        <StatCard label="Hidden Products" value={hiddenProducts} href="/admin/products" color={hiddenProducts > 0 ? "red" : undefined} />
        <StatCard label="Active Categories" value={activeCategories} href="/admin/categories" color="green" />
        <StatCard label="Total Categories" value={totalCategories} href="/admin/categories" />
      </div>

      {/* ── Top performers ────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Most Viewed Product
          </p>
          {topProduct ? (
            <div>
              <p className="font-semibold text-gray-900 truncate">{topProduct.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {topProduct.viewCount.toLocaleString()} views
              </p>
              <Link
                href={`/products/${topProduct.slug}`}
                target="_blank"
                className="text-xs text-indigo-600 hover:underline mt-2 inline-block"
              >
                View in store →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No products yet.</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
            Most Popular Category
          </p>
          {topCategory ? (
            <div>
              <p className="font-semibold text-gray-900">{topCategory.name}</p>
              <p className="text-sm text-gray-500 mt-0.5">
                {topCategory.viewCount.toLocaleString()} views
              </p>
              <Link
                href={`/products?category=${topCategory.slug}`}
                target="_blank"
                className="text-xs text-indigo-600 hover:underline mt-2 inline-block"
              >
                View in store →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-gray-400">No categories yet.</p>
          )}
        </div>
      </div>

      {/* ── Recent orders ─────────────────────────────── */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-gray-800">Recent Orders</h2>
          <Link href="/admin/orders" className="text-sm text-indigo-600 hover:underline">
            View all
          </Link>
        </div>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-gray-400">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2 font-medium">Order #</th>
                <th className="pb-2 font-medium">Customer</th>
                <th className="pb-2 font-medium">Total</th>
                <th className="pb-2 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((o) => (
                <tr key={o.id}>
                  <td className="py-2 font-mono text-xs">{o.orderNumber}</td>
                  <td className="py-2">{o.user.name}</td>
                  <td className="py-2">৳{Number(o.total).toLocaleString()}</td>
                  <td className="py-2">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  href,
  highlight,
  color,
}: {
  label: string;
  value: number;
  href?: string;
  highlight?: boolean;
  color?: "green" | "red";
}) {
  const valueColor =
    highlight || color === "red"
      ? "text-red-500"
      : color === "green"
      ? "text-green-600"
      : "text-gray-900";

  const card = (
    <div
      className={`bg-white rounded-xl shadow-sm p-5 ${
        highlight ? "border-2 border-orange-400" : ""
      }`}
    >
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-3xl font-bold mt-1 ${valueColor}`}>{value}</p>
    </div>
  );
  return href ? <Link href={href}>{card}</Link> : card;
}

function StatusBadge({ status }: { status: string }) {
  const colours: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PROCESSING: "bg-purple-100 text-purple-800",
    SHIPPED: "bg-indigo-100 text-indigo-800",
    DELIVERED: "bg-green-100 text-green-800",
    CANCELLED: "bg-red-100 text-red-800",
    REFUNDED: "bg-gray-100 text-gray-800",
  };
  return (
    <span
      className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colours[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {status}
    </span>
  );
}
