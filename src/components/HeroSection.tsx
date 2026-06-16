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
  const [nextIndex, setNextIndex] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);

      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
        setNextIndex((prev) => (prev + 1) % images.length);
        setIsTransitioning(false);
      }, 1000);
    }, delay);

    return () => clearInterval(interval);
  }, [delay, images]);

  const handleDotClick = (index: number) => {
    setNextIndex(index);
    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentIndex(index);
      setIsTransitioning(false);
    }, 1000);
  };

  const currentImage = images[currentIndex];
  const upcomingImage = images[nextIndex];

  return (
    <div className="relative overflow-hidden rounded-t-2xl">
      {/* Image Container with Crossfade */}
      <div className="relative w-full h-100 md:h-168.75">
        {/* Current Image */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            isTransitioning ? "opacity-0" : "opacity-100"
          }`}
        >
          <Image
            src={currentImage}
            alt={`Hero ${currentIndex + 1}`}
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-right"
            priority={currentIndex === 0}
            loading={currentIndex === 0 ? "eager" : "lazy"}
            sizes="100vw"
          />
        </div>

        {/* Next Image (fades in on top) */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            isTransitioning ? "opacity-100" : "opacity-0"
          }`}
        >
          <Image
            src={upcomingImage}
            alt={`Hero ${nextIndex + 1}`}
            width={1920}
            height={1080}
            className="w-full h-full object-cover object-right"
            priority={nextIndex === 0}
            loading={nextIndex === 0 ? "eager" : "lazy"}
            sizes="100vw"
          />
        </div>
      </div>

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-20 md:bottom-20 left-1/2 md:left-5 -translate-x-1/2 md:translate-x-0 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
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
