"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Prata } from "next/font/google";
import Link from "next/link";
import { useState, useEffect } from "react";

const PrataFont = Prata({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-sans",
});

interface HeroSectionProps {
  images?: string[];
  delay?: number;
}

const HeroSection = ({
  images = ["/hero image 3.jpg", "/hero image 2.png", "/hero image 4.png", "/hero image 5.jpeg", "/hero image 6.jpg", "/hero image 1.jpg"],
  delay = 5000,
}: HeroSectionProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 500);
    }, delay);

    return () => clearInterval(interval);
  }, [delay, images]);

  return (
    <div className="relative overflow-hidden rounded-t-2xl">
      {/* Single Image for both Mobile and Desktop */}
      <div className={`w-full h-100 md:h-168.75 relative transition-opacity duration-500 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
        <Image
          src={images[currentIndex]}
          alt={`Hero ${currentIndex + 1}`}
          width={1920}
          height={1080}
          className="w-full h-full object-cover object-right"
          priority
          loading="eager"
          sizes="100vw"
        />
      </div>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-20 md:bottom-20 left-1/2 md:left-5 -translate-x-1/2 md:translate-x-0 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true);
                setTimeout(() => {
                  setCurrentIndex(index);
                  setIsTransitioning(false);
                }, 500);
              }}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/70"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Button over image */}
      <div className="absolute bottom-5 left-1/2 md:left-5 -translate-x-1/2 md:translate-x-0 backdrop-blur-sm w-[90%] md:w-fit rounded-lg p-5 bg-[#e3ae72]/40 max-w-md flex flex-col items-center md:items-start justify-start z-10">
        <h1 className="text-[2.2rem] sm:text-3xl md:text-6xl font-bold text-white mb-3 sm:mb-4 leading-tight text-center md:text-left">
          Serenity{" "}
          <span className={PrataFont.className}>Rejuvenation</span>
        </h1>

        <Link href="/contact">
          <Button
            className="px-5 mt-1 text-black hover:text-white bg-[#e3ae72] hover:bg-[#150c07] text-sm rounded-full cursor-pointer"
            size="lg"
          >
            CONTACT US
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default HeroSection;
