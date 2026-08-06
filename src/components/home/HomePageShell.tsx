"use client";

import { useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  DEFAULT_HOME_ACCENT,
  DEFAULT_HOME_BG,
  DEFAULT_HOME_PURPLE,
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
  const colors: HomeThemeColors = useMemo(
    () => ({
      background: DEFAULT_HOME_BG,
      accent: DEFAULT_HOME_ACCENT,
      purple: DEFAULT_HOME_PURPLE,
    }),
    [],
  );

  const themeStyle = useMemo(
    () => buildHomeThemeStyle(colors.background, colors.accent, colors.purple),
    [colors],
  );

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
        </div>
      </HomeThemeColorsProvider>
    </HomeThemeUiProvider>
  );
}
