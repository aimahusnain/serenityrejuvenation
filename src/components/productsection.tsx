"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Highlighter } from "./ui/highlighter";

type Product = {
  title: string;
  price?: string;
  description: string;
  benefits: string[];
};

const BOOKING_URL = "https://your-booking-url.com";

/* ── PRODUCTS ── */
const products: Product[] = [
  {
    title: "Microneedling",
    price: "$350",
    description:
      "Stimulate your skin's natural renewal process with advanced collagen induction treatment.",
    benefits: [
      "Fine lines & wrinkles",
      "Acne scars",
      "Enlarged pores",
      "Skin rejuvenation",
    ],
  },
  {
    title: "Microneedling with PRP",
    price: "$600",
    description:
      "Enhance results using your body's own growth factors for natural skin renewal.",
    benefits: [
      "Enhanced collagen",
      "Faster recovery",
      "Improved texture",
      "Natural glow",
    ],
  },
  {
    title: "Microneedling with PRF",
    price: "$600",
    description:
      "Advanced regenerative treatment for long-lasting rejuvenation and healing.",
    benefits: [
      "Skin tightening",
      "Under-eye rejuvenation",
      "Improved elasticity",
      "Collagen support",
    ],
  },
  {
    title: "Microneedling with Sculptra®",
    price: "$600",
    description:
      "Restore volume and improve firmness with long-term collagen stimulation.",
    benefits: [
      "Volume restoration",
      "Improved firmness",
      "Texture refinement",
      "Youthful appearance",
    ],
  },
  {
    title: "PRP Therapy (Platelet-Rich Plasma)",
    description:
      "Natural regenerative treatment supporting rejuvenation and healthier skin.",
    benefits: [
      "Skin renewal",
      "Collagen production",
      "Hair restoration",
      "Improved radiance",
    ],
  },
  {
    title: "PRF Therapy (Platelet-Rich Fibrin)",
    description:
      "A concentrated regenerative treatment supporting natural rejuvenation.",
    benefits: [
      "Under-eye rejuvenation",
      "Texture improvement",
      "Hair restoration",
      "Natural enhancement",
    ],
  },
  {
    title: "GLP-1 Wellness Program",
    description:
      "Our GLP-1 wellness program provides personalized support designed to assist clients on their weight management and wellness journey.",
    benefits: [
      "Weight management support",
      "Appetite regulation assistance",
      "Lifestyle coaching",
      "Wellness monitoring",
      "Long-term success strategies",
    ],
  },
  {
    title: "Peptide Therapy",
    description:
      "Peptide Therapy supports wellness optimization through targeted amino acid chains designed to promote cellular communication and overall health goals.",
    benefits: [
      "Energy optimization",
      "Recovery support",
      "Healthy aging",
      "Metabolic wellness",
      "Performance enhancement",
    ],
  },
  {
    title: "IV Hydration Therapy",
    description:
      "Restore, replenish, and recharge with IV Hydration Therapy. Our wellness infusions deliver hydration, vitamins, and nutrients directly into the bloodstream.",
    benefits: [
      "Hydration restoration",
      "Energy and wellness support",
      "Recovery and performance",
      "Immune health",
      "Beauty and skin wellness",
    ],
  },
  {
    title: "Fillers",
    price: "$11.00",
    description:
      "Enhance your natural beauty with customized lip enhancement treatments designed to add volume, shape, hydration, and definition.",
    benefits: [
      "Lip hydration",
      "Volume enhancement",
      "Defining borders",
      "Improving symmetry",
    ],
  },
  {
    title: "Advanced Botox",
    price: "$13.00",
    description:
      "Our Advanced Botox treatment provides a more comprehensive facial rejuvenation approach for enhanced smoothing and contouring results.",
    benefits: [
      "Softening moderate to advanced lines",
      "Facial balancing and contour enhancement",
      "Preventative aging support",
      "Refreshed, natural appearance",
    ],
  },
  {
    title: "Basic Botox",
    price: "$11.00",
    description:
      "Refresh your appearance with our Basic Botox treatment designed to soften fine lines and create a naturally refreshed look.",
    benefits: [
      "Forehead lines",
      "Frown lines",
      "Crow's feet",
      "Subtle enhancement",
    ],
  },
];

