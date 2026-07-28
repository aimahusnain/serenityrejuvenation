import { auth } from "@/lib/auth";
import { SessionProvider } from "next-auth/react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
    <div className="antialiased bg-white dark:bg-[#271024]">
    <SessionProvider session={session}>
      <ProductsProvider initialProducts={products}>
        <Header />
        {children}
        <Footer />
      </ProductsProvider>
    </SessionProvider>
    </div>
  );
}