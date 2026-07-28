"use client";

import { useState } from "react";
import { ChevronUp, Palette, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DEFAULT_HOME_ACCENT,
  DEFAULT_HOME_BG,
  DEFAULT_HOME_PURPLE,
  type HomeThemeColors,
} from "@/lib/home-theme";

const BG_PRESETS = [
  { label: "White", value: "#ffffff" },
  { label: "Black", value: "#0a0a0a" },
];

type Props = {
  colors: HomeThemeColors;
  onChange: (colors: HomeThemeColors) => void;
  onReset: () => void;
};

function ColorRow({
  label,
  description,
  value,
  presets,
  onChange,
}: {
  label: string;
  description: string;
  value: string;
  presets?: { label: string; value: string }[];
  onChange: (hex: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2 min-w-0">
      <div>
        <p className="text-xs font-semibold text-[var(--home-text)]">{label}</p>
        <p className="text-[10px] text-[var(--home-text)]/55 leading-snug">{description}</p>
      </div>
      {presets && presets.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button
              key={preset.value}
              type="button"
              onClick={() => onChange(preset.value)}
              className={`rounded-full px-2.5 py-1 text-[10px] font-medium border transition-colors ${
                value.toLowerCase() === preset.value.toLowerCase()
                  ? "border-[var(--home-accent)] bg-[var(--home-accent)]/15 text-[var(--home-text)]"
                  : "border-[var(--home-purple)]/20 text-[var(--home-text)]/70 hover:border-[var(--home-accent)]/40"
              }`}
            >
              {preset.label}
            </button>
          ))}
        </div>
      )}
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} color picker`}
        className="h-9 w-full cursor-pointer rounded-lg border border-[var(--home-purple)]/15 bg-[var(--home-bg)] p-0.5"
      />
    </div>
  );
}

export default function HomeColorCustomizer({ colors, onChange, onReset }: Props) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div
      className="fixed bottom-4 left-1/2 z-[200] w-[min(100vw-1.5rem,42rem)] -translate-x-1/2"
      role="region"
      aria-label="Homepage color customizer"
    >
      <div
        className="overflow-hidden rounded-2xl border border-[var(--home-purple)]/20 bg-[color-mix(in_srgb,var(--home-bg)_92%,transparent)] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.35)] backdrop-blur-md"
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
        >
          <span className="flex items-center gap-2 text-sm font-medium text-[var(--home-text)]">
            <Palette className="size-4 text-[var(--home-accent)]" />
            Customize page colors
          </span>
          <ChevronUp
            className={`size-4 text-[var(--home-text)]/60 transition-transform ${expanded ? "" : "rotate-180"}`}
          />
        </button>

        {expanded && (
          <div className="border-t border-[var(--home-purple)]/10 px-4 pb-4 pt-3">
            <div className="grid gap-4 sm:grid-cols-3">
              <ColorRow
                label="Background"
                description="Page, nav & footer base"
                value={colors.background}
                presets={BG_PRESETS}
                onChange={(background) => onChange({ ...colors, background })}
              />
              <ColorRow
                label="Accent"
                description="Golden / orange highlights"
                value={colors.accent}
                onChange={(accent) => onChange({ ...colors, accent })}
              />
              <ColorRow
                label="Deep tone"
                description="Dark purple brand color"
                value={colors.purple}
                onChange={(purple) => onChange({ ...colors, purple })}
              />
            </div>
            <div className="mt-3 flex justify-end">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onReset}
                className="border-[var(--home-purple)]/20 text-[var(--home-text)] hover:bg-[var(--home-purple)]/5"
              >
                <RotateCcw className="mr-1.5 size-3.5" />
                Reset defaults
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export function defaultHomeThemeColors(): HomeThemeColors {
  return {
    background: DEFAULT_HOME_BG,
    accent: DEFAULT_HOME_ACCENT,
    purple: DEFAULT_HOME_PURPLE,
  };
}
