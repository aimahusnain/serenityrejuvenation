import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Prata } from "next/font/google";

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
        src="/hero image 3.jpg"
        alt="Hero Desktop"
        width={1920}
        height={1080}
        className="hidden md:block w-screen h-108 object-cover object-top"
        priority
        loading="eager"
        sizes="100vw"
      />

      {/* Mobile Image */}
      <Image
        src="/hero_mobile.png"
        alt="Hero Mobile"
        width={800}
        height={750}
        className="block md:hidden w-screen h-100 object-cover"
        priority
        loading="eager"
        sizes="100vw"
      />

      {/* Button over image */}
      <div className="absolute bottom-5 left-5 backdrop-blur-sm w-[90%] sm:w-fit rounded-lg p-5 bg-[#2e241e]/40 max-w-md flex flex-col items-center">        <h1 className="text-[2.2rem] sm:text-3xl md:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight sm:text-left text-center">
        Serenity
        <span className={PrataFont.className}> Rejuvenation</span>
      </h1>
        <Button className="px-7 mt-1 bg-[#2e241e] hover:bg-[#150c07] text-md w-full rounded-none cursor-pointer" size="lg">CONTACT US</Button>
      </div>
    </div>
  );
};

export default Home;