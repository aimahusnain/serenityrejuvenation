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
      {/* Mobile: solid background + text block ABOVE the image */}
      <div className="md:hidden bg-[var(--home-purple)] w-full p-6 flex flex-col items-center justify-center text-center">
        <h1 className="text-[2.2rem] sm:text-3xl font-bold text-white mb-3 leading-tight">
          Serenity{" "}
          <span className={PrataFont.className}>Rejuvenation</span>
        </h1>

        <Link href="/contact">
          <Button
            className="px-5 mt-1 text-[var(--home-on-accent)] hover:opacity-90 bg-[var(--home-accent)] text-sm rounded-full cursor-pointer"
            size="lg"
          >
            CONTACT US
          </Button>
        </Link>
      </div>

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

        {/* Dots Indicator - desktop only position stays inside image on md+, but shown on mobile too at bottom of image */}
        {images.length > 1 && (
          <div className="absolute bottom-5 md:bottom-20 left-1/2 md:left-5 -translate-x-1/2 md:translate-x-0 flex gap-2 z-10">
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

        {/* Button over image - desktop only now, since mobile version is above the image */}
        <div className="hidden md:flex absolute bottom-5 left-5 backdrop-blur-sm w-fit rounded-lg p-5 bg-[color-mix(in_srgb,var(--home-accent)_40%,transparent)] max-w-md flex-col items-start justify-start z-10">
          <h1 className="text-6xl font-bold text-white mb-4 leading-tight text-left">
            Serenity{" "}
            <span className={PrataFont.className}>Rejuvenation</span>
          </h1>

          <Link href="/contact">
            <Button
              className="px-5 mt-1 text-[var(--home-on-accent)] hover:opacity-90 bg-[var(--home-accent)] text-sm rounded-full cursor-pointer"
              size="lg"
            >
              CONTACT US
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;