// app/page.tsx

import Image from "next/image";
import {
  Mail,
  Droplets,
  Sparkles,
  Syringe,
  Flower2,
} from "lucide-react";
import { FaInstagram, FaFacebookF } from "react-icons/fa";


export default function ComingSoonBanner() {
  return (
    <main className="min-h-screen bg-[#f7f7f5] overflow-hidden">
      <section className="grid lg:grid-cols-2 min-h-screen">
        {/* LEFT CONTENT */}
        <div className="flex items-center justify-center px-6 py-16 lg:px-20">
          <div className="max-w-xl w-full">
            {/* LOGO */}
            <div className="mb-8">
              <Image
                src="/logo.png"
                alt="Serenity Rejuvenation"
                width={180}
                height={180}
                className="object-contain"
                priority
              />
            </div>

            {/* HEADING */}
            <div className="space-y-4">
              <p className="tracking-[0.4em] text-[#0e2341] uppercase text-sm font-medium">
                Website
              </p>

              <h1 className="text-5xl md:text-7xl font-bold leading-none text-[#0e2341]">
                UNDER
                <br />
                CONSTRUCTION
              </h1>
            </div>

            {/* DESCRIPTION */}
            <p className="mt-8 text-lg text-gray-600 leading-relaxed max-w-lg">
              We&apos;re working behind the scenes to bring you something amazing.
              Luxury hydration, wellness, and rejuvenation experiences are on
              the way.
            </p>

            {/* FEATURES */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-12">
              <FeatureItem
                icon={<Droplets size={28} />}
                label="Restore"
              />
              <FeatureItem
                icon={<Flower2 size={28} />}
                label="Rebalance"
              />
              <FeatureItem
                icon={<Sparkles size={28} />}
                label="Renew"
              />
              <FeatureItem
                icon={<Syringe size={28} />}
                label="Hydrate"
              />
            </div>

            {/* SOCIALS */}
            <div className="mt-14">
              <p className="text-gray-600 mb-5">
                Stay connected for updates!
              </p>

              <div className="flex items-center gap-4">
                <SocialIcon icon={<FaInstagram size={20} />} />
                <SocialIcon icon={<FaFacebookF size={20} />} />
                <SocialIcon icon={<Mail size={20} />} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE IMAGE */}
        <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
          {/* background accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0b1c33] via-[#11284a] to-[#08111f]" />

          {/* glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full bg-[#d4b06a]/20 blur-3xl" />

<div className="relative z-10 w-full h-full">          <Image
  src="/hero-image.png"
  alt="Luxury Wellness"
  fill
  className="object-fill drop-shadow-2xl"
  priority
/>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-[#d8c7a0]/30 bg-[#0d1f38] text-white py-5">
        <div className="flex items-center justify-center gap-5 text-sm tracking-[0.35em] uppercase">
          <span>Mind</span>
          <span className="text-[#c9a45c]">•</span>
          <span>Body</span>
          <span className="text-[#c9a45c]">•</span>
          <span>Spirit</span>
        </div>
      </footer>
    </main>
  );
}

/* FEATURE ITEM */
function FeatureItem({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-16 h-16 rounded-full border border-[#c9a45c] flex items-center justify-center text-[#0e2341]">
        {icon}
      </div>

      <p className="uppercase tracking-[0.2em] text-sm text-[#0e2341] font-medium">
        {label}
      </p>
    </div>
  );
}

/* SOCIAL ICON */
function SocialIcon({
  icon,
}: {
  icon: React.ReactNode;
}) {
  return (
    <button className="w-11 h-11 rounded-full border border-[#d4b06a] flex items-center justify-center text-[#0e2341] hover:bg-[#0e2341] hover:text-white transition-all duration-300">
      {icon}
    </button>
  );
}