/* ── IMAGE MAP ── */
const productImages: Record<string, string> = {
  Microneedling:
    "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=800&q=80",
  "Microneedling with PRP":
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80",
  "Microneedling with PRF":
    "https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&w=800&q=80",
  "Microneedling with Sculptra®":
    "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
  "PRP Therapy (Platelet-Rich Plasma)":
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=800&q=80",
  "PRF Therapy (Platelet-Rich Fibrin)":
    "https://images.unsplash.com/photo-1612277795421-9bc7706a4a34?auto=format&fit=crop&w=800&q=80",
  "GLP-1 Wellness Program":
    "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?auto=format&fit=crop&w=800&q=80",
  "Peptide Therapy":
    "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
  "IV Hydration Therapy":
    "https://images.unsplash.com/photo-1584362917165-526a968579e8?auto=format&fit=crop&w=800&q=80",
  Fillers:
    "https://images.unsplash.com/photo-1594824804732-5f2c1a0c2d7c?auto=format&fit=crop&w=800&q=80",
  "Advanced Botox":
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
  "Basic Botox":
    "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?auto=format&fit=crop&w=800&q=80",
};

/* ── ICONS ── */
function StarDiamond({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="currentColor"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M8 0 L9.5 6.5 L16 8 L9.5 9.5 L8 16 L6.5 9.5 L0 8 L6.5 6.5 Z" />
    </svg>
  );
}

