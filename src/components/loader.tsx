"use client";
import { useEffect, useState } from "react";
import { Prata } from "next/font/google";

const prata = Prata({
  weight: "400",
  subsets: ["latin"],
});

export default function SpaLoader() {
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Force scroll to top on load
    window.scrollTo(0, 0);

    // Prevent background scrolling
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = ""; // restore scroll
    }, 2800);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
      document.body.style.overflow = "";
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`
        fixed inset-0 z-50 flex flex-col items-center justify-center gap-2
        transition-opacity duration-800 ease-in-out
        bg-white dark:bg-[#0f0f0f]
      `}
      style={{
        opacity: fading ? 0 : 1,
      }}
    >
      {/* Wordmark */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[11px] font-light tracking-[0.65em] uppercase text-[#7a6355] dark:text-[#c7b3a4]">
          Serenity
        </span>

        <span className={`${prata.className} text-[32px] tracking-[0.06em] text-[#2e241e] dark:text-white`}>
          Rejuvenation
        </span>
      </div>

      {/* Sweeping bar */}
      <div
        className="relative w-30 h-1 overflow-hidden bg-[#2e2018] dark:bg-[#2a2a2a]"
        aria-hidden="true"
      >
        <div className="absolute inset-0 animate-sweep bg-[#b89070] dark:bg-[#e0b899]" />
      </div>
    </div>
  );
}