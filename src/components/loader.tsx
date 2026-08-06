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
    window.scrollTo(0, 0);
    document.body.style.overflow = "hidden";

    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const hideTimer = setTimeout(() => {
      setVisible(false);
      document.body.style.overflow = "";
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
        bg-white dark:bg-[#7a219f]
      `}
      style={{
        opacity: fading ? 0 : 1,
      }}
    >
      {/* Wordmark */}
      <div className="flex flex-col items-center gap-1.5">
        <span className="text-[11px] font-light tracking-[0.65em] uppercase text-[#7a219f]/60 dark:text-[#efcafe]/65">
          Serenity
        </span>

        <span
          className={`${prata.className} text-[32px] tracking-[0.06em] text-[#7a219f] dark:text-[#efcafe]`}
        >
          Rejuvenation
        </span>
      </div>

      {/* Sweeping bar */}
      <div
        className="relative w-30 h-1 overflow-hidden bg-[#7a219f]/15 dark:bg-[#efcafe]/20"
        aria-hidden="true"
      >
        <div className="absolute inset-0 animate-sweep bg-[#7a219f] dark:bg-[#efcafe]" />
      </div>
    </div>
  );
}
