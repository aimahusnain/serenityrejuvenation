"use client";

import { createContext, useContext } from "react";
import type { HomeThemeColors } from "@/lib/home-theme";
import { defaultHomeThemeColors } from "@/components/home/HomeColorCustomizer";

const HomeThemeColorsContext = createContext<HomeThemeColors>(defaultHomeThemeColors());

export function HomeThemeColorsProvider({
  colors,
  children,
}: {
  colors: HomeThemeColors;
  children: React.ReactNode;
}) {
  return (
    <HomeThemeColorsContext.Provider value={colors}>
      {children}
    </HomeThemeColorsContext.Provider>
  );
}

export function useHomeThemeColors() {
  return useContext(HomeThemeColorsContext);
}
