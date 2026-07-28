export type FooterVariant = "default" | "home";

export function getFooterThemeClasses(variant: FooterVariant) {
  if (variant === "home") {
    return {
      root: "w-full bg-[var(--home-bg)]",
      accentLine:
        "h-px bg-linear-to-r from-transparent via-[color-mix(in_srgb,var(--home-accent)_30%,transparent)] to-transparent",
      heading: "text-[11px] uppercase tracking-[0.18em] font-semibold text-[var(--home-text)]",
      bodyMuted: "text-sm leading-[1.75] text-[var(--home-text)]/55 max-w-65",
      contact: "flex flex-col gap-2 text-sm text-[var(--home-text)]/65",
      contactLink: "hover:text-[var(--home-text)] transition-colors",
      social:
        "w-9 h-9 rounded-xl flex items-center justify-center border border-[color-mix(in_srgb,var(--home-purple)_12%,transparent)] text-[var(--home-text)]/50 hover:bg-[var(--home-purple)] hover:text-[var(--home-on-purple)] hover:border-[var(--home-purple)] transition-all duration-200",
      link: "text-sm text-[var(--home-text)]/60 hover:text-[var(--home-text)] transition-colors duration-150",
      ctaCard:
        "rounded-2xl border border-[color-mix(in_srgb,var(--home-purple)_10%,transparent)] p-6 flex flex-col gap-4 bg-[color-mix(in_srgb,var(--home-purple)_3%,transparent)]",
      ctaTitle: "text-base font-semibold text-[var(--home-text)] leading-snug",
      ctaDesc: "text-sm text-[var(--home-text)]/55 mt-1",
      ctaBtn:
        "inline-flex items-center justify-center self-start px-6 py-2.5 rounded-full text-sm font-medium bg-[var(--home-btn-bg)] text-[var(--home-btn-text)] hover:opacity-90 transition-all duration-200",
      divider: "mt-14 h-px bg-[color-mix(in_srgb,var(--home-purple)_8%,transparent)]",
      legal: "text-xs text-[var(--home-text)]/40",
      legalLink: "hover:text-[var(--home-text)] transition-colors",
      credit: "text-[var(--home-accent)] hover:text-[var(--home-text)] transition-colors font-medium",
    };
  }

  return {
    root: "w-full bg-white dark:bg-[#271024]",
    accentLine:
      "h-px bg-linear-to-r from-transparent via-[#271024]/20 dark:via-[#e3ae72]/30 to-transparent",
    heading:
      "text-[11px] uppercase tracking-[0.18em] font-semibold text-[#271024] dark:text-[#e3ae72]",
    bodyMuted:
      "text-sm leading-[1.75] text-[#271024]/55 dark:text-[#e3ae72]/60 max-w-65",
    contact: "flex flex-col gap-2 text-sm text-[#271024]/65 dark:text-[#e3ae72]/65",
    contactLink: "hover:text-[#271024] dark:hover:text-[#e3ae72] transition-colors",
    social: `
                    w-9 h-9 rounded-xl flex items-center justify-center
                    border border-[#271024]/12 dark:border-[#e3ae72]/20
                    text-[#271024]/50 dark:text-[#e3ae72]/55
                    hover:bg-[#271024] hover:text-white hover:border-[#271024]
                    dark:hover:bg-[#e3ae72] dark:hover:text-[#271024] dark:hover:border-[#e3ae72]
                    transition-all duration-200
                  `,
    link: "text-sm text-[#271024]/60 dark:text-[#e3ae72]/60 hover:text-[#271024] dark:hover:text-[#e3ae72] transition-colors duration-150",
    ctaCard:
      "rounded-2xl border border-[#271024]/10 dark:border-[#e3ae72]/15 p-6 flex flex-col gap-4 bg-[#271024]/3 dark:bg-[#e3ae72]/5",
    ctaTitle:
      "text-base font-semibold text-[#271024] dark:text-[#e3ae72] leading-snug",
    ctaDesc: "text-sm text-[#271024]/55 dark:text-[#e3ae72]/60 mt-1",
    ctaBtn: `
                  inline-flex items-center justify-center self-start
                  px-6 py-2.5 rounded-full text-sm font-medium
                  bg-[#271024] text-white hover:bg-[#271024]/85
                  dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]
                  transition-all duration-200
                `,
    divider: "mt-14 h-px bg-[#271024]/8 dark:bg-[#e3ae72]/12",
    legal: "text-xs text-[#271024]/40 dark:text-[#e3ae72]/40",
    legalLink: "hover:text-[#271024] dark:hover:text-[#e3ae72] transition-colors",
    credit:
      "text-[#e3ae72] hover:text-[#271024] dark:hover:text-white transition-colors font-medium",
  };
}