/* ── PRODUCT CARD ── */
function ProductCard({ product, index }: { product: Product; index: number }) {
  const [visible, setVisible] = useState(false);
  const [hoveredBenefit, setHoveredBenefit] = useState<number | null>(null);
  const [priceRevealed, setPriceRevealed] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const delay = (index % 3) * 120;
          setTimeout(() => {
            setVisible(true);
            setTimeout(() => setPriceRevealed(true), 600);
          }, delay);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (cardRef.current) observerRef.current.observe(cardRef.current);
    return () => observerRef.current?.disconnect();
  }, [index]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 6, y: -x * 6 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      style={{
        transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        opacity: visible ? 1 : 0,
        translate: visible ? "0 0" : "0 28px",
        transition:
          "opacity 0.65s ease, translate 0.65s ease, transform 0.15s ease-out",
        transformStyle: "preserve-3d",
      }}
      className="relative"
    >
      {/* Ambient glow */}
      <div className="absolute -inset-4 -z-10 rounded-[48px] bg-[#07264f]/4 dark:bg-[#e3ae72]/4 blur-2xl pointer-events-none" />

      <div className="rounded-[28px] overflow-hidden bg-white dark:bg-[#07264f] border border-[#07264f]/12 dark:border-[#e3ae72]/20 shadow-[0_8px_40px_rgba(7,38,79,0.10)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] h-full flex flex-col">
        {/* ── TOP BAND ── */}
        <div className="relative bg-[#07264f] dark:bg-[#e3ae72] px-7 pt-7 pb-9 overflow-hidden flex-shrink-0">
          {/* Dot grid */}
          <div
            className="absolute inset-0 pointer-events-none opacity-100"
            style={{
              backgroundImage:
                "radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
            }}
          />
          {/* Shimmer */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%)",
              backgroundSize: "200% 100%",
              animation: `shimmer ${3 + (index % 3) * 0.4}s ease-in-out infinite`,
              animationDelay: `${index * 0.2}s`,
            }}
          />

          {/* Tag */}
          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium tracking-[0.18em] uppercase text-white/55 dark:text-[#07264f]/55 bg-white/10 dark:bg-[#07264f]/15 px-3 py-1.5 rounded-full">
            <StarDiamond className="w-2 h-2" />
            Treatment
          </span>

          {/* Title row: text + circular image */}
          <div className="flex items-end justify-between mt-4 gap-3">
            <h3
              className="text-[1.6rem] font-light text-white dark:text-[#07264f] leading-[1.1] tracking-tight"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              {/* Split title: last word italic bold, rest light */}
              {(() => {
                const words = product.title.split(" ");
                if (words.length === 1)
                  return (
                    <span className="italic font-semibold">{words[0]}</span>
                  );
                const rest = words.slice(0, -1).join(" ");
                const last = words[words.length - 1];
                return (
                  <>
                    {rest}
                    <br />
                    <span className="italic font-semibold">{last}</span>
                  </>
                );
              })()}
            </h3>

            {/* Circular image */}
            <div
              className="shrink-0 relative w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 dark:border-[#07264f]/30 shadow-md"
              style={{
                animation: `float ${3.5 + (index % 4) * 0.3}s ease-in-out infinite`,
              }}
            >
              <Image
                src={
                  productImages[product.title] ||
                  "https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&w=200&q=80"
                }
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {/* Price */}
          {product.price && (
            <div className="mt-4 flex items-baseline gap-2">
              <span className="text-white/45 dark:text-[#07264f]/45 text-xs font-light tracking-wider uppercase">
                From
              </span>
              <div className="overflow-hidden">
                <span
                  className="inline-block"
                  style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    clipPath: priceRevealed
                      ? "inset(0 0% 0 0)"
                      : "inset(0 100% 0 0)",
                    transition:
                      "clip-path 0.85s cubic-bezier(0.76, 0, 0.24, 1)",
                  }}
                >
                  <span className="text-[2rem] font-light text-white dark:text-[#07264f] leading-none tracking-tight">
                    {product.price}
                  </span>
                </span>
              </div>
            </div>
          )}
        </div>

        {/* ── BOTTOM CONTENT ── */}
        <div className="px-7 pt-6 pb-7 flex flex-col flex-1 bg-white dark:bg-[#07264f]">
          <p className="text-[13px] leading-relaxed text-[#07264f]/55 dark:text-[#e3ae72]/65 mb-5">
            {product.description}
          </p>

          <div className="h-px bg-[#07264f]/8 dark:bg-[#e3ae72]/15 mb-5" />

          <ul className="space-y-2.5 flex-1">
            {product.benefits.map((benefit, i) => (
              <li
                key={i}
                onMouseEnter={() => setHoveredBenefit(i)}
                onMouseLeave={() => setHoveredBenefit(null)}
                className="flex items-center gap-2.5 cursor-default"
                style={{
                  transform:
                    hoveredBenefit === i ? "translateX(6px)" : "translateX(0)",
                  transition:
                    "transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
              >
                <StarDiamond
                  className={`w-2 h-2 shrink-0 transition-all duration-300 ${
                    hoveredBenefit === i
                      ? "text-[#07264f] dark:text-[#e3ae72] scale-125"
                      : "text-[#07264f]/30 dark:text-[#e3ae72]/35"
                  }`}
                />
                <span
                  className={`text-[12.5px] font-light tracking-wide transition-colors duration-200 ${
                    hoveredBenefit === i
                      ? "text-[#07264f] dark:text-[#e3ae72]"
                      : "text-[#07264f]/65 dark:text-[#e3ae72]/65"
                  }`}
                >
                  {benefit}
                </span>
              </li>
            ))}
          </ul>

          <div className="h-px bg-[#07264f]/8 dark:bg-[#e3ae72]/15 mt-5 mb-5" />

          {/* Actions */}
          <div className="flex items-center justify-between gap-3">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center bg-[#07264f] dark:bg-[#e3ae72] text-white dark:text-[#07264f] text-[11px] font-medium tracking-[0.12em] uppercase px-5 py-3 rounded-full transition-all duration-200 hover:bg-[#07264f]/85 dark:hover:bg-[#d49e5e] active:scale-95 focus-visible:outline-none"
            >
              Book Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── SECTION ── */
const ProductsSection = () => {
  return (
    <section className="w-full pt-20 pb-5 md:px-10 bg-white dark:bg-[#07264f]">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400;1,600&family=Jost:wght@300;400;500&display=swap');

        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
      `}</style>

      <div
        className="max-w-7xl mx-auto"
        style={{ fontFamily: "'Jost', sans-serif" }}
      >
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[4px] text-sm text-white dark:text-black">
            <Highlighter
              action="highlight"
              lightColor="#07264f"
              darkColor="#e3ae72"
            >
              Our Products
            </Highlighter>
          </p>
          <h2
            className="text-4xl md:text-6xl font-semibold mt-4 text-[#07264f] dark:text-[#e3ae72]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Advanced Treatments.
            <br />
            <span className="italic font-light">Natural Results.</span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-[#07264f]/60 dark:text-[#e3ae72]/70 font-light">
            Each treatment is designed with precision and care to help you
            achieve radiant, healthy skin.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <ProductCard key={index} product={product} index={index} />
          ))}
        </div>

        {/* CTA */}
        <div className="mt-14 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#07264f] dark:bg-[#0a3366] dark:border dark:border-[#e3ae72]/30">
          <div>
            <h4
              className="text-2xl mb-2 text-white dark:text-[#e3ae72] font-light"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Not sure which treatment is{" "}
              <span className="italic">right for you?</span>
            </h4>
            <p className="text-white/60 dark:text-[#e3ae72]/60 text-sm font-light">
              Book a consultation and let our experts guide your skincare
              journey.
            </p>
          </div>
          <button className="px-8 py-4 rounded-full font-medium text-sm tracking-wide bg-[#e3ae72] text-[#07264f] hover:bg-[#d49e5e] transition-colors duration-200 whitespace-nowrap active:scale-95">
            Book Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
