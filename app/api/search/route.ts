import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json({ products: [], categories: [] });
  }

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { category: { name: { contains: q } } },
        ],
      },
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        viewCount: true,
        images: { where: { isPrimary: true }, take: 1, select: { url: true } },
        category: { select: { name: true } },
      },
      orderBy: { viewCount: "desc" },
      take: 7,
    }),
    prisma.category.findMany({
      where: { name: { contains: q }, isActive: true },
      select: { id: true, name: true, slug: true, viewCount: true },
      orderBy: { viewCount: "desc" },
      take: 3,
    }),
  ]);

  return NextResponse.json({ products, categories });
}
