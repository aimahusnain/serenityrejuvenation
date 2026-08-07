"use client";

import { Highlighter } from "@/components/ui/highlighter";
import { useHomeThemeColors } from "@/components/home/HomeThemeColorsContext";
import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<typeof Highlighter>, "lightColor" | "darkColor"> & {
  className?: string;
};

export function ThemedHighlighter(props: Props) {
  const { purple, accent } = useHomeThemeColors();
  const { className, ...rest } = props;

  return <Highlighter {...rest} className={className} lightColor={purple} darkColor={accent} />;
}
