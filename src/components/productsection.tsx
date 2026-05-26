"use client";

import { Highlighter } from "./ui/highlighter";

type Product = {
  title: string;
  price?: string;
  description: string;
  benefits: string[];
};

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
    title: "PRP Therapy",
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
    title: "PRF Therapy",
    description:
      "A concentrated regenerative treatment supporting natural rejuvenation.",
    benefits: [
      "Under-eye rejuvenation",
      "Texture improvement",
      "Hair restoration",
      "Natural enhancement",
    ],
  },
];

const ProductsSection = () => {
  return (
    <section className="w-full pt-20 pb-5 md:px-10 bg-white dark:bg-[#07264f]">
      <div className="max-w-7xl mx-auto">
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

          <h2 className="text-4xl md:text-6xl font-serif font-semibold mt-4 text-[#07264f] dark:text-[#e3ae72]">
            Advanced Treatments.
            <br />
            Natural Results.
          </h2>

          <p className="mt-6 max-w-2xl mx-auto text-lg text-[#07264f]/60 dark:text-[#e3ae72]/70">
            Each treatment is designed with precision and care to help you
            achieve radiant, healthy skin.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div
              key={index}
              className="
                rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group
                bg-white border border-[#07264f]/15
                dark:bg-[#0a3366] dark:border-[#e3ae72]/25
              "
            >
              {/* Top image placeholder */}
              <div className="h-56 relative overflow-hidden bg-[#07264f]/8 dark:bg-[#0d3d7a]">
                <div className="absolute inset-0 bg-gradient-to-br from-[#07264f]/10 to-[#07264f]/5 dark:from-[#0a3060] dark:to-[#07264f]" />
                <div className="absolute bottom-0 left-0 right-0 h-px bg-[#07264f]/15 dark:bg-[#e3ae72]/30" />
              </div>

              {/* Content */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4 gap-3">
                  <h3 className="text-2xl font-serif font-semibold text-[#07264f] dark:text-[#e3ae72]">
                    {product.title}
                  </h3>

                  {product.price && (
                    <span
                      className="
                      px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap
                      border border-[#07264f]/30 text-[#07264f] bg-[#07264f]/5
                      dark:border-[#e3ae72]/40 dark:text-[#e3ae72] dark:bg-[#e3ae72]/8
                    "
                    >
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
                      <span className="mr-2 text-[#07264f] dark:text-[#e3ae72]">
                        ✦
                      </span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <button className="mt-auto font-medium hover:translate-x-1 transition-transform cursor-none text-[#07264f] dark:text-[#e3ae72]">
                  Learn More →
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div
          className="
          mt-10 rounded-3xl p-8 flex flex-col md:flex-row justify-between items-center gap-6
          bg-[#07264f]
          dark:bg-[#0a3366] dark:border dark:border-[#e3ae72]/30
        "
        >
          <div>
            <h4 className="text-2xl font-serif mb-2 text-white dark:text-[#e3ae72]">
              Not sure which treatment is right for you?
            </h4>
            <p className="text-white/60 dark:text-[#e3ae72]/60">
              Book a consultation and let our experts guide your skincare
              journey.
            </p>
          </div>

          <button
            className="
            px-8 py-4 rounded-full cursor-pointer transition font-medium
            bg-[#e3ae72] text-[#07264f] hover:bg-[#d49e5e]
            dark:bg-[#e3ae72] dark:text-[#07264f] dark:hover:bg-[#d49e5e]
          "
          >
            Book Consultation
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;

const TitleComponent = ({ title }: { title: string }) => (
  <p className="font-bold uppercase font-sans">{title}</p>
);
