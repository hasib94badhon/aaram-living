"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/dal";
import { OrderStatus } from "@prisma/client";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function toSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

type FieldErrors = { errors?: Record<string, string[]> } | undefined;

// ─── Products ─────────────────────────────────────────────────────────────────

type MediaPayload = {
  url: string;
  mediaType: string;
  isPrimary: boolean;
  sortOrder: number;
};

function parseMediaJson(raw: string | null): MediaPayload[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (m) =>
        typeof m.url === "string" &&
        m.url.startsWith("http") &&
        (m.mediaType === "image" || m.mediaType === "video")
    );
  } catch {
    return [];
  }
}

export async function createProduct(
  _state: FieldErrors,
  formData: FormData
): Promise<FieldErrors> {
  await verifyAdmin();

  const name = (formData.get("name") as string)?.trim();
  const slug =
    (formData.get("slug") as string)?.trim() || toSlug(name ?? "");
  const description =
    (formData.get("description") as string)?.trim() || null;
  const categoryId = parseInt(formData.get("categoryId") as string);
  const price = parseFloat(formData.get("price") as string);
  const salePriceRaw = (formData.get("salePrice") as string)?.trim();
  const salePrice = salePriceRaw ? parseFloat(salePriceRaw) : null;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const sku = (formData.get("sku") as string)?.trim() || null;
  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const mediaItems = parseMediaJson(formData.get("mediaJson") as string | null);

  const errors: Record<string, string[]> = {};
  if (!name) errors.name = ["Product name is required"];
  if (!slug) errors.slug = ["Slug is required"];
  if (isNaN(categoryId)) errors.categoryId = ["Please select a category"];
  if (isNaN(price) || price <= 0) errors.price = ["Enter a valid price"];
  if (Object.keys(errors).length > 0) return { errors };

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing) return { errors: { slug: ["This slug is already taken"] } };

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      salePrice,
      stock,
      sku,
      isActive,
      isFeatured,
      categoryId,
      ...(mediaItems.length > 0
        ? {
            images: {
              create: mediaItems.map((m) => ({
                url: m.url,
                mediaType: m.mediaType,
                isPrimary: m.isPrimary,
                sortOrder: m.sortOrder,
              })),
            },
          }
        : {}),
    },
  });

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(
  _state: FieldErrors,
  formData: FormData
): Promise<FieldErrors> {
  await verifyAdmin();

  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description =
    (formData.get("description") as string)?.trim() || null;
  const categoryId = parseInt(formData.get("categoryId") as string);
  const price = parseFloat(formData.get("price") as string);
  const salePriceRaw = (formData.get("salePrice") as string)?.trim();
  const salePrice = salePriceRaw ? parseFloat(salePriceRaw) : null;
  const stock = parseInt(formData.get("stock") as string) || 0;
  const sku = (formData.get("sku") as string)?.trim() || null;
  const isActive = formData.get("isActive") === "on";
  const isFeatured = formData.get("isFeatured") === "on";
  const mediaItems = parseMediaJson(formData.get("mediaJson") as string | null);

  const errors: Record<string, string[]> = {};
  if (!name) errors.name = ["Product name is required"];
  if (!slug) errors.slug = ["Slug is required"];
  if (isNaN(categoryId)) errors.categoryId = ["Please select a category"];
  if (isNaN(price) || price <= 0) errors.price = ["Enter a valid price"];
  if (Object.keys(errors).length > 0) return { errors };

  const existing = await prisma.product.findUnique({ where: { slug } });
  if (existing && existing.id !== id)
    return { errors: { slug: ["This slug is already taken"] } };

  await prisma.product.update({
    where: { id },
    data: { name, slug, description, price, salePrice, stock, sku, isActive, isFeatured, categoryId },
  });

  // The MediaUploader already deleted removed images via /api/admin/upload/delete.
  // Here we only need to sync the final state: delete any remaining DB records
  // and recreate from the authoritative mediaJson list.
  await prisma.productImage.deleteMany({ where: { productId: id } });
  if (mediaItems.length > 0) {
    await prisma.productImage.createMany({
      data: mediaItems.map((m) => ({
        url: m.url,
        mediaType: m.mediaType,
        isPrimary: m.isPrimary,
        sortOrder: m.sortOrder,
        productId: id,
      })),
    });
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData): Promise<void> {
  await verifyAdmin();
  const id = parseInt(formData.get("id") as string);
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
}

export async function toggleProductVisibility(formData: FormData): Promise<void> {
  await verifyAdmin();
  const id = parseInt(formData.get("id") as string);
  const current = await prisma.product.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!current) return;
  await prisma.product.update({
    where: { id },
    data: { isActive: !current.isActive },
  });
  revalidatePath("/admin/products");
  revalidatePath("/");
  revalidatePath("/products");
}

// ─── Categories ───────────────────────────────────────────────────────────────

type CategoryState =
  | { errors?: Record<string, string[]>; success?: boolean }
  | undefined;

export async function createCategory(
  _state: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  await verifyAdmin();

  const name = (formData.get("name") as string)?.trim();
  const slug =
    (formData.get("slug") as string)?.trim() || toSlug(name ?? "");
  const description = (formData.get("description") as string)?.trim() || null;
  const parentIdRaw = (formData.get("parentId") as string)?.trim();
  const parentId = parentIdRaw ? parseInt(parentIdRaw) : null;
  const isActive = formData.get("isActive") === "on";

  if (!name) return { errors: { name: ["Category name is required"] } };

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing) return { errors: { slug: ["This slug is already taken"] } };

  await prisma.category.create({ data: { name, slug, description, parentId, isActive } });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/products");
  return { success: true };
}

export async function updateCategory(
  _state: CategoryState,
  formData: FormData
): Promise<CategoryState> {
  await verifyAdmin();

  const id = parseInt(formData.get("id") as string);
  const name = (formData.get("name") as string)?.trim();
  const slug = (formData.get("slug") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const isActive = formData.get("isActive") === "on";

  if (!name) return { errors: { name: ["Category name is required"] } };
  if (!slug) return { errors: { slug: ["Slug is required"] } };

  const existing = await prisma.category.findUnique({ where: { slug } });
  if (existing && existing.id !== id)
    return { errors: { slug: ["This slug is already taken"] } };

  await prisma.category.update({
    where: { id },
    data: { name, slug, description, isActive },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/products");
  redirect("/admin/categories");
}

export async function deleteCategory(formData: FormData): Promise<void> {
  await verifyAdmin();
  const id = parseInt(formData.get("id") as string);
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/products");
}

export async function toggleCategoryVisibility(formData: FormData): Promise<void> {
  await verifyAdmin();
  const id = parseInt(formData.get("id") as string);
  const current = await prisma.category.findUnique({
    where: { id },
    select: { isActive: true },
  });
  if (!current) return;
  await prisma.category.update({
    where: { id },
    data: { isActive: !current.isActive },
  });
  revalidatePath("/admin/categories");
  revalidatePath("/");
  revalidatePath("/products");
}

// ─── Orders ───────────────────────────────────────────────────────────────────

export async function updateOrderStatus(formData: FormData): Promise<void> {
  await verifyAdmin();
  const orderId = parseInt(formData.get("orderId") as string);
  const status = formData.get("status") as OrderStatus;

  const valid = Object.values(OrderStatus);
  if (!valid.includes(status)) return;

  await prisma.order.update({ where: { id: orderId }, data: { status } });
  revalidatePath("/admin/orders");
}
