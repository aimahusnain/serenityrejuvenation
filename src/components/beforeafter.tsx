"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

// ── Data ─────────────────────────────────────────────────────────────────────

const slides = [
  {
    tag: "Most Popular",
    treatment: "Microneedling",
    subtitle: "Collagen Induction Therapy",
    price: "$350",
    desc: "Stimulate your skin's natural renewal process for smoother, firmer, more radiant skin.",
    before: "/before-after/skin_texture_before.png",
    after: "/before-after/skin_texture_after.png",
  },
  {
    tag: "Advanced",
    treatment: "Microneedling with PRP",
    subtitle: "Growth Factor Enhancement",
    price: "$600",
    desc: "Harness your body's own healing power to amplify collagen and accelerate skin renewal.",
    before: "/before-after/acne_scarring_before.png",
    after: "/before-after/acne_scarring_after.png",
  },
  {
    tag: "Premium",
    treatment: "Microneedling with PRF",
    subtitle: "Next-Level Regeneration",
    price: "$600",
    desc: "A richer, longer-lasting regenerative treatment using concentrated platelets and fibrin.",
    before: "/before-after/microneedling_prf_before.png",
    after: "/before-after/microneedling_prf_after.png",
  },
];

const stats = [
  { value: "500+", label: "Clients Served" },
  { value: "6", label: "Treatments" },
  { value: "98%", label: "Satisfaction" },
];

// ── Before / After Slider ────────────────────────────────────────────────────

