"use client";

import { createContext, useContext } from "react";

type HomeThemeUiContextValue = {
  darkBg: boolean;
};

const HomeThemeUiContext = createContext<HomeThemeUiContextValue>({
  darkBg: false,
});

export function HomeThemeUiProvider({
  darkBg,
  children,
}: {
  darkBg: boolean;
  children: React.ReactNode;
}) {
  return (
    <HomeThemeUiContext.Provider value={{ darkBg }}>
      {children}
    </HomeThemeUiContext.Provider>
  );
}

export function useHomeThemeUi() {
  return useContext(HomeThemeUiContext);
}
