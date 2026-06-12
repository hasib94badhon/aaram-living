import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import Link from "next/link";
import NewProductForm from "./new-product-form";

export default async function NewProductPage() {
  await verifyAdmin();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Products
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Add Product</h1>
      </div>

      {categories.length === 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-5 text-sm text-yellow-800">
          You need at least one category before adding products.{" "}
          <Link href="/admin/categories" className="font-semibold underline">
            Create a category →
          </Link>
        </div>
      ) : (
        <NewProductForm categories={categories} />
      )}
    </div>
  );
}
