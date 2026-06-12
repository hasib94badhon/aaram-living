"use server";

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

type CartActionState = { error?: string; success?: boolean } | undefined;

export async function addToCart(
  _prev: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const session = await getSession();
  if (!session?.userId) {
    redirect("/login");
  }

  const productId = Number(formData.get("productId"));
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));

  if (!productId || isNaN(productId)) {
    return { error: "Invalid product." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
    select: { stock: true, id: true },
  });

  if (!product) return { error: "Product not found." };
  if (product.stock < quantity) return { error: "Not enough stock." };

  const cart = await prisma.cart.upsert({
    where: { userId: session.userId },
    create: { userId: session.userId },
    update: {},
  });

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity: { increment: quantity } },
  });

  revalidatePath("/cart");
  revalidatePath("/");

  return { success: true };
}

export async function updateCartItemQuantity(formData: FormData) {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const cartItemId = Number(formData.get("cartItemId"));
  const quantity = Number(formData.get("quantity"));

  if (quantity < 1) {
    await removeCartItem(formData);
    return;
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity },
  });

  revalidatePath("/cart");
}

export async function removeCartItem(formData: FormData) {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const cartItemId = Number(formData.get("cartItemId"));

  await prisma.cartItem.delete({ where: { id: cartItemId } });

  revalidatePath("/cart");
}

export async function buyNow(
  _prev: CartActionState,
  formData: FormData
): Promise<CartActionState> {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const productId = Number(formData.get("productId"));
  const quantity = Math.max(1, Number(formData.get("quantity") ?? 1));

  if (!productId || isNaN(productId)) return { error: "Invalid product." };

  const product = await prisma.product.findUnique({
    where: { id: productId, isActive: true },
    select: { stock: true },
  });

  if (!product) return { error: "Product not found." };
  if (product.stock < quantity) return { error: "Not enough stock." };

  const cart = await prisma.cart.upsert({
    where: { userId: session.userId },
    create: { userId: session.userId },
    update: {},
  });

  await prisma.cartItem.upsert({
    where: { cartId_productId: { cartId: cart.id, productId } },
    create: { cartId: cart.id, productId, quantity },
    update: { quantity: { increment: quantity } },
  });

  revalidatePath("/cart");
  redirect("/checkout");
}
