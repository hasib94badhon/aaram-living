import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { deleteProduct } from "@/app/actions/admin";
import { ConfirmDeleteButton } from "@/app/admin/_components/confirm-delete-button";
import { ProductToggleButton } from "./_components/product-toggle-button";
import Image from "next/image";

export default async function ProductsPage() {
  await verifyAdmin();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      images: { where: { isPrimary: true }, take: 1 },
    },
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors"
        >
          + Add Product
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-gray-400 mb-4">No products yet.</p>
            <Link
              href="/admin/products/new"
              className="text-indigo-600 font-medium hover:underline"
            >
              Add your first product →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr className="text-left text-gray-500">
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price (৳)</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 font-medium">Views</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className={`hover:bg-gray-50 ${!p.isActive ? "opacity-60" : ""}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {p.images[0] ? (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image
                              src={p.images[0].url}
                              alt={p.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{p.name}</p>
                          <p className="text-xs text-gray-400 font-mono">{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.category.name}</td>
                    <td className="px-4 py-3">
                      <span className="font-medium">{Number(p.price).toLocaleString()}</span>
                      {p.salePrice && (
                        <span className="ml-1 text-xs text-green-600">
                          → {Number(p.salePrice).toLocaleString()}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={p.stock === 0 ? "text-red-600 font-medium" : ""}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{p.viewCount.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {p.isActive ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                            Hidden
                          </span>
                        )}
                        {p.isFeatured && (
                          <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                            Featured
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3 whitespace-nowrap">
                        <ProductToggleButton id={p.id} isActive={p.isActive} />
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="text-indigo-600 hover:underline text-sm"
                        >
                          Edit
                        </Link>
                        <ConfirmDeleteButton
                          action={deleteProduct}
                          id={p.id}
                          message={`Delete "${p.name}"? This cannot be undone.`}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