function BeforeAfterSlider({
  before,
  after,
  label,
}: {
  before: string;
  after: string;
  label: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const move = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const { left, width } = el.getBoundingClientRect();
    setPosition(Math.min(100, Math.max(0, ((clientX - left) / width) * 100)));
  }, []);

  useLayoutEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (dragging.current) move(e.clientX);
    };
    const onUp = () => {
      dragging.current = false;
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [move]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full cursor-col-resize select-none"
      onMouseDown={() => {
        dragging.current = true;
      }}
      onTouchMove={(e) => move(e.touches[0].clientX)}
      onTouchStart={(e) => move(e.touches[0].clientX)}
    >
      {/* AFTER — base */}
      <div className="absolute inset-0">
        <Image
          src={after}
          alt={`After — ${label}`}
          fill
          className="object-cover"
          draggable={false}
          priority
        />
        <span className="absolute bottom-4 right-4 text-[10px] uppercase tracking-widest font-semibold text-white bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full pointer-events-none">
          After
        </span>
      </div>

      {/* BEFORE — clipped */}
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
      >
        <Image
          src={before}
          alt={`Before — ${label}`}
          fill
          className="object-cover"
          draggable={false}
        />
        <span className="absolute bottom-4 left-4 text-[10px] uppercase tracking-widest font-semibold text-white bg-black/35 backdrop-blur-sm px-2.5 py-1 rounded-full pointer-events-none">
          Before
        </span>
      </div>

      {/* Divider line */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white shadow-[0_0_12px_rgba(255,255,255,0.5)] pointer-events-none"
        style={{ left: `${position}%` }}
      />

      {/* Handle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-20"
        style={{ left: `${position}%` }}
        onMouseDown={(e) => {
          e.stopPropagation();
          dragging.current = true;
        }}
        onTouchStart={(e) => {
          move(e.touches[0].clientX);
        }}
      >
        <div className="w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center border-2 border-white/80 ring-1 ring-[#07264f]/10">
          <svg
            viewBox="0 0 20 20"
            fill="none"
            className="w-5 h-5 text-[#07264f]"
          >
            <path
              d="M6 10l-3 3m0 0l3 3m-3-3h14m0 0l-3-3m3 3l-3 3"
              stroke="currentColor"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

// ── Section ──────────────────────────────────────────────────────────────────

export default function ShowcaseSection() {
  const [active, setActive] = useState(0);
  const [fading, setFading] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback(
    (index: number) => {
      if (fading) return;
      setFading(true);
      setTimeout(() => {
        setActive(index);
        setFading(false);
      }, 300);
    },
    [fading],
  );

  const next = useCallback(
    () => goTo((active + 1) % slides.length),
    [active, goTo],
  );
  const prev = useCallback(
    () => goTo((active - 1 + slides.length) % slides.length),
    [active, goTo],
  );

  const resetTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(next, 5000);
  }, [next]);

  useEffect(() => {
    intervalRef.current = setInterval(next, 5000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [next]);

  const slide = slides[active];

  return (
    <section className="w-full bg-white dark:bg-[#07264f] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-20">
          {/* ── LEFT ─────────────────────────────────────────────── */}
          <div className="flex-1 flex flex-col gap-8 lg:max-w-[460px]">
            {/* Eyebrow */}
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-[#e3ae72]" />
              <p className="text-xs uppercase tracking-[0.22em] font-semibold text-[#e3ae72]">
                Real Results
              </p>
            </div>

            {/* Heading */}
            <h2 className="text-4xl md:text-5xl font-serif font-semibold text-[#07264f] dark:text-[#e3ae72] leading-[1.1] tracking-tight">
              Visible change.
              <br />
              <span className="relative inline-block">
                Lasting results.
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] bg-[#e3ae72] rounded-full" />
              </span>
            </h2>

            <p className="text-base leading-[1.85] text-[#07264f]/58 dark:text-[#e3ae72]/62 max-w-[370px]">
              Every transformation is real — no filters, no edits. Drag the
              slider to see exactly what our treatments deliver.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 py-2">
              {stats.map(({ value, label }) => (
                <div key={label} className="flex flex-col gap-1.5">
                  <span className="text-3xl font-serif font-semibold text-[#07264f] dark:text-[#e3ae72]">
                    {value}
                  </span>
                  <span className="text-[11px] uppercase tracking-[0.14em] text-[#07264f]/42 dark:text-[#e3ae72]/48 leading-snug">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-px bg-[#07264f]/8 dark:bg-[#e3ae72]/12" />

            {/* Active slide info — updates with carousel */}
            <div
              className="flex flex-col gap-2 transition-all duration-300"
              style={{
                opacity: fading ? 0 : 1,
                transform: fading ? "translateY(4px)" : "translateY(0)",
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.18em] text-[#e3ae72] font-semibold">
                    {slide.subtitle}
                  </p>
                  <h3 className="text-xl font-serif font-semibold text-[#07264f] dark:text-[#e3ae72] mt-0.5">
                    {slide.treatment}
                  </h3>
                </div>
                <span className="text-lg font-semibold text-[#07264f] dark:text-[#e3ae72]">
                  {slide.price}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-[#07264f]/55 dark:text-[#e3ae72]/60">
                {slide.desc}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-4">
              <Link
                href="/booking"
                className="
                  inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full
                  text-sm font-medium transition-all duration-200 group
                  bg-[#07264f] text-white hover:bg-[#07264f]/82
                  dark:bg-[#e3ae72] dark:text-[#07264f] dark:hover:bg-[#d49e5e]
                "
              >
                Book This Treatment
                <ArrowRight
                  size={15}
                  className="group-hover:translate-x-0.5 transition-transform"
                />
              </Link>
            </div>
          </div>

          {/* ── RIGHT ────────────────────────────────────────────── */}
          <div className="flex-1 w-full flex flex-col gap-5 lg:max-w-[500px]">
            {/* Card */}
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl shadow-[#07264f]/12 dark:shadow-black/40 bg-[#07264f]/5 dark:bg-[#e3ae72]/5">
              {/* Before/After slider — fades on slide change */}
              <div
                className="absolute inset-0 transition-opacity duration-300"
                style={{ opacity: fading ? 0 : 1 }}
              >
                <BeforeAfterSlider
                  key={active} // remounts on slide change to reset handle
                  before={slide.before}
                  after={slide.after}
                  label={slide.treatment}
                />
              </div>

              {/* Top left tag */}
              <div className="absolute top-5 left-5 z-30 pointer-events-none">
                <span className="text-[10px] uppercase tracking-widest font-semibold px-3 py-1.5 rounded-full bg-[#e3ae72] text-[#07264f]">
                  {slide.tag}
                </span>
              </div>

              {/* Top right nav arrows */}
              <div className="absolute top-5 right-5 z-30 flex items-center gap-2">
                {[
                  {
                    fn: () => {
                      prev();
                      resetTimer();
                    },
                    path: "M15 19l-7-7 7-7",
                  },
                  {
                    fn: () => {
                      next();
                      resetTimer();
                    },
                    path: "M9 5l7 7-7 7",
                  },
                ].map(({ fn, path }, i) => (
                  <button
                    key={i}
                    onClick={fn}
                    aria-label={i === 0 ? "Previous" : "Next"}
                    className="w-9 h-9 rounded-xl bg-black/20 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-black/35 transition-all duration-150"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="white"
                      strokeWidth={2}
                      strokeLinecap="round"
                      className="w-4 h-4"
                    >
                      <path d={path} />
                    </svg>
                  </button>
                ))}
              </div>

              {/* Drag hint — shows briefly */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 pointer-events-none">
                <p className="text-[10px] uppercase tracking-widest text-white/50 backdrop-blur-sm">
                  drag to compare
                </p>
              </div>
            </div>

            {/* Thumbnail strip + counter */}
            <div className="flex items-center justify-between gap-3 px-1">
              {/* Thumbnail dots */}
              <div className="flex items-center gap-2.5">
                {slides.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      goTo(i);
                      resetTimer();
                    }}
                    aria-label={`Go to ${s.treatment}`}
                    className={`transition-all duration-300 rounded-full overflow-hidden border-2 ${
                      i === active
                        ? "border-[#07264f] dark:border-[#e3ae72] w-10 h-10 opacity-100"
                        : "border-transparent w-8 h-8 opacity-45 hover:opacity-70"
                    }`}
                  >
                    <div className="relative w-full h-full bg-[#07264f]/10 dark:bg-[#e3ae72]/10">
                      <Image
                        src={s.after}
                        alt={s.treatment}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </button>
                ))}
              </div>

              {/* Counter */}
              <span className="text-xs font-medium tabular-nums text-[#07264f]/38 dark:text-[#e3ae72]/42">
                {String(active + 1).padStart(2, "0")} /{" "}
                {String(slides.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
