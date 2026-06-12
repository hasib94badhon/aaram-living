"use server";

import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import prisma from "@/lib/prisma";

type CheckoutState =
  | { error: string; success?: never }
  | { success: true; orderNumber: string; error?: never }
  | undefined;

function generateOrderNumber(): string {
  const date = new Date();
  const ymd =
    date.getFullYear().toString() +
    String(date.getMonth() + 1).padStart(2, "0") +
    String(date.getDate()).padStart(2, "0");
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `AL-${ymd}-${rand}`;
}

export async function placeOrder(
  _prev: CheckoutState,
  formData: FormData
): Promise<CheckoutState> {
  const session = await getSession();
  if (!session?.userId) redirect("/login");

  const fullName = (formData.get("fullName") as string)?.trim();
  const phone = (formData.get("phone") as string)?.trim();
  const line1 = (formData.get("line1") as string)?.trim();
  const city = (formData.get("city") as string)?.trim();
  const district = (formData.get("district") as string)?.trim();
  const bkashNumber = (formData.get("bkashNumber") as string)?.trim();
  const transactionId = (formData.get("transactionId") as string)?.trim();
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!fullName || !phone || !line1 || !city || !district) {
    return { error: "Please fill in all required address fields." };
  }

  if (!bkashNumber || !transactionId) {
    return {
      error: "Please enter your bKash number and transaction ID.",
    };
  }

  // Load cart
  const cart = await prisma.cart.findUnique({
    where: { userId: session.userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              salePrice: true,
              stock: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return { error: "Your cart is empty." };
  }

  // Verify stock
  for (const item of cart.items) {
    if (item.product.stock < item.quantity) {
      return {
        error: `"${item.product.name}" only has ${item.product.stock} in stock.`,
      };
    }
  }

  const shippingCost = 80;
  const subtotal = cart.items.reduce((sum, item) => {
    const price = Number(item.product.salePrice ?? item.product.price);
    return sum + price * item.quantity;
  }, 0);
  const total = subtotal + shippingCost;

  const orderNumber = generateOrderNumber();

  // Create order, address, payment in a transaction
  await prisma.$transaction(async (tx) => {
    const address = await tx.address.create({
      data: {
        userId: session.userId,
        fullName,
        phone,
        line1,
        city,
        district,
      },
    });

    const order = await tx.order.create({
      data: {
        orderNumber,
        userId: session.userId,
        addressId: address.id,
        subtotal,
        shippingCost,
        total,
        notes,
        items: {
          create: cart.items.map((item) => {
            const price = Number(item.product.salePrice ?? item.product.price);
            return {
              productId: item.product.id,
              productName: item.product.name,
              price,
              quantity: item.quantity,
              subtotal: price * item.quantity,
            };
          }),
        },
      },
    });

    await tx.payment.create({
      data: {
        orderId: order.id,
        method: "bkash",
        status: "PENDING",
        amount: total,
        bkashNumber,
        transactionId,
      },
    });

    // Decrement stock
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.product.id },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });
  });

  return { success: true, orderNumber };
}
