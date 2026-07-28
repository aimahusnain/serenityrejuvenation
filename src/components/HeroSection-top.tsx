import { Button } from "@/components/ui/button";
import { Prata } from "next/font/google";
import Link from "next/link";
import Image from "next/image";

const PrataFont = Prata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
});

const HeroSection1 = () => {

  return (
      <div className="flex items-start sm:items-center flex-col justify-center h-fit mb-5">
                      <div className="mt-5 mb-3">
                        {/* Light mode logo */}
                        <Image
                          src="/topimage.jpeg"
                          alt="Serenity Rejuvenation"
                          width={250}
                          height={100}
                          className="object-contain"
                        />
                      </div>
        <h1 className="text-[3.2rem] sm:text-7xl font-bold dark:text-white text-black mb-3 leading-tight">
          Serenity{" "}
          <span className={PrataFont.className}>Rejuvenation</span>
        </h1>

        <Link href="/contact">
          <Button
            className="px-5 mt-1 text-black hover:text-white bg-[#e3ae72] hover:bg-[#150c07] text-md rounded-full cursor-pointer"
            size="lg"
          >
            CONTACT US
          </Button>
        </Link>
      </div>
  );
};

export default HeroSection1;