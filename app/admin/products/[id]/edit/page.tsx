import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import Link from "next/link";
import { redirect } from "next/navigation";
import EditProductForm from "./edit-product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await verifyAdmin();

  const { id } = await params;
  const productId = parseInt(id);

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id: productId },
      include: {
        images: {
          orderBy: [{ sortOrder: "asc" }, { id: "asc" }],
          // No take limit — load all images
        },
      },
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true },
    }),
  ]);

  if (!product) redirect("/admin/products");

  return (
    <div className="max-w-2xl space-y-4">
      <div className="flex items-center gap-3">
        <Link href="/admin/products" className="text-gray-400 hover:text-gray-600 text-sm">
          ← Products
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      </div>

      <EditProductForm
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description ?? "",
          categoryId: product.categoryId,
          price: Number(product.price),
          salePrice: product.salePrice ? Number(product.salePrice) : null,
          stock: product.stock,
          sku: product.sku ?? "",
          isActive: product.isActive,
          isFeatured: product.isFeatured,
          images: product.images.map((img) => ({
            id: img.id,
            url: img.url,
            mediaType: img.mediaType,
            isPrimary: img.isPrimary,
            sortOrder: img.sortOrder,
          })),
        }}
        categories={categories}
      />
    </div>
  );
}
