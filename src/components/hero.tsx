'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export function HeroSection() {
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  return (
    <section className="relative w-full h-screen overflow-hidden" style={{ backgroundColor: '#000000' }}>
      {/* Video Background with optimization */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
          isVideoLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onCanPlayThrough={() => setIsVideoLoaded(true)}
        poster="/Video-Poster-New-Conqr-Aesthetics-and-Wellness.webp"
      >
        <source
          src="/herosection-video.mp4"
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>

      {/* Dark Overlay for text readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      {/* Content Container */}
      <div className="relative z-10 h-full flex items-end justify-center px-4 sm:px-6 lg:px-8 pb-5">
        <div className="text-center space-y-1">
          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-light leading-tight text-balance uppercase text-white">
              Reveal Your Radiance from Within
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl font-text font-light leading-relaxed text-balance" style={{ color: '#d2b48c' }}>
              Rediscover your glow with personalized aesthetic care designed to enhance your natural beauty.
            </p>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <button className="inline-flex items-center gap-2 px-8 py-3 cursor-pointer font-medium transition-colors duration-300 shadow-lg hover:shadow-xl text-white" style={{ backgroundColor: '#a67b5b' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#000'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#a67b5b'}>
              Book An Appointment
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Loading Skeleton - shown while video loads */}
      {!isVideoLoaded && (
        <div className="absolute inset-0 bg-linear-to-br from-neutral-900 via-neutral-800 to-neutral-900 animate-pulse"></div>
      )}
    </section>
  );
}
