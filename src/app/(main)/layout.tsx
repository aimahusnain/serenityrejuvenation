import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import MainLayoutChrome from "@/components/MainLayoutChrome";
import { ProductsProvider } from "@/components/ProductsProvider";
import { prisma } from "@/lib/prisma";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  const session = await auth();

  return (
    <SessionProvider session={session}>
      <ProductsProvider initialProducts={products}>
        <MainLayoutChrome>{children}</MainLayoutChrome>
      </ProductsProvider>
    </SessionProvider>
  );
}