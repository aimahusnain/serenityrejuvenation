"use client";

import Image from "next/image";
import { Highlighter } from "./ui/highlighter";

type Product = {
  title: string;
  price?: string;
  description: string;
  benefits: string[];
};

/* ✅ YOUR ORIGINAL PRODUCTS ARRAY (UNCHANGED) */
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
    benefits: ["Enhanced collagen", "Faster recovery", "Improved texture", "Natural glow"],
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
    benefits: ["Skin renewal", "Collagen production", "Hair restoration", "Improved radiance"],
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
    benefits: ["Forehead lines", "Frown lines", "Crow’s feet", "Subtle enhancement"],
  },
];

/* ✅ IMAGE MAP (SEPARATE FROM PRODUCTS — CLEAN APPROACH) */
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

const ProductsSection = () => {
  return (
    <section className="w-full pt-20 pb-5 md:px-10 bg-white dark:bg-[#07264f]">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[4px] text-sm text-white dark:text-black">
            <Highlighter action="highlight" lightColor="#07264f" darkColor="#e3ae72">
              Our Products
            </Highlighter>
          </p>

          <h2 className="text-4xl md:text-6xl font-serif font-semibold mt-4 text-[#07264f] dark:text-[#e3ae72]">
            Advanced Treatments.
            <br />
            Natural Results.
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-[#07264f]/60 dark:text-[#e3ae72]/70">
            Each treatment is designed with precision and care to help you achieve radiant, healthy skin.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group bg-white border border-[#07264f]/15 dark:bg-[#0a3366] dark:border-[#e3ae72]/25"
            >
              {/* Circular Image */}
              <div className="h-56 relative flex items-center justify-center bg-[#07264f]/5 dark:bg-[#0d3d7a]">
                <div className="relative w-28 h-28 md:w-32 md:h-32">
                  <Image
                    src={productImages[product.title]}
                    alt={product.title}
                    fill
                    className="object-cover rounded-full border-4 border-white dark:border-[#e3ae72] shadow-lg"
                  />
                </div>

                <div className="absolute w-40 h-40 rounded-full border border-[#07264f]/10 dark:border-[#e3ae72]/20" />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h3 className="text-2xl font-serif font-semibold text-[#07264f] dark:text-[#e3ae72]">
                    {product.title}
                  </h3>

                  {product.price && (
                    <span className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap border border-[#07264f]/30 text-[#07264f] bg-[#07264f]/5 dark:border-[#e3ae72]/40 dark:text-[#e3ae72] dark:bg-[#e3ae72]/8">
                      {product.price}
                    </span>
                  )}
                </div>

                <p className="mb-6 leading-relaxed text-[#07264f]/60 dark:text-[#e3ae72]/65">
                  {product.description}
                </p>

                <ul className="space-y-2 mb-6">
                  {product.benefits.map((benefit, i) => (
                    <li
                      key={i}
                      className="flex items-center text-sm text-[#07264f]/80 dark:text-[#e3ae72]/85"
                    >
                      <span className="mr-2 text-[#07264f] dark:text-[#e3ae72]">✦</span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <button className="mt-auto font-medium hover:translate-x-1 transition-transform cursor-pointer text-[#07264f] dark:text-[#e3ae72]">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-10 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-[#07264f] dark:bg-[#0a3366] dark:border dark:border-[#e3ae72]/30">
          <div>
            <h4 className="text-2xl font-serif mb-2 text-white dark:text-[#e3ae72]">
              Not sure which treatment is right for you?
            </h4>
            <p className="text-white/60 dark:text-[#e3ae72]/60">
              Book a consultation and let our experts guide your skincare journey.
            </p>
          </div>

          <button className="px-8 py-4 rounded-full font-medium bg-[#e3ae72] text-[#07264f] hover:bg-[#d49e5e] dark:hover:bg-[#d49e5e]">
            Book Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;