"use client";

import React from "react";
import { FollowerPointerCard } from "./ui/following-pointer";

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
      "Stimulate your skin’s natural renewal process with advanced collagen induction treatment.",
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
      "Enhance results using your body’s own growth factors for natural skin renewal.",
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
    <section className="w-full py-20 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-16">
          <p className="uppercase tracking-[4px] text-sm text-[#8b6f5c]">
            Our Products
          </p>

          <h2 className="text-4xl md:text-6xl font-serif font-semibold text-[#2e2018] mt-4">
            Advanced Treatments.
            <br />
            Natural Results.
          </h2>

          <p className="mt-6 text-[#6f625a] max-w-2xl mx-auto text-lg">
            Each treatment is designed with precision and care to help you
            achieve radiant, healthy skin.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <FollowerPointerCard
            key={index}
              title={<TitleComponent title="Click to Book Appointment" />}
            >
              <div
                className="bg-white rounded-3xl overflow-hidden border border-[#e7ddd4] shadow-sm hover:shadow-xl transition-all duration-300 group"
              >
                {/* Top image placeholder */}
                <div className="h-56 bg-[#e9dfd5] relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-br from-[#d8c6b7] to-[#f3ece6]" />
                </div>

                {/* Content */}
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4 gap-3">
                    <h3 className="text-2xl font-serif font-semibold text-[#2e2018]">
                      {product.title}
                    </h3>

                    {product.price && (
                      <span className="px-4 py-2 border border-[#d7b89d] rounded-full text-sm font-medium text-[#5a4032]">
                        {product.price}
                      </span>
                    )}
                  </div>

                  <p className="text-[#6f625a] mb-6 leading-relaxed">
                    {product.description}
                  </p>

                  <ul className="space-y-2 mb-6">
                    {product.benefits.map((benefit, i) => (
                      <li
                        key={i}
                        className="flex items-center text-sm text-[#4b3a2f]"
                      >
                        <span className="mr-2 text-[#b58a68]">✦</span>
                        {benefit}
                      </li>
                    ))}
                  </ul>

                  <button className="mt-auto text-[#2e2018] font-medium hover:translate-x-1 transition-transform cursor-none">
                    Learn More →
                  </button>
                </div>
              </div>
            </FollowerPointerCard>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 bg-white rounded-3xl border border-[#e7ddd4] p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <h4 className="text-2xl font-serif text-[#2e2018] mb-2">
              Not sure which treatment is right for you?
            </h4>
            <p className="text-[#6f625a]">
              Book a consultation and let our experts guide your skincare
              journey.
            </p>
          </div>

          <button className="bg-[#2e2018] text-white px-8 py-4 rounded-full hover:bg-[#160e0a] transition">
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
