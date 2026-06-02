"use client";

import Link from "next/link";
import Image from "next/image";
import { RiInstagramFill } from "react-icons/ri";
import { FaFacebook } from "react-icons/fa";

const services = [
  { title: "Microneedling", href: "/services/microneedling" },
  { title: "Microneedling with PRP", href: "/services/microneedling-prp" },
  { title: "Microneedling with PRF", href: "/services/microneedling-prf" },
  { title: "Microneedling with Sculptra®", href: "/services/microneedling-sculptra" },
  { title: "PRP Therapy", href: "/services/prp" },
  { title: "PRF Therapy", href: "/services/prf" },
  { title: "Facial Session", href: "/services/facial" },
];

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-[#271024]">

      {/* Top accent line */}
      <div className="h-px bg-linear-to-r from-transparent via-[#271024]/20 dark:via-[#e3ae72]/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">

        {/* ── Main grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">

          {/* Brand col — spans 4 */}
          <div className="md:col-span-4 flex flex-col gap-6">
            <Image
              src="/logo_dark.png"
              alt="Serenity Rejuvenation"
              width={140}
              height={55}
              className="object-contain dark:hidden"
            />
            <Image
              src="/logo_light.png"
              alt="Serenity Rejuvenation"
              width={140}
              height={55}
              className="object-contain hidden dark:block"
            />

            <p className="text-sm leading-[1.75] text-[#271024]/55 dark:text-[#e3ae72]/60 max-w-65">
              Precision-crafted skin treatments for lasting radiance. We blend science and serenity so results stay with you.
            </p>

            {/* Contact block */}
            <div className="flex flex-col gap-2 text-sm text-[#271024]/65 dark:text-[#e3ae72]/65">
              <a
                href="tel:+18174877378"
                className="hover:text-[#271024] dark:hover:text-[#e3ae72] transition-colors"
              >
                +1 (817) 487-7378
              </a>
              <address className="not-italic leading-relaxed">
                1870 The Exchange SE, Ste 220<br />
                PMB 213900<br />
                Atlanta, Georgia 30339
              </address>
            </div>

            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {[
                { href: "https://instagram.com", Icon: RiInstagramFill, label: "Instagram" },
                { href: "https://facebook.com", Icon: FaFacebook, label: "Facebook" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="
                    w-9 h-9 rounded-xl flex items-center justify-center
                    border border-[#271024]/12 dark:border-[#e3ae72]/20
                    text-[#271024]/50 dark:text-[#e3ae72]/55
                    hover:bg-[#271024] hover:text-white hover:border-[#271024]
                    dark:hover:bg-[#e3ae72] dark:hover:text-[#271024] dark:hover:border-[#e3ae72]
                    transition-all duration-200
                  "
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Spacer col */}
          <div className="hidden md:block md:col-span-1" />

          {/* Services col — spans 3 */}
          <div className="md:col-span-3 flex flex-col gap-5">
            <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#271024] dark:text-[#e3ae72]">
              Services
            </p>
            <ul className="flex flex-col gap-3">
              {services.map((s) => (
                <li key={s.title}>
                  <Link
                    href={s.href}
                    className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/60 hover:text-[#271024] dark:hover:text-[#e3ae72] transition-colors duration-150"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Nav + CTA col — spans 4 */}
          <div className="md:col-span-4 flex flex-col gap-8">

            {/* Quick nav */}
            <div className="flex flex-col gap-5">
              <p className="text-[11px] uppercase tracking-[0.18em] font-semibold text-[#271024] dark:text-[#e3ae72]">
                Explore
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  { title: "Gallery", href: "/gallery" },
                ].map((l) => (
                  <li key={l.title}>
                    <Link
                      href={l.href}
                      className="text-sm text-[#271024]/60 dark:text-[#e3ae72]/60 hover:text-[#271024] dark:hover:text-[#e3ae72] transition-colors duration-150"
                    >
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA card */}
            <div className="rounded-2xl border border-[#271024]/10 dark:border-[#e3ae72]/15 p-6 flex flex-col gap-4 bg-[#271024]/3 dark:bg-[#e3ae72]/5">
              <div>
                <p className="text-base font-semibold text-[#271024] dark:text-[#e3ae72] leading-snug">
                  Ready for your glow?
                </p>
                <p className="text-sm text-[#271024]/55 dark:text-[#e3ae72]/60 mt-1">
                  Let our experts guide your skincare journey.
                </p>
              </div>
              <Link
                href="/booking"
                className="
                  inline-flex items-center justify-center self-start
                  px-6 py-2.5 rounded-full text-sm font-medium
                  bg-[#271024] text-white hover:bg-[#271024]/85
                  dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]
                  transition-all duration-200
                "
              >
                Book Consultation
              </Link>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="mt-14 h-px bg-[#271024]/8 dark:bg-[#e3ae72]/12" />

        {/* ── Bottom bar ── */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-[#271024]/40 dark:text-[#e3ae72]/40">
            © {new Date().getFullYear()} Serenity Rejuvenation. All rights reserved.
          </p>

          <div className="flex items-center gap-5 text-xs text-[#271024]/40 dark:text-[#e3ae72]/40">
            <Link href="/privacy-policy" className="hover:text-[#271024] dark:hover:text-[#e3ae72] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className="hover:text-[#271024] dark:hover:text-[#e3ae72] transition-colors">
              Terms
            </Link>
            <span className="flex items-center gap-1">
              Website by{" "}
              <a
                href="https://devkins.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#e3ae72] hover:text-[#271024] dark:hover:text-white transition-colors font-medium"
              >
                devkins.dev
              </a>
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}