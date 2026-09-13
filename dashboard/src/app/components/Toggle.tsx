import { cx } from "../lib/cx";

/** BoardUI's Switch recipe (md/pill), our colors: h-6 w-[42px] track, gradient-fill on state. */
export default function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cx(
        "relative flex-shrink-0 cursor-pointer h-6 w-[42px] rounded-full transition-colors duration-200 ease",
        checked ? "bg-linear-to-b from-blue to-royal shadow-[inset_0_1.5px_0_0_rgb(255_255_255/0.25)]" : "bg-grey",
      )}
    >
      <span
        className={cx(
          "absolute left-[3px] top-[3px] size-[18px] rounded-full bg-white shadow-[0_3px_3px_0_rgb(0_0_0/0.08),0_0.75px_0_0_rgb(0_0_0/0.05)] transition-transform duration-200 ease",
          checked && "translate-x-[18px]",
        )}
      />
    </button>
  );
}
