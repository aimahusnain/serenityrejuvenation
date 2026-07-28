"use client";

import { useEffect, useMemo, useState } from "react";

/* ------------------------------------------------------------------ */
/*  Data                                                               */
/* ------------------------------------------------------------------ */

type Treatment = {
  icon: string;
  title: string;
  price: string;
  desc: string;
  items: string[];
};

const TREATMENTS: Treatment[] = [
  {
    icon: "💉",
    title: "Basic Botox",
    price: "From $99.00",
    desc: "The lightest option to soften the earliest signs of lines while keeping expression natural.",
    items: ["Softens fine lines", "Natural expression", "Minimal downtime"],
  },
  {
    icon: "✨",
    title: "Advanced Botox",
    price: "From $170.00",
    desc: "A stronger dose treatment for established lines needing more coverage and duration.",
    items: ["Deeper line correction", "Longer-lasting results", "Brow lift effect"],
  },
  {
    icon: "💧",
    title: "Fillers",
    price: "From $250.00",
    desc: "Restore lost volume and enhance contours with smooth, natural-looking definition.",
    items: ["Lip & cheek volume", "Contour enhancement", "Immediate results"],
  },
  {
    icon: "🧴",
    title: "IV Hydration Therapy",
    price: "From $120.00",
    desc: "Nutrient-rich infusions that replenish hydration and boost energy from within.",
    items: ["Deep hydration", "Energy & clarity boost", "Vitamin-rich blend"],
  },
  {
    icon: "🧬",
    title: "Peptide Therapy",
    price: "From $200.00",
    desc: "Targeted peptide protocols to support recovery, tone, and cellular renewal.",
    items: ["Skin renewal", "Recovery support", "Anti-aging support"],
  },
  {
    icon: "🌿",
    title: "GLP-1 Wellness Program",
    price: "From $299.00",
    desc: "Physician-guided GLP-1 protocol supporting sustainable weight management.",
    items: ["Appetite regulation", "Sustainable results", "Ongoing monitoring"],
  },
  {
    icon: "🩸",
    title: "PRF Therapy (Platelet Rich Fibrin)",
    price: "From $350.00",
    desc: "Your body's own healing factors, concentrated to rejuvenate skin naturally.",
    items: ["100% natural", "Collagen stimulation", "Improved texture"],
  },
  {
    icon: "🩹",
    title: "PRP Therapy (Platelet Rich Plasma)",
    price: "From $320.00",
    desc: "Harnesses platelet-rich plasma to accelerate healing and refresh skin tone.",
    items: ["Skin rejuvenation", "Hair restoration option", "Minimal downtime"],
  },
  {
    icon: "🖋️",
    title: "Microneedling with Scriptra®",
    price: "From $380.00",
    desc: "Advanced microneedling paired with Scriptra® for enhanced collagen response.",
    items: ["Boosted collagen", "Refined texture", "Visible glow"],
  },
  {
    icon: "🩸",
    title: "Microneedling with PRF",
    price: "From $360.00",
    desc: "Combines microneedling with PRF for amplified natural rejuvenation.",
    items: ["Natural healing boost", "Improved elasticity", "Smoother tone"],
  },
  {
    icon: "🩹",
    title: "Microneedling with PRP",
    price: "From $360.00",
    desc: "Microneedling enhanced with PRP to maximize skin renewal outcomes.",
    items: ["Faster recovery", "Even skin tone", "Long-term glow"],
  },
  {
    icon: "✦",
    title: "Microneedling",
    price: "From $220.00",
    desc: "The foundational treatment stimulating collagen for smoother, firmer skin.",
    items: ["Reduces fine lines", "Minimizes pores", "Improves firmness"],
  },
];

const ACCENT_PRESETS = ["#7B6EF6", "#D97757", "#2F8F6E", "#C7458A", "#3B6EE0", "#B08D57"];
const BG_PRESETS = ["#F6F5FB", "#FFFFFF", "#F4F1EA", "#0F1115", "#EFF6F2", "#FBF0EE"];

const DEFAULT_ACCENT = "#7B6EF6";
const DEFAULT_BG = "#F6F5FB";

/* ------------------------------------------------------------------ */
/*  Color helpers                                                      */
/* ------------------------------------------------------------------ */

function shade(hex: string, amt: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0x00ff) + amt;
  let b = (num & 0x0000ff) + amt;
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));
  return "#" + (0x1000000 + r * 0x10000 + g * 0x100 + b).toString(16).slice(1);
}

