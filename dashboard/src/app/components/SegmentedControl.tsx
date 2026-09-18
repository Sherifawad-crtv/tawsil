import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  ToggleButton as AriaToggleButton,
  ToggleButtonGroup as AriaToggleButtonGroup,
} from "react-aria-components";
import { cx } from "../lib/cx";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * BoardUI's base/segmented-control on react-aria: a tertiary track with a
 * white thumb that slides behind the selected segment (we drew a per-button
 * background instead, so it never animated). Single selection that can't be
 * emptied; arrow keys move focus, Space/Enter selects.
 */
type Thumb = { left: number; top: number; width: number; height: number };

interface SegmentedControlOption<T extends string> {
  value: T;
  label: string;
}

export default function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
  "aria-label": ariaLabel,
}: {
  options: readonly SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  "aria-label"?: string;
}) {
  const innerRef = useRef<HTMLDivElement>(null);
  const [thumb, setThumb] = useState<Thumb | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    const measure = () => {
      const selected = el.querySelector<HTMLElement>("[data-selected]");
      if (selected) {
        setThumb({
          left: selected.offsetLeft,
          top: selected.offsetTop,
          width: selected.offsetWidth,
          height: selected.offsetHeight,
        });
      }
    };
    measure();
    const mo = new MutationObserver(measure);
    mo.observe(el, { attributes: true, subtree: true, attributeFilter: ["data-selected"] });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => {
      mo.disconnect();
      ro.disconnect();
    };
  }, []);

  return (
    <AriaToggleButtonGroup
      ref={innerRef}
      selectionMode="single"
      disallowEmptySelection
      selectedKeys={[value]}
      onSelectionChange={(keys) => {
        const next = [...keys][0];
        if (next != null) onChange(String(next) as T);
      }}
      aria-label={ariaLabel}
      className={cx("relative inline-flex items-start gap-0.5 rounded-2lg bg-grey-light p-1", className)}
    >
      {thumb && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 rounded-md bg-white shadow-xs transition-[transform,width,height] duration-200 ease"
          style={{
            transform: `translate(${thumb.left}px, ${thumb.top}px)`,
            width: thumb.width,
            height: thumb.height,
          }}
        />
      )}
      {options.map((option) => (
        <AriaToggleButton
          key={option.value}
          id={option.value}
          className={({ isSelected }) =>
            cx(
              "relative z-10 inline-flex cursor-pointer items-center justify-center rounded-md px-2.5 py-1 text-center whitespace-nowrap",
              "transition-colors duration-200 ease outline-none focus-visible:ring-2 focus-visible:ring-blue",
              isSelected ? "text-body-medium text-navy" : "text-body-regular text-muted hover:text-navy",
            )
          }
          style={{ fontFamily: "var(--font-sub)" }}
        >
          {option.label}
        </AriaToggleButton>
      ))}
    </AriaToggleButtonGroup>
  );
}
