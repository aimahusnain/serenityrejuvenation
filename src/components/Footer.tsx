"use client";

import { useHomeThemeUi } from "@/components/home/HomeThemeUiContext";
import { getFooterThemeClasses, type FooterVariant } from "@/lib/footer-home-theme";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { RiInstagramFill } from "react-icons/ri";
import { SiTiktok } from "react-icons/si";
import { useProducts } from "./ProductsProvider";
import { FaFacebook } from "react-icons/fa";

export default function Footer({ variant = "default" }: { variant?: FooterVariant }) {
  const products = useProducts();
  const { data: session } = useSession();
  const t = getFooterThemeClasses(variant);
  const isHome = variant === "home";
  const { darkBg } = useHomeThemeUi();
  const showLightLogo = isHome && darkBg;

  return (
    <footer className={t.root}>
      <div className={t.accentLine} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          <div className="md:col-span-4 flex flex-col gap-6">
            <Image
              src="/logo_dark.png"
              alt="Serenity Rejuvenation"
              width={140}
              height={55}
              className={cn(
                "object-contain",
                isHome ? (showLightLogo ? "hidden" : "block") : "dark:hidden",
              )}
            />
            <Image
              src="/logo_light.png"
              alt="Serenity Rejuvenation"
              width={140}
              height={55}
              className={cn(
                "object-contain",
                isHome ? (showLightLogo ? "block" : "hidden") : "hidden dark:block",
              )}
            />

            <p className={t.bodyMuted}>
              Precision-crafted skin treatments for lasting radiance. We blend science and serenity so results stay with you.
            </p>

            <div className={t.contact}>
              <a href="tel:+18174877378" className={t.contactLink}>
              470-841-3262
              </a>
              <address className="not-italic leading-relaxed">
              Address 2289 Peachtree Rd Suite 2 <br />
              Atlanta Ga 30309
              </address>
            </div>

            <div className="flex items-center gap-2.5">
              {[
                { href: "https://www.instagram.com/serenityrejuvenation", Icon: RiInstagramFill, label: "Instagram" },
                { href: "https://www.facebook.com/profile.php?id=61592475877575", Icon: FaFacebook, label: "Facebook" },
                { href: "https://www.tiktok.com/@serenity.rejuvena", Icon: SiTiktok, label: "TikTok" },
              ].map(({ href, Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className={t.social}
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:block md:col-span-1" />

          <div className="md:col-span-3 flex flex-col gap-5">
            <p className={t.heading}>Services</p>
            <ul className="flex flex-col gap-3">
              {products.map((product) => {
                const bookUrl = session?.user
                  ? `/user-dashboard/book?service=${product.id}`
                  : `/login?redirect=/user-dashboard/book?service=${product.id}`;
                return (
                  <li key={product.id}>
                    <Link href={bookUrl} className={t.link}>
                      {product.title}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="md:col-span-4 flex flex-col gap-8">
            <div className="flex flex-col gap-5">
              <p className={t.heading}>Explore</p>
              <ul className="flex flex-col gap-3">
                {[{ title: "Gallery", href: "/gallery" }].map((l) => (
                  <li key={l.title}>
                    <Link href={l.href} className={t.link}>
                      {l.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className={t.ctaCard}>
              <div>
                <p className={t.ctaTitle}>Ready for your glow?</p>
                <p className={t.ctaDesc}>Let our experts guide your skincare journey.</p>
              </div>
              <Link href="/contact" className={t.ctaBtn}>
                Book Consultation
              </Link>
            </div>
          </div>
        </div>

        <div className={t.divider} />

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className={t.legal}>
            © {new Date().getFullYear()} Serenity Rejuvenation. All rights reserved.
          </p>

          <div className={cn("flex items-center gap-5", t.legal)}>
            <Link href="/privacy-policy" className={t.legalLink}>
              Privacy Policy
            </Link>
            <Link href="/terms-and-conditions" className={t.legalLink}>
              Terms
            </Link>
            <span className="flex items-center gap-1">
              Website by{" "}
              <a
                href="https://devkins.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={t.credit}
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
