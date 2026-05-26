"use client"

import { useState, useEffect, useRef } from "react";

const BOOKING_URL = "https://your-booking-url.com";

const benefits = [
  "Fine lines & wrinkles",
  "Acne scars",
  "Enlarged pores",
  "Skin rejuvenation",
];

function NeedleIcon() {
  return (
    <svg viewBox="0 0 80 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-16 h-20" aria-hidden="true">
      {/* Syringe body */}
      <rect x="28" y="30" width="24" height="52" rx="4" stroke="currentColor" strokeWidth="1.6" className="text-[#07264f] dark:text-[#e3ae72]" />
      {/* Plunger */}
      <rect x="34" y="22" width="12" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" className="text-[#07264f] dark:text-[#e3ae72]" />
      <line x1="40" y1="10" x2="40" y2="22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="text-[#07264f] dark:text-[#e3ae72]" />
      {/* Needle tip */}
      <path d="M34 82 L40 100 L46 82" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" className="text-[#07264f] dark:text-[#e3ae72]" fill="none" />
      {/* Measurement lines */}
      <line x1="28" y1="44" x2="22" y2="44" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-[#07264f]/50 dark:text-[#e3ae72]/50" />
      <line x1="28" y1="54" x2="24" y2="54" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-[#07264f]/50 dark:text-[#e3ae72]/50" />
      <line x1="28" y1="64" x2="22" y2="64" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-[#07264f]/50 dark:text-[#e3ae72]/50" />
      <line x1="28" y1="74" x2="24" y2="74" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" className="text-[#07264f]/50 dark:text-[#e3ae72]/50" />
      {/* Liquid fill */}
      <rect x="30" y="55" width="20" height="25" rx="2" fill="currentColor" className="text-[#07264f]/15 dark:text-[#e3ae72]/20" />
      {/* Sparkle left */}
      <line x1="12" y1="20" x2="12" y2="26" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[#07264f] dark:text-[#e3ae72]" />
      <line x1="9" y1="23" x2="15" y2="23" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[#07264f] dark:text-[#e3ae72]" />
      {/* Sparkle right */}
      <line x1="68" y1="35" x2="68" y2="39" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[#07264f] dark:text-[#e3ae72]" />
      <line x1="66" y1="37" x2="70" y2="37" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" className="text-[#07264f] dark:text-[#e3ae72]" />
    </svg>
  );
}

function StarDiamond({ className = "" }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
    </svg>
  );
}

export default function MicroneedlingProductPage() {
  const [visible, setVisible] = useState(false);
  const [hoveredBenefit, setHoveredBenefit] = useState(null);
  const [priceRevealed, setPriceRevealed] = useState(false);
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    const t2 = setTimeout(() => setPriceRevealed(true), 700);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 8, y: -x * 8 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <div className="min-h-screen bg-white dark:bg-[#07264f] flex items-center justify-center px-6 py-16">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&family=Jost:wght@300;400;500&display=swap');

        .card-tilt {
          transition: transform 0.15s ease-out;
          transform-style: preserve-3d;
        }
        .shimmer-line {
          background: linear-gradient(90deg, transparent 0%, rgba(231,174,114,0.4) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2.8s ease-in-out infinite;
        }
        .shimmer-line-dark {
          background: linear-gradient(90deg, transparent 0%, rgba(7,38,79,0.3) 50%, transparent 100%);
          background-size: 200% 100%;
          animation: shimmer 2.8s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .benefit-item {
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .benefit-item:hover {
          transform: translateX(6px);
        }
        .price-reveal {
          clip-path: inset(0 100% 0 0);
          transition: clip-path 0.9s cubic-bezier(0.76, 0, 0.24, 1);
        }
        .price-reveal.revealed {
          clip-path: inset(0 0% 0 0);
        }
        .fade-up {
          opacity: 0;
          transform: translateY(22px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .btn-glow {
          position: relative;
          overflow: hidden;
        }
        .btn-glow::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 120%, rgba(255,255,255,0.25) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .btn-glow:hover::after {
          opacity: 1;
        }
        .dot-grid {
          background-image: radial-gradient(circle, currentColor 1px, transparent 1px);
          background-size: 18px 18px;
        }
        .needle-float {
          animation: float 4s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-3deg); }
          50% { transform: translateY(-8px) rotate(-3deg); }
        }
      `}</style>

      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          fontFamily: "'Jost', sans-serif",
        }}
        className="card-tilt relative w-full max-w-[420px]"
      >
        {/* Card */}
        <div className="relative rounded-[28px] overflow-hidden bg-white dark:bg-[#07264f] border border-[#07264f]/12 dark:border-[#e3ae72]/20 shadow-[0_24px_80px_rgba(7,38,79,0.12)] dark:shadow-[0_24px_80px_rgba(0,0,0,0.35)]">

          {/* Top decorative band */}
          <div className="relative bg-[#07264f] dark:bg-[#e3ae72] px-8 pt-8 pb-10 overflow-hidden">
            {/* Dot grid texture */}
            <div className="absolute inset-0 dot-grid text-white/10 dark:text-[#07264f]/15" />

            {/* Shimmer sweep */}
            <div className="absolute inset-0 shimmer-line-dark dark:hidden pointer-events-none" />

            {/* Tag */}
            <div className={`fade-up ${visible ? "visible" : ""}`} style={{ transitionDelay: "0.1s" }}>
              <span className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] uppercase text-white/60 dark:text-[#07264f]/60 bg-white/10 dark:bg-[#07264f]/15 px-3 py-1.5 rounded-full">
                <StarDiamond className="w-2 h-2" />
                Advanced Treatment
              </span>
            </div>

            {/* Title + Icon row */}
            <div className={`fade-up flex items-end justify-between mt-4 ${visible ? "visible" : ""}`} style={{ transitionDelay: "0.2s" }}>
              <div>
                <h1 style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    className="text-4xl font-light text-white dark:text-[#07264f] leading-[1.05] tracking-tight">
                  Micro
                  <br />
                  <span className="italic font-semibold">needling</span>
                </h1>
              </div>
              <div className="needle-float text-white dark:text-[#07264f] opacity-80">
                <NeedleIcon />
              </div>
            </div>

            {/* Price */}
            <div className={`fade-up mt-5 flex items-baseline gap-2 ${visible ? "visible" : ""}`} style={{ transitionDelay: "0.35s" }}>
              <span className="text-white/50 dark:text-[#07264f]/50 text-sm font-light tracking-wider uppercase">From</span>
              <div className="overflow-hidden">
                <span className={`price-reveal ${priceRevealed ? "revealed" : ""} inline-block`}
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  <span className="text-[42px] font-light text-white dark:text-[#07264f] leading-none tracking-tight">$350</span>
                </span>
              </div>
            </div>
          </div>

          {/* Bottom content section */}
          <div className="px-8 pt-7 pb-8 bg-white dark:bg-[#07264f]">

            {/* Description */}
            <p className={`fade-up text-[13.5px] leading-relaxed text-[#07264f]/55 dark:text-[#e3ae72]/65 ${visible ? "visible" : ""}`}
               style={{ transitionDelay: "0.45s" }}>
              Stimulate your skin's natural renewal process with advanced collagen induction treatment.
            </p>

            {/* Divider */}
            <div className={`fade-up my-6 h-px bg-[#07264f]/8 dark:bg-[#e3ae72]/15 ${visible ? "visible" : ""}`}
                 style={{ transitionDelay: "0.5s" }} />

            {/* Benefits */}
            <ul className="space-y-3">
              {benefits.map((benefit, i) => (
                <li
                  key={benefit}
                  onMouseEnter={() => setHoveredBenefit(i)}
                  onMouseLeave={() => setHoveredBenefit(null)}
                  className={`benefit-item fade-up flex items-center gap-3 cursor-default ${visible ? "visible" : ""}`}
                  style={{ transitionDelay: `${0.55 + i * 0.08}s` }}
                >
                  <StarDiamond className={`w-2.5 h-2.5 shrink-0 transition-all duration-300 ${
                    hoveredBenefit === i
                      ? "text-[#07264f] dark:text-[#e3ae72] scale-125"
                      : "text-[#07264f]/35 dark:text-[#e3ae72]/40"
                  }`} />
                  <span className={`text-[13.5px] font-light tracking-wide transition-all duration-250 ${
                    hoveredBenefit === i
                      ? "text-[#07264f] dark:text-[#e3ae72]"
                      : "text-[#07264f]/65 dark:text-[#e3ae72]/65"
                  }`}>
                    {benefit}
                  </span>
                </li>
              ))}
            </ul>

            {/* Divider */}
            <div className={`fade-up my-6 h-px bg-[#07264f]/8 dark:bg-[#e3ae72]/15 ${visible ? "visible" : ""}`}
                 style={{ transitionDelay: "0.85s" }} />

            {/* Actions */}
            <div className={`fade-up flex items-center justify-between gap-3 ${visible ? "visible" : ""}`}
                 style={{ transitionDelay: "0.9s" }}>
              <a
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow flex-1 flex items-center justify-center bg-[#07264f] dark:bg-[#e3ae72] text-white dark:text-[#07264f] text-xs font-medium tracking-[0.12em] uppercase px-6 py-3.5 rounded-full transition-all duration-200 hover:bg-[#07264f]/85 dark:hover:bg-[#d49e5e] active:scale-95 focus-visible:outline-none"
              >
                Book Now
              </a>
              <button className="flex items-center gap-1.5 text-[11px] font-medium tracking-[0.1em] uppercase text-[#07264f]/55 dark:text-[#e3ae72]/55 hover:text-[#07264f] dark:hover:text-[#e3ae72] transition-colors duration-200 px-2 whitespace-nowrap">
                Learn More
                <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5">
                  <path d="M3 8h10M9 4l4 4-4 4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Subtle ambient glow behind card */}
        <div className="absolute -inset-8 -z-10 rounded-[60px] bg-[#07264f]/5 dark:bg-[#e3ae72]/5 blur-3xl pointer-events-none" />
      </div>
    </div>
  );
}