import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Prata } from "next/font/google";
import { ProductCard } from "@/components/product-card";

const PrataFont = Prata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
});

const Home = () => {
  return (
    <div className="relative w-screen overflow-hidden">

      {/* Desktop Image */}
      <Image
        src="/hero_pose_desktop.png"
        alt="Hero Desktop"
        width={1920}
        height={1080}
        className="hidden md:block w-screen h-auto object-cover"
        priority
        loading="eager"
        quality={80}
        sizes="100vw"
      />

      {/* Mobile Image */}
      <Image
        src="/hero_pose_mobile.png"
        alt="Hero Mobile"
        width={800}
        height={750}
        className="block md:hidden w-screen h-auto object-cover"
        priority
        loading="eager"
        quality={80}
        sizes="100vw"
      />

      {/* Button over image */}
      <div className="absolute inset-0 left-5 sm:left-14 md:-top-24 max-w-md items-start justify-end md:justify-center flex flex-col py-5">
        <h1 className="text-[2.2rem] sm:text-3xl md:text-6xl font-bold text-[#133316] mb-3 sm:mb-4 leading-tight">
          Serenity <br />
          <span className={PrataFont.className}>Rejuvenation</span>
        </h1>
        <Button className="rounded-full px-7 mt-5 bg-[#102d16] hover:bg-[#094f17] text-md" size="lg">CONTACT US</Button>
      </div>

      {/* Product Card */}
      <div className="absolute left-5 sm:left-14 md:right-14 md:left-auto top-10 md:top-24 w-56 md:w-xs">
        <ProductCard
          name="Microneedling"
        />
      </div>

    </div>
  );
};

export default Home;