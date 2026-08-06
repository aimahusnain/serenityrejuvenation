export const DEFAULT_HOME_BG = "#2d063f";
export const DEFAULT_HOME_ACCENT = "#efcafe";
export const DEFAULT_HOME_PURPLE = "#7a219f";

export const HOME_THEME_STORAGE_KEY = "serenity-home-theme-v1";

export type HomeThemeColors = {
  background: string;
  accent: string;
  purple: string;
};

export function defaultHomeThemeColors(): HomeThemeColors {
  return {
    background: DEFAULT_HOME_BG,
    accent: DEFAULT_HOME_ACCENT,
    purple: DEFAULT_HOME_PURPLE,
  };
}

export function isColorDark(hex: string): boolean {
  const normalized = hex.replace("#", "");
  const num = parseInt(normalized, 16);
  if (Number.isNaN(num)) return false;
  const r = num >> 16;
  const g = (num >> 8) & 0xff;
  const b = num & 0xff;
  return 0.299 * r + 0.587 * g + 0.114 * b < 140;
}

export function contrastText(hex: string): string {
  return isColorDark(hex) ? "#ffffff" : "#1a1a1a";
}

export function buildHomeThemeStyle(
  background: string,
  accent: string,
  purple: string,
): Record<string, string> {
  const darkBg = isColorDark(background);
  const text = darkBg ? accent : purple;
  const btnBg = darkBg ? accent : purple;
  const btnText = contrastText(btnBg);
  const btnAltBg = darkBg ? purple : accent;
  const btnAltText = contrastText(btnAltBg);

  return {
    "--home-bg": background,
    "--home-accent": accent,
    "--home-purple": purple,
    "--home-text": text,
    "--home-on-purple": contrastText(purple),
    "--home-on-accent": contrastText(accent),
    "--home-btn-bg": btnBg,
    "--home-btn-text": btnText,
    "--home-btn-alt-bg": btnAltBg,
    "--home-btn-alt-text": btnAltText,
    "--home-surface": darkBg ? purple : "#ffffff",
    "--background": background,
    "--foreground": text,
    "--primary": btnBg,
    "--primary-foreground": btnText,
    "--card": darkBg ? purple : "#ffffff",
    "--card-foreground": text,
    "--border": `${purple}26`,
    "--ring": accent,
  };
}
