import { useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  Button as AriaButton,
  ListBox as AriaListBox,
  ListBoxItem as AriaListBoxItem,
  Popover as AriaPopover,
  Select as AriaSelect,
  SelectValue as AriaSelectValue,
} from "react-aria-components";
import type { ListBoxItemProps as AriaListBoxItemProps, Key } from "react-aria-components";
import { cx } from "../lib/cx";
import { useDismissOnOutsidePress, useTriggerToggle } from "../lib/useDismissOnOutsidePress";

/**
 * BoardUI's base/select on react-aria, our tokens. Replaces the native
 * <select> elements we were using, which rendered the OS control and ignored
 * the design system entirely.
 *
 * Trigger: white, 1px border, shadow-xs, radius/2lg, Body 1/Medium, 16px
 * chevron that flips when open. Popover: radius/2xl panel, shadow-dropdown,
 * 150ms fade/scale/blur, radius/2lg rows.
 */

const MENU_POPOVER_SURFACE = [
  "max-w-[calc(100vw-32px)] overflow-y-auto",
  "rounded-2xl border border-border bg-white p-2 shadow-dropdown",
  "transition duration-150 ease-out",
  "data-[entering]:opacity-0 data-[entering]:scale-95 data-[entering]:blur-[2px]",
  "data-[exiting]:opacity-0 data-[exiting]:scale-95 data-[exiting]:blur-[2px]",
  "data-[placement=bottom]:origin-top-left data-[placement=top]:origin-bottom-left",
].join(" ");

const MENU_ITEM = [
  "flex w-full cursor-pointer items-center gap-2 rounded-2lg p-2 text-left",
  "text-navy outline-none transition-colors text-body-medium",
].join(" ");

function ChevronDownSmall({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className} aria-hidden>
      <path
        d="M4 6.5L7.29289 9.79289C7.68342 10.1834 8.31658 10.1834 8.70711 9.79289L12 6.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export interface SelectOption {
  value: string;
  label: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder,
  className,
  triggerClassName,
  isDisabled,
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  isDisabled?: boolean;
  "aria-label"?: string;
}) {
  // Non-modal popover: react-aria's modal scroll lock puts overflow:hidden on
  // <html>, which yanks our sticky sidebar. Dismissal is restored manually.
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  useDismissOnOutsidePress(isOpen, () => setIsOpen(false), [triggerRef, popoverRef]);
  const allowOpenChange = useTriggerToggle(isOpen, triggerRef);

  return (
    <AriaSelect
      aria-label={ariaLabel}
      isDisabled={isDisabled}
      selectedKey={value === "" ? null : value}
      onSelectionChange={(key: Key | null) => onChange(key == null ? "" : String(key))}
      isOpen={isOpen}
      onOpenChange={(o) => allowOpenChange(o) && setIsOpen(o)}
      placeholder={placeholder}
      className={cx("group flex flex-col", className)}
    >
      {({ isOpen: open }) => (
        <>
          <AriaButton
            ref={triggerRef}
            className={cx(
              "flex w-full cursor-pointer items-center justify-between rounded-2lg gap-1.5 px-2.5 py-2 text-body-medium",
              "border border-border bg-white shadow-xs text-navy",
              "transition-[background-color,border-color,box-shadow] duration-200 ease",
              "hover:bg-grey-light hover:border-grey",
              "outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue",
              "disabled:cursor-not-allowed disabled:text-muted disabled:shadow-none",
              triggerClassName,
            )}
            style={{ fontFamily: "var(--font-sub)" }}
          >
            <AriaSelectValue className="flex min-w-0 items-center gap-[5px] truncate data-[placeholder]:text-muted" />
            <ChevronDownSmall
              className={cx("size-4 shrink-0 text-muted transition-transform duration-200 ease", open && "rotate-180")}
            />
          </AriaButton>
          <AriaPopover ref={popoverRef} isNonModal offset={4} className={MENU_POPOVER_SURFACE}>
            <AriaListBox className="flex w-full flex-col gap-1 outline-none max-h-[240px] overflow-auto">
              {options.map((option) => (
                <SelectItem key={option.value} id={option.value} textValue={option.label}>
                  {option.label}
                </SelectItem>
              ))}
            </AriaListBox>
          </AriaPopover>
        </>
      )}
    </AriaSelect>
  );
}

export interface SelectItemProps extends Omit<AriaListBoxItemProps, "children"> {
  children?: ReactNode;
}

export function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <AriaListBoxItem
      {...props}
      className={(state) =>
        cx(
          MENU_ITEM,
          (state.isFocused || state.isSelected) && "bg-grey-light",
          state.isDisabled && "cursor-not-allowed text-muted",
          typeof className === "function" ? className(state) : className,
        )
      }
      style={{ fontFamily: "var(--font-sub)" }}
    >
      {children}
    </AriaListBoxItem>
  );
}
