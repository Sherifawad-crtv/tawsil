import type { ReactNode } from "react";

/** Side-scrolling row of cards that snap into place, with the next card peeking in. */
export default function Carousel({ children }: { children: ReactNode[] }) {
  return (
    <div
      className="no-scrollbar -mx-4 px-4 flex gap-3 overflow-x-auto pb-1"
      style={{ scrollSnapType: "x mandatory", scrollPaddingLeft: "16px", scrollPaddingRight: "16px", WebkitOverflowScrolling: "touch" }}
    >
      {children.map((child, i) => (
        <div key={i} className="flex flex-shrink-0" style={{ width: children.length === 1 ? "100%" : "86%", scrollSnapAlign: "start" }}>
          {child}
        </div>
      ))}
    </div>
  );
}
