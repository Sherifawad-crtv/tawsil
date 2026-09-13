import { extendTailwindMerge } from "tailwind-merge";

/**
 * Composite text-style classes from styles/index.css (text-title-1-medium,
 * text-body-semibold, ...). tailwind-merge has no view of our @theme, so
 * without this it treats them as text-color utilities and silently drops
 * them when they sit next to a real color class (text-navy, text-muted).
 */
const TEXT_FAMILIES = ["title-1", "title-2", "title-3", "headline", "body", "body-2", "caption-1", "caption-2"] as const;
const TEXT_WEIGHTS = ["regular", "medium", "semibold", "bold"] as const;
const TEXT_STYLE_SUFFIXES = TEXT_FAMILIES.flatMap((family) => TEXT_WEIGHTS.map((weight) => `${family}-${weight}`));

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [{ text: TEXT_STYLE_SUFFIXES }],
    },
  },
});

/** Merge Tailwind classes safely, last-write-wins on conflicting utilities. */
export const cx = twMerge;
