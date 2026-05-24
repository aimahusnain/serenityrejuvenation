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
    const fadeTimer = setTimeout(() => setFading(true), 2000);
    const hideTimer = setTimeout(() => setVisible(false), 2800); // 800ms fade duration
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-2 transition-opacity duration-800 ease-in-out"
      style={{
        backgroundColor: "#fff",
        opacity: fading ? 0 : 1,
      }}
    >
      {/* Wordmark */}
      <div className="flex flex-col items-center gap-1.5">
        <span
          className="text-[11px] font-light tracking-[0.65em] uppercase"
          style={{ color: "#7a6355" }}
        >
          Serenity
        </span>
        <span
          className={`${prata.className} text-[32px] tracking-[0.06em]`}
          style={{ color: "#2e241e" }}
        >
          Rejuvenation
        </span>
      </div>

      {/* Sweeping bar */}
      <div
        className="relative w-30 h-1 overflow-hidden"
        style={{ backgroundColor: "#2e2018" }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 animate-sweep"
          style={{ backgroundColor: "#b89070" }}
        />
      </div>
    </div>
  );
}
