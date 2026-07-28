"use client";

import { Highlighter } from "@/components/ui/highlighter";
import { useHomeThemeColors } from "@/components/home/HomeThemeColorsContext";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Highlighter>, "lightColor" | "darkColor">;

export function ThemedHighlighter(props: Props) {
  const { purple, accent } = useHomeThemeColors();

  return <Highlighter {...props} lightColor={purple} darkColor={accent} />;
}
