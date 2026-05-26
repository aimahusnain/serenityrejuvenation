"use client";

const items: string[] = [
  "Microneedling",
  "Microneedling with PRP (Platelet-Rich Plasma)",
  "Microneedling with PRF (Platelet-Rich Fibrin)",
  "Microneedling with Sculptra®",
  "PRP (Platelet-Rich Plasma)",
  "PRF (Platelet-Rich Fibrin)",
  "Facial session",
];

export default function TextSlider() {
  return (
    <div className="relative w-full overflow-hidden">
      <div className="pointer-events-none absolute left-0 top-0 h-full w-8 bg-linear-to-r rounded-b-xl overflow-hidden from-[#e3ae72] to-transparent z-10" />
      <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-linear-to-l from-[#e3ae72] rounded-b-xl overflow-hidden to-transparent z-10" />

      <div className="w-full overflow-hidden bg-[#e3ae72] py-2 rounded-b-xl">
        <div className="flex w-max animate-marquee whitespace-nowrap">
          {[...items, ...items].map((text, i) => (
            <span
              key={i}
              className="text-black font-arp text-sm md:text-base mx-8 tracking-wide"
            >
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
