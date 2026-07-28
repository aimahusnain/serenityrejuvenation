"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeColorCustomizer, {
  defaultHomeThemeColors,
} from "@/components/home/HomeColorCustomizer";
import {
  HOME_THEME_STORAGE_KEY,
  buildHomeThemeStyle,
  isColorDark,
  type HomeThemeColors,
} from "@/lib/home-theme";
import { HomeThemeUiProvider } from "@/components/home/HomeThemeUiContext";
import { HomeThemeColorsProvider } from "@/components/home/HomeThemeColorsContext";

type Props = {
  children: React.ReactNode;
};

export default function HomePageShell({ children }: Props) {
  const [colors, setColors] = useState<HomeThemeColors>(defaultHomeThemeColors);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(HOME_THEME_STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as Partial<HomeThemeColors>;
      setColors((prev) => ({
        background: parsed.background ?? prev.background,
        accent: parsed.accent ?? prev.accent,
        purple: parsed.purple ?? prev.purple,
      }));
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(HOME_THEME_STORAGE_KEY, JSON.stringify(colors));
  }, [colors]);

  const themeStyle = useMemo(
    () => buildHomeThemeStyle(colors.background, colors.accent, colors.purple),
    [colors],
  );

  const reset = useCallback(() => {
    setColors(defaultHomeThemeColors());
  }, []);

  const darkBg = isColorDark(colors.background);

  return (
    <HomeThemeUiProvider darkBg={darkBg}>
      <HomeThemeColorsProvider colors={colors}>
        <div
          className="home-theme-scope min-h-screen bg-[var(--home-bg)] text-[var(--home-text)] antialiased pb-28"
          style={themeStyle}
        >
          <Header variant="home" />
          {children}
          <Footer variant="home" />
          <HomeColorCustomizer colors={colors} onChange={setColors} onReset={reset} />
        </div>
      </HomeThemeColorsProvider>
    </HomeThemeUiProvider>
  );
}
