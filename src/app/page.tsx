import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Prata } from "next/font/google";
import TextSlider from "@/components/TextSlider";
import NailTechSection from "@/components/Nailtechsection";

const PrataFont = Prata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
});

const Home = () => {
  return (
    <div>
      <div className="m-4 flex flex-col gap-8">
        <div>
          <div className="relative overflow-hidden rounded-t-2xl">
            {/* Desktop Image */}
            <Image
              src="/hero image 3.jpg"
              alt="Hero Desktop"
              width={1920}
              height={1080}
              className="hidden md:block w-full h-108 object-cover object-top"
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
            <div className="absolute bottom-5 left-1/2 md:left-5 -translate-x-1/2 md:translate-x-0 backdrop-blur-sm w-[90%] md:w-fit rounded-lg p-5 bg-[#2e241e]/40 max-w-md flex flex-col items-center md:items-start justify-start">
              <h1 className="text-[2.2rem] sm:text-3xl md:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight text-center md:text-left">
                Serenity{" "}
                <span className={PrataFont.className}>Rejuvenation</span>
              </h1>

              <Button
                className="px-5 mt-1 bg-[#2e241e] hover:bg-[#150c07] text-sm rounded-xl cursor-pointer"
                size="lg"
              >
                CONTACT US
              </Button>
            </div>
          </div>
          <TextSlider />
        </div>

        <NailTechSection />
      </div>
    </div>
  );
};

export default Home;
