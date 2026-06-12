import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { deleteCategory, toggleCategoryVisibility } from "@/app/actions/admin";
import { ConfirmDeleteButton } from "@/app/admin/_components/confirm-delete-button";
import AddCategoryForm from "./add-category-form";

export default async function CategoriesPage() {
  await verifyAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      parent: { select: { name: true } },
      _count: { select: { products: true } },
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Categories</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category list */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm overflow-hidden">
          {categories.length === 0 ? (
            <div className="p-10 text-center text-gray-400 text-sm">
              No categories yet. Add one using the form.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr className="text-left text-gray-500">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Parent</th>
                    <th className="px-4 py-3 font-medium">Products</th>
                    <th className="px-4 py-3 font-medium">Views</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {categories.map((cat) => (
                    <tr key={cat.id} className={`hover:bg-gray-50 ${!cat.isActive ? "opacity-60" : ""}`}>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{cat.name}</p>
                        <p className="text-xs text-gray-400 font-mono">{cat.slug}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {cat.parent?.name ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{cat._count.products}</td>
                      <td className="px-4 py-3 text-gray-500">{cat.viewCount.toLocaleString()}</td>
                      <td className="px-4 py-3">
                        {cat.isActive ? (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Active
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
                            Hidden
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3 whitespace-nowrap">
                          {/* Visibility toggle */}
                          <form action={toggleCategoryVisibility}>
                            <input type="hidden" name="id" value={cat.id} />
                            <button
                              type="submit"
                              title={cat.isActive ? "Hide from store" : "Show in store"}
                              className={`text-xs font-medium px-2.5 py-1 rounded-lg border transition-colors ${
                                cat.isActive
                                  ? "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-600 hover:bg-red-50"
                                  : "border-green-300 text-green-700 hover:bg-green-50"
                              }`}
                            >
                              {cat.isActive ? "Hide" : "Show"}
                            </button>
                          </form>
                          <Link
                            href={`/admin/categories/${cat.id}/edit`}
                            className="text-indigo-600 hover:underline text-sm"
                          >
                            Edit
                          </Link>
                          <ConfirmDeleteButton
                            action={deleteCategory}
                            id={cat.id}
                            message={`Delete category "${cat.name}"?`}
                            disabled={cat._count.products > 0}
                            disabledTitle="Cannot delete — has products"
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

        {/* Add category form */}
        <div>
          <AddCategoryForm categories={categories.map((c) => ({ id: c.id, name: c.name }))} />
        </div>
      </div>
    </div>
  );
}
