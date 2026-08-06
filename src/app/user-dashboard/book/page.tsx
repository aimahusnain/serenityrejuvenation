import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Script from "next/script";
import { prisma } from "@/lib/prisma";
import { BookAppointmentPage } from "@/components/user-dashboard/BookAppointmentPage";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

export default async function BookAppointmentPageRoute() {
  const session = await auth();
  // Middleware will handle authentication redirect

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
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      className="bg-[#26043e]!"
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader />
        <main className="flex-1">
          <BookAppointmentPage services={productLite} />

          <section className="px-6 pb-10">
            <div className="rounded-2xl border border-[#7a219f]/15 bg-[#1d002c] p-6 shadow-sm">
              <div className="mb-4">
                <h2 className="text-lg font-semibold text-[#efcafe]">
                  Need help choosing the right treatment?
                </h2>
                <p className="mt-1 text-sm text-[#efcafe]/70">
                  Use the guided planner below to find the best option for your goals.
                </p>
              </div>

              <link
                href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400..900&family=Slabo+27px&family=Lato:wght@100;300;400;700;900&family=Raleway:wght@100..900&family=Montserrat:wght@100..900&family=Oswald:wght@200..700&family=Poppins:wght@100;200;300;400;500;600;700;800;900&family=Roboto:wght@100..900&family=Source+Sans+3:wght@200..900&family=PT+Sans:wght@400;700&family=Open+Sans:ital,wght@0,300..800;1,300..800&display=swap"
                rel="stylesheet"
              />

              <div id="all" />
              <div id="hero" />
              <div id="calculator" />
              <div id="howitworks" />
              <div id="testimony" />
              <div id="faq" />
            </div>
          </section>

          <Script id="cherry-widget-loader" strategy="afterInteractive">
            {`
              (function (w, d, s, o, f, js, fjs) {
                w[o] = w[o] || function () {
                  (w[o].q = w[o].q || []).push(arguments);
                };
                (js = d.createElement(s)), (fjs = d.getElementsByTagName(s)[0]);
                js.id = o;
                js.src = f;
                js.async = 1;
                fjs.parentNode.insertBefore(js, fjs);
              })(window, document, "script", "_hw", "https://files.withcherry.com/widgets/widget.js");

              _hw("init", {
                debug: false,
                variables: {
                  slug: "choice-serenity-rejuvenation",
                  name: "Choice Serenity Rejuvenation",
                  images: [26],
                  customLogo: "",
                  defaultPurchaseAmount: 750,
                  customImage: "",
                  imageCategory: "medspa",
                  language: "en"
                },
                styles: {
                  primaryColor: "#7a6f9b",
                  secondaryColor: "#7a6f9b10",
                  fontFamily: "Montserrat",
                  headerFontFamily: "Montserrat"
                }
              }, ["hero", "calculator", "howitworks", "faq"]);
            `}
          </Script>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
