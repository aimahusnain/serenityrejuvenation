"use client";
import { useLayoutEffect, useRef, useState } from "react";
import type React from "react";
import { useInView } from "motion/react";
import { annotate } from "rough-notation";
import { type RoughAnnotation } from "rough-notation/lib/model";

type AnnotationAction =
  | "highlight"
  | "underline"
  | "box"
  | "circle"
  | "strike-through"
  | "crossed-off"
  | "bracket";

interface HighlighterProps {
  children: React.ReactNode;
  action?: AnnotationAction;
  lightColor?: string;
  darkColor?: string;
  strokeWidth?: number;
  animationDuration?: number;
  iterations?: number;
  padding?: number;
  multiline?: boolean;
  isView?: boolean;
}

function isDarkMode() {
  return document.documentElement.classList.contains("dark");
}

export function Highlighter({
  children,
  action = "highlight",
  lightColor = "#ffd1dc",
  darkColor = "#fbbf24",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = true,
  isView = false,
}: HighlighterProps) {
  const elementRef = useRef<HTMLSpanElement>(null);
  const [themeKey, setThemeKey] = useState(0);

  // ✅ Safe SSR default — never calls document at render time
  const [color, setColor] = useState(lightColor);

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  });
  const shouldShow = !isView || isInView;

  // 🔥 Listen to Tailwind dark mode changes and resolve color (client-only)
  useLayoutEffect(() => {
    // Set initial color on mount
    setColor(isDarkMode() ? darkColor : lightColor);

    const observer = new MutationObserver(() => {
      setColor(isDarkMode() ? darkColor : lightColor);
      setThemeKey((prev) => prev + 1);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => observer.disconnect();
  }, [darkColor, lightColor]);

  useLayoutEffect(() => {
    const element = elementRef.current;
    let annotation: RoughAnnotation | null = null;
    let resizeObserver: ResizeObserver | null = null;

    if (shouldShow && element) {
      const currentAnnotation = annotate(element, {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      });
      annotation = currentAnnotation;
      currentAnnotation.show();

      resizeObserver = new ResizeObserver(() => {
        currentAnnotation.hide();
        currentAnnotation.show();
      });
      resizeObserver.observe(element);
      resizeObserver.observe(document.body);
    }

    return () => {
      annotation?.remove();
      resizeObserver?.disconnect();
    };
  }, [
    shouldShow,
    action,
    color,
    strokeWidth,
    animationDuration,
    iterations,
    padding,
    multiline,
    themeKey,
  ]);

  return (
    <span ref={elementRef} className="relative inline-block bg-transparent">
      {children}
    </span>
  );
}
