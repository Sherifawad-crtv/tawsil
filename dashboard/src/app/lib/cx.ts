import { twMerge } from "tailwind-merge";

/** Merge Tailwind classes safely, last-write-wins on conflicting utilities. */
export const cx = twMerge;
