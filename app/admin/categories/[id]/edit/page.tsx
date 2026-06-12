import { verifyAdmin } from "@/lib/dal";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import EditCategoryForm from "./edit-category-form";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await verifyAdmin();

  const { id: idStr } = await params;
  const id = parseInt(idStr);

  const category = await prisma.category.findUnique({
    where: { id },
    select: { id: true, name: true, slug: true, description: true, isActive: true },
  });

  if (!category) notFound();

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Category</h1>
        <p className="text-sm text-gray-500 mt-0.5">{category.name}</p>
      </div>
      <EditCategoryForm category={category} />
    </div>
  );
}
