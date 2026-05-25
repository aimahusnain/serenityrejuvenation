"use client";

import { useState, useEffect } from "react";

const BOOKING_URL = "https://your-booking-url.com";

const steps = [
  {
    id: 1,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <rect x="3" y="4" width="18" height="17" rx="3" />
        <path d="M16 2v4M8 2v4M3 10h18" />
        <path d="M8 14h2m-2 4h2m4-4h2m-2 4h2" />
      </svg>
    ),
    label: "Book a visit to us",
  },
  {
    id: 2,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <path d="M12 3C9 3 6.5 5 6.5 7.5c0 1.5.8 2.8 2 3.6L6 13h12l-2.5-1.9c1.2-.8 2-2.1 2-3.6C17.5 5 15 3 12 3z" />
        <path d="M6 13v6a1 1 0 001 1h10a1 1 0 001-1v-6" />
      </svg>
    ),
    label: "Choose your service type",
  },
  {
    id: 3,
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.5}
        className="w-6 h-6"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M9 13s1 1.5 3 1.5 3-1.5 3-1.5" strokeLinecap="round" />
        <circle cx="9.5" cy="10" r="0.5" fill="currentColor" />
        <circle cx="14.5" cy="10" r="0.5" fill="currentColor" />
      </svg>
    ),
    label: "One, two, three, Relax.....",
  },
];

export default function PurelyRejuvenated() {
  const [highlightedUpto, setHighlightedUpto] = useState<number>(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setHighlightedUpto(1), 500);
    const t2 = setTimeout(() => setHighlightedUpto(2), 2500);
    const t3 = setTimeout(() => setHighlightedUpto(3), 4500);
    const t4 = setTimeout(() => setHighlightedUpto(0), 6500);
    return () => [t1, t2, t3, t4].forEach(clearTimeout);
  }, []);

  useEffect(() => {
    const loop = setInterval(() => setCycle((c) => c + 1), 7000);
    return () => clearInterval(loop);
  }, []);

  useEffect(() => {
    if (cycle === 0) return;
    setHighlightedUpto(0);
    const t1 = setTimeout(() => setHighlightedUpto(1), 500);
    const t2 = setTimeout(() => setHighlightedUpto(2), 2500);
    const t3 = setTimeout(() => setHighlightedUpto(3), 4500);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, [cycle]);

  return (
    <section className="w-full px-6 py-14 md:py-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-12 md:gap-8 lg:gap-20">
        {/* ── LEFT ── */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-5 mb-6">
            <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2e241e] dark:text-neutral-100 leading-[1.1] tracking-tight">
              Purely
              <br />
              Rejuvenated
            </h1>
            <div className="shrink-0 mt-1">
              <SpaFaceIcon />
            </div>
          </div>

          <p className="text-[15px] leading-relaxed text-[#6b6457] dark:text-neutral-400 max-w-sm mb-10">
            The serenity that stays with you long after your spa session,
            lasting well even into the next day. No more commuting way back
            home, no more traffic, just pure relaxation.
          </p>

          <a
            href={BOOKING_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex items-center justify-center
              bg-[#2e241e] dark:bg-neutral-100 text-white dark:text-neutral-900
              text-sm font-medium tracking-wide
              px-10 py-4 rounded-full
              transition-all duration-200
              hover:bg-[#21130f] dark:hover:bg-neutral-200 active:scale-95
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e241e] dark:focus-visible:ring-neutral-100
            "
          >
            Instant Booking
          </a>
        </div>

        {/* ── RIGHT: Steps ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-3 w-full max-w-md md:max-w-none md:pt-2">
          {steps.map((step) => {
            const isHighlighted = step.id <= highlightedUpto;
            const isLatest = step.id === highlightedUpto;
            const isDim = step.id > highlightedUpto;

            return (
              <div
                key={step.id}
                className={[
                  "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 cursor-not-allowed select-none",
                  isHighlighted &&
                    "bg-white dark:bg-neutral-800 shadow-md border border-[#e8e0d6] dark:border-neutral-700 cursor-default select-auto",
                  isDim &&
                    "bg-[#ede9e3] dark:bg-neutral-900 border border-[#ddd6cc] dark:border-neutral-800",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {/* Step badge */}
                <span
                  className={[
                    "shrink-0 w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center transition-all duration-500",
                    isHighlighted &&
                      "bg-[#2e241e] dark:bg-neutral-100 text-white dark:text-neutral-900",
                    isDim &&
                      "bg-[#d4cdc4] dark:bg-neutral-700 text-[#a09890] dark:text-neutral-500",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {isHighlighted ? <CheckIcon size={10} /> : step.id}
                </span>

                {/* Label */}
                <span
                  className={[
                    "text-sm leading-snug transition-all duration-500 flex-1",
                    isHighlighted &&
                      "font-semibold text-[#2e241e] dark:text-neutral-100",
                    isDim && "font-normal text-[#a09890] dark:text-neutral-500",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function CheckIcon({ size = 12 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="2,6 5,9 10,3" />
    </svg>
  );
}

function SpaFaceIcon() {
  return (
    <svg
      viewBox="0 0 64 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-16 h-16"
      aria-hidden="true"
    >
      <line
        x1="8"
        y1="8"
        x2="8"
        y2="16"
        stroke="currentColor"
        className="text-[#2e241e] dark:text-neutral-100"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="4"
        y1="12"
        x2="12"
        y2="12"
        stroke="currentColor"
        className="text-[#2e241e] dark:text-neutral-100"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="20"
        y1="2"
        x2="20"
        y2="8"
        stroke="currentColor"
        className="text-[#2e241e] dark:text-neutral-100"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <line
        x1="17"
        y1="5"
        x2="23"
        y2="5"
        stroke="currentColor"
        className="text-[#2e241e] dark:text-neutral-100"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <circle
        cx="34"
        cy="34"
        r="20"
        stroke="currentColor"
        className="text-[#2e241e] dark:text-neutral-100"
        strokeWidth="1.8"
      />
      <path
        d="M18 28 Q20 14 34 14 Q48 14 50 28"
        stroke="currentColor"
        className="text-[#2e241e] dark:text-neutral-100"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <line
        x1="27"
        y1="32"
        x2="27"
        y2="36"
        stroke="currentColor"
        className="text-[#2e241e] dark:text-neutral-100"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <line
        x1="41"
        y1="32"
        x2="41"
        y2="36"
        stroke="currentColor"
        className="text-[#2e241e] dark:text-neutral-100"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M27 42 Q34 48 41 42"
        stroke="currentColor"
        className="text-[#2e241e] dark:text-neutral-100"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M16 58 Q20 50 34 50 Q48 50 52 58"
        stroke="currentColor"
        className="text-[#2e241e] dark:text-neutral-100"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
