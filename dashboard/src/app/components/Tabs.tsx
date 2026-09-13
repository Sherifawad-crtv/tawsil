import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Tab as AriaTab, TabList as AriaTabList, Tabs as AriaTabs } from "react-aria-components";
import { cx } from "../lib/cx";

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * BoardUI's base/tabs Tab + TabList on react-aria, keeping our string-array
 * API. The underline is measured off the selected tab and slid into place
 * (their TabList does the same) rather than drawn per-button, so it animates
 * between tabs; react-aria brings roving tabindex and arrow-key navigation.
 */
type Underline = { left: number; width: number };

export default function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [underline, setUnderline] = useState<Underline | null>(null);

  useIsomorphicLayoutEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => {
      const selected = el.querySelector<HTMLElement>("[role='tab'][data-selected]");
      if (selected) setUnderline({ left: selected.offsetLeft, width: selected.offsetWidth });
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
    <AriaTabs
      selectedKey={active}
      onSelectionChange={(key) => onChange(String(key))}
      className="flex w-full flex-col"
    >
      <div ref={wrapperRef} className="relative w-full">
        <AriaTabList className="flex w-full items-center gap-1 border-b border-border overflow-x-auto">
          {tabs.map((tab) => (
            <AriaTab
              key={tab}
              id={tab}
              className={({ isSelected }) =>
                cx(
                  "relative inline-flex cursor-pointer items-center gap-2.5 px-2.5 py-2 whitespace-nowrap outline-none",
                  "transition-colors duration-150 ease",
                  "focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-blue",
                  isSelected ? "text-body-medium text-blue" : "text-body-regular text-navy hover:text-blue",
                )
              }
              style={{ fontFamily: "var(--font-sub)" }}
            >
              {tab}
            </AriaTab>
          ))}
        </AriaTabList>
        {underline && (
          <span
            aria-hidden
            className="pointer-events-none absolute bottom-0 left-0 h-0.5 bg-blue transition-[transform,width] duration-200 ease"
            style={{ transform: `translateX(${underline.left}px)`, width: underline.width }}
          />
        )}
      </div>
    </AriaTabs>
  );
}
