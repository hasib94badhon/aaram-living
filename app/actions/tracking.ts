"use server";

import prisma from "@/lib/prisma";

export async function incrementProductView(productId: number) {
  await prisma.product.update({
    where: { id: productId },
    data: { viewCount: { increment: 1 } },
  });
}

export async function incrementCategoryView(categorySlug: string) {
  await prisma.category.update({
    where: { slug: categorySlug },
    data: { viewCount: { increment: 1 } },
  });
}
