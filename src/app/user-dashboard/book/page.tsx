import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { BookAppointmentPage } from "@/components/user-dashboard/BookAppointmentPage";
import { SiteHeader } from "@/components/site-header";

export default async function BookAppointmentPageRoute() {
  const session = await auth();
  if (!session?.user) {
    redirect("/login?redirect=/user-dashboard/book");
  }

  const products = await prisma.product.findMany({
    orderBy: { title: "asc" },
  });

  const productLite = products.map((p) => ({
    id: p.id,
    title: p.title,
    price: p.price,
    description: p.description,
  }));

  return (
    <div className="min-h-screen bg-white dark:bg-[#07264f]">
      <SiteHeader />
      <main className="flex-1">
        <BookAppointmentPage services={productLite} />
      </main>
    </div>
  );
}
