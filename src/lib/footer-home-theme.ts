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
    root: "w-full bg-white dark:bg-[#7a219f]",
    accentLine:
      "h-px bg-linear-to-r from-transparent via-[#7a219f]/20 dark:via-[#efcafe]/30 to-transparent",
    heading:
      "text-[11px] uppercase tracking-[0.18em] font-semibold text-[#7a219f] dark:text-[#efcafe]",
    bodyMuted:
      "text-sm leading-[1.75] text-[#7a219f]/55 dark:text-[#efcafe]/60 max-w-65",
    contact: "flex flex-col gap-2 text-sm text-[#7a219f]/65 dark:text-[#efcafe]/65",
    contactLink: "hover:text-[#7a219f] dark:hover:text-[#efcafe] transition-colors",
    social: `
                    w-9 h-9 rounded-xl flex items-center justify-center
                    border border-[#7a219f]/12 dark:border-[#efcafe]/20
                    text-[#7a219f]/50 dark:text-[#efcafe]/55
                    hover:bg-[#7a219f] hover:text-white hover:border-[#7a219f]
                    dark:hover:bg-[#efcafe] dark:hover:text-[#7a219f] dark:hover:border-[#efcafe]
                    transition-all duration-200
                  `,
    link: "text-sm text-[#7a219f]/60 dark:text-[#efcafe]/60 hover:text-[#7a219f] dark:hover:text-[#efcafe] transition-colors duration-150",
    ctaCard:
      "rounded-2xl border border-[#7a219f]/10 dark:border-[#efcafe]/15 p-6 flex flex-col gap-4 bg-[#7a219f]/3 dark:bg-[#efcafe]/5",
    ctaTitle:
      "text-base font-semibold text-[#7a219f] dark:text-[#efcafe] leading-snug",
    ctaDesc: "text-sm text-[#7a219f]/55 dark:text-[#efcafe]/60 mt-1",
    ctaBtn: `
                  inline-flex items-center justify-center self-start
                  px-6 py-2.5 rounded-full text-sm font-medium
                  bg-[#7a219f] text-white hover:bg-[#7a219f]/85
                  dark:bg-[#efcafe] dark:text-[#7a219f] dark:hover:bg-[#7a219f]
                  transition-all duration-200
                `,
    divider: "mt-14 h-px bg-[#7a219f]/8 dark:bg-[#efcafe]/12",
    legal: "text-xs text-[#7a219f]/40 dark:text-[#efcafe]/40",
    legalLink: "hover:text-[#7a219f] dark:hover:text-[#efcafe] transition-colors",
    credit:
      "text-[#efcafe] hover:text-[#7a219f] dark:hover:text-white transition-colors font-medium",
  };
}
