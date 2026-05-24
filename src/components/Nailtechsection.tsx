"use client";

import Image from "next/image";

const TICKER_ITEMS = Array(8).fill(null);

export default function NailTechSection() {
  return (
    <section className="flex rounded-2xl flex-col md:flex-row w-full min-h-screen md:min-h-0 md:h-150 overflow-hidden font-sans">
      {/* ── LEFT: Photo ── */}
      <div className="relative w-full md:flex-[0_0_48%] h-72 sm:h-96 md:h-full overflow-hidden">
        <Image
          src="/experience us.webp"
          alt="Model showcasing serenity rejuvenation"
          fill
          priority
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 48vw"
        />
      </div>

      {/* ── MIDDLE: Vertical scrolling ticker ── */}
      <div className="hidden md:flex flex-col items-center justify-start w-14 shrink-0 bg-white border-x border-neutral-100 overflow-hidden">
        <div className="flex flex-col items-center animate-ticker-scroll">
          {TICKER_ITEMS.map((_, i) => (
            <TickerGroup key={i} />
          ))}
        </div>
      </div>

      {/* ── RIGHT: Content ── */}
      <div className="flex-1 bg-[#ffece0] flex items-center justify-center px-8 py-14 md:py-0 md:px-14 lg:px-20">
        <div className="max-w-sm w-full">
          {/* Heading */}
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-[52px] font-bold text-[#2e241e] leading-[1.1] mb-6 relative inline-block">
            Experienced
            <br />
            Serenity
            {/* Decorative curl underline */}
            <span
              className="absolute bottom-1.5 w-16 h-4 border-b-[2.5px] border-r-[2.5px] border-[#2e241e] rounded-br-[20px]"
              aria-hidden="true"
            />
          </h1>

          {/* Body copy */}
          <p className="text-[15.5px] leading-[1.75] text-[#2e241e] mb-10 font-normal">
            Our trained technicians use only the highest quality products and
            latest techniques to ensure your skin is not just beautiful, but
            healthy too.
          </p>

          {/* CTA */}
          <a
            href="#gallery"
            className="
              inline-block px-10 py-3.5
              rounded-full border border-[#2e241e]
              text-sm font-medium tracking-wide text-[#2e241e]
              transition-colors duration-200
              hover:bg-[#2e241e] hover:text-white
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2e241e]
            "
          >
            View Work
          </a>
        </div>
      </div>
    </section>
  );
}

/* ── Ticker group: one label + heart ── */
function TickerGroup() {
  return (
    <>
      <span
        className="
          [writing-mode:vertical-rl] [text-orientation:mixed] rotate-180
          text-[10px] font-medium tracking-[0.18em] uppercase
          text-stone-500 whitespace-nowrap py-7 leading-none
        "
      >
        Serenity Rejuvenation
      </span>
      <span
        className="text-[#2e241e] py-2 leading-none select-none"
        aria-hidden="true"
      >
        ♡
      </span>
    </>
  );
}
