export type HeaderVariant = "default" | "home";

export function getHeaderThemeClasses(variant: HeaderVariant) {
  if (variant === "home") {
    return {
      nav:
        "mx-8 sticky top-2 z-50 rounded-lg backdrop-blur supports-backdrop-filter:backdrop-blur border border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)] bg-[color-mix(in_srgb,var(--home-bg)_95%,transparent)]",
      menuTrigger:
        "text-[var(--home-text)] hover:bg-[color-mix(in_srgb,var(--home-purple)_8%,transparent)]",
      menuContent:
        "bg-[var(--home-bg)] border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)]",
      menuGrid: "bg-[var(--home-bg)]",
      serviceCard:
        "group rounded-lg border border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)] p-4 hover:border-[color-mix(in_srgb,var(--home-purple)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--home-purple)_5%,transparent)] transition-all",
      serviceTitle: "font-semibold text-[var(--home-text)] text-sm leading-tight",
      serviceDesc: "text-xs text-[var(--home-text)]/55 mt-1 line-clamp-2",
      price: "text-xs font-semibold text-[var(--home-accent)]",
      ghostBtn:
        "text-[var(--home-text)] hover:bg-[color-mix(in_srgb,var(--home-purple)_8%,transparent)]",
      primaryBtn:
        "bg-[var(--home-btn-bg)] hover:opacity-90 text-[var(--home-btn-text)]",
      sheet: "w-72 bg-[var(--home-bg)] p-0 flex flex-col",
      sheetHeader:
        "flex items-center justify-between px-5 py-4 border-b border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)]",
      accordionTrigger:
        "px-5 py-3 text-sm font-medium text-[var(--home-text)] hover:bg-[color-mix(in_srgb,var(--home-purple)_5%,transparent)] hover:no-underline rounded-none",
      mobileServiceCard:
        "rounded-xl border border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)] bg-[color-mix(in_srgb,var(--home-surface)_50%,transparent)] px-3 py-2.5 hover:border-[color-mix(in_srgb,var(--home-accent)_40%,transparent)] hover:bg-[color-mix(in_srgb,var(--home-purple)_5%,transparent)] transition-all cursor-pointer",
      mobileDivider: "h-px bg-[color-mix(in_srgb,var(--home-purple)_10%,transparent)] mx-5 my-1",
      mobileLink:
        "flex items-center px-5 py-3 text-sm font-medium text-[var(--home-text)] hover:bg-[color-mix(in_srgb,var(--home-purple)_5%,transparent)] transition-colors",
      sheetFooter:
        "border-t border-[color-mix(in_srgb,var(--home-purple)_15%,transparent)] p-4",
      outlineBtn:
        "w-full border-[color-mix(in_srgb,var(--home-purple)_20%,transparent)] text-[var(--home-text)] hover:bg-[color-mix(in_srgb,var(--home-purple)_5%,transparent)]",
    };
  }

  return {
    nav: "mx-8 sticky top-2 z-50 rounded-lg bg-white/95 backdrop-blur supports-backdrop-filter:bg-white/80 dark:bg-[#271024]/95 dark:supports-backdrop-filter:bg-[#271024]/80 border border-[#271024]/10 dark:border-[#e3ae72]/15",
    menuTrigger:
      "text-[#271024] hover:bg-[#271024]/8 dark:text-[#e3ae72] dark:hover:bg-[#e3ae72]/10",
    menuContent: "bg-white dark:bg-[#271024] dark:border-[#e3ae72]/15",
    menuGrid: "bg-white dark:bg-[#271024] dark:border-[#e3ae72]/15",
    serviceCard:
      "group rounded-lg border border-[#271024]/15 dark:border-[#e3ae72]/20 p-4 hover:border-[#271024]/40 dark:hover:border-[#e3ae72]/50 hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/8 transition-all",
    serviceTitle:
      "font-semibold text-[#271024] dark:text-[#e3ae72] text-sm leading-tight",
    serviceDesc: "text-xs text-[#271024]/55 dark:text-[#e3ae72]/60 mt-1 line-clamp-2",
    price: "text-xs font-semibold text-[#e3ae72]",
    ghostBtn:
      "text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/8 dark:hover:bg-[#e3ae72]/10",
    primaryBtn:
      "bg-[#271024] hover:bg-[#271024]/80 text-white dark:bg-[#e3ae72] dark:text-[#271024] dark:hover:bg-[#d49e5e]",
    sheet: "w-72 bg-white dark:bg-[#271024] p-0 flex flex-col",
    sheetHeader:
      "flex items-center justify-between px-5 py-4 border-b border-[#271024]/15 dark:border-[#e3ae72]/20",
    accordionTrigger:
      "px-5 py-3 text-sm font-medium text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/10 hover:no-underline rounded-none",
    mobileServiceCard:
      "rounded-xl border border-[#271024]/15 dark:border-[#e3ae72]/20 bg-white dark:bg-[#271024]/50 px-3 py-2.5 hover:border-[#271024]/30 dark:hover:border-[#e3ae72]/40 hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/8 transition-all cursor-pointer",
    mobileDivider: "h-px bg-[#271024]/10 dark:bg-[#e3ae72]/15 mx-5 my-1",
    mobileLink:
      "flex items-center px-5 py-3 text-sm font-medium text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/10 transition-colors",
    sheetFooter: "border-t border-[#271024]/15 dark:border-[#e3ae72]/20 p-4",
    outlineBtn:
      "w-full border-[#271024]/20 dark:border-[#e3ae72]/30 text-[#271024] dark:text-[#e3ae72] hover:bg-[#271024]/5 dark:hover:bg-[#e3ae72]/10",
  };
}
