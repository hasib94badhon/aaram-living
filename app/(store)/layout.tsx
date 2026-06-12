import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";
import StoreHeader from "./_components/store-header";
import StoreFooter from "./_components/store-footer";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  let cartCount = 0;

  if (session?.userId) {
    const cart = await prisma.cart.findUnique({
      where: { userId: session.userId },
      include: { _count: { select: { items: true } } },
    });
    cartCount = cart?._count?.items ?? 0;
  }

  return (
    <>
      <StoreHeader
        isLoggedIn={!!session?.userId}
        cartCount={cartCount}
      />
      <main className="flex-1">{children}</main>
      <StoreFooter />
    </>
  );
}
