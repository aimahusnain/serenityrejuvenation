"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Highlighter } from "./ui/highlighter";

/* ── TYPES ── */
type Product = {
  id: string;
  title: string;
  price?: string | null;
  description: string;
  image: string;
  benefits: string[];
};

/* ── BOOKING URL ── */
const BOOKING_URL = "https://your-booking-url.com";

/* ── ICON ── */
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const cardRef = useRef<HTMLDivElement>(null);
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
      <div className="absolute -inset-4 -z-10 rounded-[48px] bg-[#07264f]/4 dark:bg-[#e3ae72]/4 blur-2xl" />

      <div className="rounded-[28px] overflow-hidden bg-white dark:bg-[#07264f] border border-[#07264f]/12 dark:border-[#e3ae72]/20 shadow-[0_8px_40px_rgba(7,38,79,0.10)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.3)] h-full flex flex-col">
        {/* TOP */}
        <div className="relative bg-[#07264f] dark:bg-[#e3ae72] px-7 pt-7 pb-9">
          <span className="inline-flex items-center gap-1.5 text-[10px] uppercase text-white/60 bg-white/10 px-3 py-1.5 rounded-full">
            <StarDiamond className="w-2 h-2" />
            Treatment
          </span>

          <div className="flex items-end justify-between mt-4">
            <h3 className="text-[1.6rem] font-light text-white leading-[1.1]">
              {product.title}
            </h3>

            <div className="relative w-16 h-16 rounded-full overflow-hidden border border-white/30">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>
          </div>

          {product.price && (
            <div className="mt-4 text-white/80">
              From{" "}
              <span
                style={{
                  clipPath: priceRevealed
                    ? "inset(0 0 0 0)"
                    : "inset(0 100% 0 0)",
                  transition: "clip-path 0.8s ease",
                  display: "inline-block",
                }}
                className="text-2xl font-light"
              >
                ${product.price}.00
              </span>
            </div>
          )}
        </div>

        {/* BOTTOM */}
        <div className="px-7 pt-6 pb-7 flex flex-col flex-1">
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-5">
            {product.description}
          </p>

          <ul className="space-y-2 flex-1">
            {product.benefits.map((b, i) => (
              <li
                key={i}
                onMouseEnter={() => setHoveredBenefit(i)}
                onMouseLeave={() => setHoveredBenefit(null)}
                className="flex items-center gap-2 cursor-default transition"
              >
                <StarDiamond
                  className={`w-2 h-2 ${
                    hoveredBenefit === i
                      ? "text-[#07264f] dark:text-[#e3ae72]"
                      : "text-gray-400"
                  }`}
                />
                <span className="text-sm">{b}</span>
              </li>
            ))}
          </ul>

          <a
            href={BOOKING_URL}
            target="_blank"
            className="mt-6 bg-[#07264f] dark:bg-[#e3ae72] text-white dark:text-[#07264f] text-center py-3 rounded-full text-sm uppercase tracking-wider"
          >
            Book Now
          </a>
        </div>
      </div>
    </div>
  );
}

/* ── SECTION ── */
export default function ProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section className="w-full pt-20 pb-10 bg-white dark:bg-[#07264f]">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-14">
          <p className="uppercase tracking-widest text-sm dark:text-black! text-white!">
            <Highlighter
              action="highlight"
              lightColor="#07264f"
              darkColor="#e3ae72"
            >
              Our Products
            </Highlighter>
          </p>

          <h2 className="text-4xl md:text-6xl font-light mt-4 text-[#07264f] dark:text-[#e3ae72]">
            Advanced Treatments
          </h2>
        </div>

        {/* GRID */}
        {loading ? (
          <p className="text-center text-gray-500">Loading products...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {products.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