function isDark(hex: string): boolean {
  const num = parseInt(hex.replace("#", ""), 16);
  const r = num >> 16,
    g = (num >> 8) & 0xff,
    b = num & 0xff;
  return 0.299 * r + 0.587 * g + 0.114 * b < 128;
}

/* ------------------------------------------------------------------ */
/*  Theme customizer                                                   */
/* ------------------------------------------------------------------ */

function ThemeBar({
  accent,
  bg,
  onAccent,
  onBg,
  onReset,
}: {
  accent: string;
  bg: string;
  onAccent: (hex: string) => void;
  onBg: (hex: string) => void;
  onReset: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed top-4 right-4 z-[1000] font-sans">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-2.5 text-[0.8rem] text-[var(--ink)] shadow-[0_6px_20px_-8px_rgba(0,0,0,0.2)]"
      >
        <span
          className="h-2.5 w-2.5 rounded-full border border-[var(--line)]"
          style={{
            background: `conic-gradient(from 180deg, ${accent}, ${bg}, ${accent})`,
          }}
        />
        Customize colors
      </button>

      {open && (
        <div className="absolute right-0 top-[calc(100%+10px)] w-[280px] rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-[18px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.25)]">
          <div className="mb-4">
            <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.08em] text-[var(--ink-soft)]">
              Accent color
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {ACCENT_PRESETS.map((c) => (
                <button
                  key={c}
                  aria-label={`Set accent ${c}`}
                  onClick={() => onAccent(c)}
                  style={{ background: c }}
                  className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-[1.15] ${
                    accent.toLowerCase() === c.toLowerCase()
                      ? "border-[var(--ink)]"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
            <input
              type="color"
              value={accent}
              onChange={(e) => onAccent(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-0.5"
            />
          </div>

          <div className="mb-3">
            <label className="mb-2 block text-[0.75rem] uppercase tracking-[0.08em] text-[var(--ink-soft)]">
              Background color
            </label>
            <div className="mb-2 flex flex-wrap gap-2">
              {BG_PRESETS.map((c) => (
                <button
                  key={c}
                  aria-label={`Set background ${c}`}
                  onClick={() => onBg(c)}
                  style={{ background: c }}
                  className={`h-6 w-6 rounded-full border-2 transition-transform hover:scale-[1.15] ${
                    bg.toLowerCase() === c.toLowerCase()
                      ? "border-[var(--ink)]"
                      : "border-transparent"
                  }`}
                />
              ))}
            </div>
            <input
              type="color"
              value={bg}
              onChange={(e) => onBg(e.target.value)}
              className="h-9 w-full rounded-lg border border-[var(--line)] bg-[var(--surface)] p-0.5"
            />
          </div>

          <button
            onClick={onReset}
            className="w-full rounded-lg border border-[var(--line)] bg-[var(--bg)] py-2.5 text-[0.8rem] text-[var(--ink-soft)] hover:text-[var(--ink)]"
          >
            Reset defaults
          </button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function SerenityRejuvenationPage() {
  const [accent, setAccent] = useState(DEFAULT_ACCENT);
  const [bg, setBg] = useState(DEFAULT_BG);

  // Load persisted theme
  useEffect(() => {
    const savedAccent = window.localStorage.getItem("serenity-accent");
    const savedBg = window.localStorage.getItem("serenity-bg");
    if (savedAccent) setAccent(savedAccent);
    if (savedBg) setBg(savedBg);
  }, []);

  // Persist theme
  useEffect(() => {
    window.localStorage.setItem("serenity-accent", accent);
  }, [accent]);
  useEffect(() => {
    window.localStorage.setItem("serenity-bg", bg);
  }, [bg]);

  const vars = useMemo(() => {
    const dark = isDark(bg);
    return {
      "--accent": accent,
      "--accent-dark": shade(accent, -30),
      "--bg": bg,
      "--surface": dark ? shade(bg, 18) : "#FFFFFF",
      "--ink": dark ? "#F3F1FA" : "#1F1B2E",
      "--ink-soft": dark ? "#B8B2CC" : "#6B6580",
      "--line": dark ? shade(bg, 30) : "#E7E3F3",
    } as React.CSSProperties;
  }, [accent, bg]);

  function handleReset() {
    setAccent(DEFAULT_ACCENT);
    setBg(DEFAULT_BG);
  }

  return (
    <div
      style={vars}
      className="min-h-screen bg-[var(--bg)] font-sans text-[var(--ink)] antialiased"
    >
      <ThemeBar accent={accent} bg={bg} onAccent={setAccent} onBg={setBg} onReset={handleReset} />

      {/* ---------------- Nav ---------------- */}
      <header className="px-[5vw] pt-[22px]">
        <div className="mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-[18px]">
          <button className="flex items-center gap-1 text-[0.85rem] text-[var(--ink-soft)]">
            Services <span className="text-[0.7rem]">▾</span>
          </button>
          <button className="text-[0.85rem] text-[var(--ink-soft)]">Gallery</button>
          <div className="flex items-center gap-2 font-serif text-[1.4rem] italic text-[var(--accent)]">
            <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
              <path
                d="M13 2C13 2 8 8 8 13C8 17 10 20 13 20C16 20 18 17 18 13C18 8 13 2 13 2Z"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path d="M13 2C13 2 18 8 18 13C18 17 16 20 13 20" stroke="currentColor" strokeWidth="1.2" />
            </svg>
            <span>Serenity</span>
          </div>
          <button className="text-[1rem] text-[var(--ink-soft)]">⚲</button>
          <button className="text-[0.85rem] text-[var(--ink-soft)]">Account</button>
          <button className="rounded-full bg-[var(--accent)] px-[22px] py-2.5 text-[0.85rem] text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--accent-dark)]">
            Login
          </button>
        </div>
      </header>

      {/* ---------------- Hero ---------------- */}
      <section className="mx-auto max-w-[1200px] px-[5vw] pt-[60px] text-center">
        <p className="mb-1.5 font-serif text-[1.1rem] italic text-[var(--accent)]">Serenity</p>
        <h1 className="font-serif text-[clamp(2.4rem,5vw,3.6rem)] font-medium">
          Serenity <span className="italic text-[var(--accent)]">Rejuvenation</span>
        </h1>
        <button className="my-10 rounded-full bg-[var(--accent)] px-[30px] py-3.5 text-[0.95rem] text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--accent-dark)]">
          Contact us
        </button>

        <div className="grid grid-cols-1 overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--surface)] text-left md:grid-cols-[1.3fr_1fr]">
          <div className="relative min-h-[340px]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1620331311520-246422fd82f9?q=80&w=1200&auto=format&fit=crop"
              alt="Aesthetic treatment being performed"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center gap-[18px] border-t border-[var(--line)] px-11 py-[50px] md:border-l md:border-t-0">
            <h2 className="font-serif text-[2rem]">
              Experienced <span className="italic text-[var(--accent)]">Serenity,</span>
            </h2>
            <p className="leading-relaxed text-[var(--ink-soft)]">
              Our team is dedicated to enhancing the natural beauty of each client with personalized
              care and advanced techniques that deliver real, lasting results.
            </p>
            <button className="w-fit rounded-full border-[1.5px] border-[var(--ink)] px-[30px] py-3.5 text-[0.95rem] transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]">
              Know More
            </button>
          </div>
        </div>
      </section>

      {/* ---------------- Purely / Booking ---------------- */}
      <section className="mx-auto mt-[100px] grid max-w-[1200px] grid-cols-1 items-center gap-[60px] px-[5vw] md:grid-cols-2">
        <div>
          <h2 className="mb-[18px] font-serif text-[2.2rem]">
            Purely <span className="italic text-[var(--accent)]">Rejuvenated</span>
          </h2>
          <p className="mb-[26px] max-w-[440px] leading-[1.7] text-[var(--ink-soft)]">
            The moments we live in most closely align with who we are, aging is meant to be honored
            and cherished rather than resisted or hidden away.
          </p>
          <button className="rounded-full bg-[var(--accent)] px-[30px] py-3.5 text-[0.95rem] text-white shadow-[0_8px_24px_-8px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 hover:bg-[var(--accent-dark)]">
            Book a Meeting
          </button>
        </div>

        <div className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] p-7 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.12)]">
          <p className="mb-[18px] font-serif text-[1.3rem]">Book a visit now</p>

          <div className="mb-3 flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3.5">
            <span className="text-[var(--accent)]">☰</span>
            <select className="w-full bg-transparent text-[0.9rem] text-[var(--ink)] outline-none">
              <option>Choose your service type</option>
              <option>Botox</option>
              <option>Fillers</option>
              <option>Microneedling</option>
            </select>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3.5">
            <span className="text-[var(--accent)]">📅</span>
            <select className="w-full bg-transparent text-[0.9rem] text-[var(--ink)] outline-none">
              <option>One, Two, Three, Mobile...</option>
            </select>
          </div>
        </div>
      </section>

      {/* ---------------- Treatments ---------------- */}
      <section className="mx-auto mt-[120px] max-w-[1200px] px-[5vw]">
        <p className="mb-2.5 text-center text-[0.75rem] uppercase tracking-[0.12em] text-[var(--accent)]">
          Our Treatments
        </p>
        <h2 className="mb-[50px] text-center font-serif text-[2.4rem]">
          Advanced <span className="italic text-[var(--accent)]">Treatments</span>
        </h2>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {TREATMENTS.map((t) => (
            <div
              key={t.title}
              className="flex flex-col gap-3.5 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] p-[26px]"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="mb-0.5 font-serif text-[1.3rem]">{t.title}</h3>
                  <p className="text-[0.85rem] text-[var(--accent)]">{t.price}</p>
                </div>
                <div className="flex h-[38px] w-[38px] items-center justify-center rounded-full border border-[var(--line)] bg-[var(--bg)] text-[1rem]">
                  {t.icon}
                </div>
              </div>
              <p className="text-[0.85rem] leading-relaxed text-[var(--ink-soft)]">{t.desc}</p>
              <ul className="flex flex-col gap-1.5 text-[0.82rem] text-[var(--ink-soft)]">
                {t.items.map((i) => (
                  <li key={i}>
                    <span className="text-[var(--accent)]">— </span>
                    {i}
                  </li>
                ))}
              </ul>
              <button className="mt-auto rounded-full bg-[var(--accent)] px-[22px] py-2.5 text-[0.85rem] text-white transition-colors hover:bg-[var(--accent-dark)]">
                Book Now
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- Mid banner ---------------- */}
      <section className="relative mt-[130px] h-[420px] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1633681926022-84c23e8cb2d6?q=80&w=1600&auto=format&fit=crop"
          alt="Treatment room"
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-[70px] left-[5vw] max-w-[280px] rounded-2xl bg-white/90 p-[26px_30px] backdrop-blur-sm">
          <p className="mb-4 font-serif text-[1.6rem] leading-tight text-[#1F1B2E]">
            Serenity
            <br />
            <span className="italic text-[var(--accent)]">Rejuvenation</span>
          </p>
          <button className="rounded-full bg-[var(--accent)] px-[22px] py-2.5 text-[0.85rem] text-white hover:bg-[var(--accent-dark)]">
            Book a Meeting
          </button>
        </div>
        <div className="absolute inset-x-0 bottom-0 flex gap-[60px] overflow-hidden whitespace-nowrap bg-[var(--ink)] px-[30px] py-3 text-[0.75rem] uppercase tracking-[0.15em] text-[var(--bg)]">
          <span>renew &amp; restore</span>
          <span>renew &amp; restore</span>
          <span>renew &amp; restore</span>
          <span>renew &amp; restore</span>
        </div>
      </section>

      {/* ---------------- RRR row ---------------- */}
      <p className="flex flex-wrap justify-center gap-[50px] px-[5vw] py-9 text-center font-serif text-[1.3rem] text-[var(--ink-soft)]">
        <span>RENEW</span>
        <span>RESTORE</span>
        <span className="font-semibold not-italic text-[var(--accent)]">REBALANCE</span>
        <span>RENEW</span>
        <span>RESTORE</span>
        <span>REBALANCE</span>
      </p>

      {/* ---------------- Results ---------------- */}
      <section className="mx-auto mb-[120px] mt-10 grid max-w-[1200px] grid-cols-1 items-center gap-[60px] px-[5vw] md:grid-cols-[1fr_0.9fr]">
        <div>
          <h2 className="mb-[18px] font-serif text-[2.3rem] leading-tight">
            Visible change.
            <br />
            Lasting results.
          </h2>
          <p className="mb-[30px] max-w-[440px] leading-[1.7] text-[var(--ink-soft)]">
            Every transformation is a great combination of luxury and beauty, backed by clinical
            results our clients trust and return for.
          </p>

          <div className="mb-[30px] flex flex-wrap gap-10">
            <div>
              <p className="font-serif text-[2rem] italic text-[var(--accent)]">500+</p>
              <p className="text-[0.8rem] text-[var(--ink-soft)]">Happy Clients</p>
            </div>
            <div>
              <p className="font-serif text-[2rem] italic text-[var(--accent)]">6</p>
              <p className="text-[0.8rem] text-[var(--ink-soft)]">Years Experience</p>
            </div>
            <div>
              <p className="font-serif text-[2rem] italic text-[var(--accent)]">93%</p>
              <p className="text-[0.8rem] text-[var(--ink-soft)]">Satisfaction</p>
            </div>
          </div>

          <p className="mb-[22px] leading-relaxed text-[var(--ink-soft)]">
            <strong className="font-medium text-[var(--ink)]">Microneedling</strong>
            <br />
            Results you can see with confidence that lasts, tailored entirely around you.
          </p>
          <button className="rounded-full border-[1.5px] border-[var(--ink)] px-[30px] py-3.5 text-[0.95rem] transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]">
            Learn More
          </button>
        </div>

        <div className="relative overflow-hidden rounded-[20px]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1616394158624-1a5b0f229c9d?q=80&w=1000&auto=format&fit=crop"
            alt="Client result"
            className="h-[520px] w-full object-cover"
          />
          <div className="absolute bottom-5 left-5 flex items-center gap-2.5 rounded-[14px] bg-white/95 px-4 py-3 text-[0.85rem]">
            <div className="flex">
              <span
                className="-ml-0 h-6 w-6 rounded-full border-2 border-white"
                style={{ background: "var(--accent)" }}
              />
              <span
                className="-ml-2 h-6 w-6 rounded-full border-2 border-white"
                style={{ background: "var(--accent)" }}
              />
              <span
                className="-ml-2 h-6 w-6 rounded-full border-2 border-white"
                style={{ background: "var(--accent)" }}
              />
            </div>
            <p className="text-[#1F1B2E]">
              4.9 <span className="text-[0.75rem] text-[var(--accent)]">★★★★★</span>
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- Footer ---------------- */}
      <footer className="border-t border-[var(--line)] bg-[var(--surface)] px-[5vw] pb-[30px] pt-[70px]">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.4fr]">
          <div>
            <div className="flex items-center gap-2 font-serif text-[1.4rem] italic text-[var(--accent)]">
              <svg width="22" height="22" viewBox="0 0 26 26" fill="none">
                <path
                  d="M13 2C13 2 8 8 8 13C8 17 10 20 13 20C16 20 18 17 18 13C18 8 13 2 13 2Z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                />
                <path d="M13 2C13 2 18 8 18 13C18 17 16 20 13 20" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span>Serenity</span>
            </div>
            <p className="mt-3 max-w-[220px] text-[0.85rem] leading-relaxed text-[var(--ink-soft)]">
              Rejuvenation studio for confident, radiant skin.
            </p>
          </div>

          <div>
            <p className="mb-4 text-[0.75rem] uppercase tracking-[0.1em] text-[var(--ink-soft)]">
              Services
            </p>
            <p className="mb-2.5 text-[0.9rem]">Basic Botox</p>
            <p className="mb-2.5 text-[0.9rem]">Advanced Botox</p>
            <p className="mb-2.5 text-[0.9rem]">Fillers</p>
            <p className="mb-2.5 text-[0.9rem]">Microneedling</p>
          </div>

          <div>
            <p className="mb-4 text-[0.75rem] uppercase tracking-[0.1em] text-[var(--ink-soft)]">
              Company
            </p>
            <p className="mb-2.5 text-[0.9rem]">About Us</p>
            <p className="mb-2.5 text-[0.9rem]">Gallery</p>
            <p className="mb-2.5 text-[0.9rem]">Contact</p>
            <p className="mb-2.5 text-[0.9rem]">Careers</p>
          </div>

          <div>
            <p className="mb-4 text-[0.75rem] uppercase tracking-[0.1em] text-[var(--ink-soft)]">
              Ready for your glow?
            </p>
            <p className="mb-[18px] text-[0.85rem] text-[var(--ink-soft)]">
              Book a personalized consultation with our team today.
            </p>
            <button className="rounded-full bg-[var(--accent)] px-[22px] py-2.5 text-[0.85rem] text-white hover:bg-[var(--accent-dark)]">
              Book Consultation
            </button>
          </div>
        </div>

        <p className="mx-auto mt-[50px] max-w-[1200px] border-t border-[var(--line)] pt-6 text-center text-[0.78rem] text-[var(--ink-soft)]">
          © 2026 Serenity Rejuvenation. All rights reserved.
        </p>
      </footer>
    </div>
  );
}