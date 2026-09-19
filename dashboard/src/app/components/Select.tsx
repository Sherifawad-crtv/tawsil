import { useRef, useState } from "react";
import type { ReactNode } from "react";
import { AltArrowDownIcon } from "@solar-icons/react/line-duotone";
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
import { FIELD_BASE } from "../lib/fieldClass";
import { MENU_ITEM, MENU_ITEM_ACTIVE, MENU_ITEMS_CONTAINER, MENU_POPOVER_SURFACE } from "./menuStyles";

/**
 * BoardUI's base/select on react-aria, our tokens. Replaces the native
 * <select> elements we were using, which rendered the OS control and ignored
 * the design system entirely.
 *
 * Two triggers, because BoardUI styles these contexts differently and mixing
 * them inside one form looks like a bug:
 *   trigger (default) — white, 1px border, shadow-xs. For filters and
 *     toolbars, where it sits beside buttons.
 *   field — the shared input recipe, so a Select in a form matches the
 *     TextField next to it.
 * Popover is the same either way: radius/2xl panel, shadow-dropdown, 150ms
 * fade/scale/blur, radius/2lg rows.
 */

function ChevronDownSmall({ className }: { className?: string }) {
  return <AltArrowDownIcon size={16} className={className} aria-hidden />;
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
  variant = "trigger",
  "aria-label": ariaLabel,
}: {
  value: string;
  onChange: (value: string) => void;
  options: readonly SelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  isDisabled?: boolean;
  variant?: "trigger" | "field";
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
              "flex w-full cursor-pointer items-center justify-between gap-1.5 outline-none",
              variant === "field"
                ? cx(FIELD_BASE, "px-3 text-body-regular data-[focused]:ring-blue data-[focused]:bg-white")
                : cx(
                    "h-9 rounded-2lg px-2.5 text-body-medium",
                    "border border-border bg-white shadow-xs text-navy",
                    "transition-[background-color,border-color,box-shadow] duration-200 ease",
                    "hover:bg-grey-light hover:border-grey",
                    "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue",
                  ),
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
            <AriaListBox className={cx(MENU_ITEMS_CONTAINER, "max-h-[240px] overflow-auto")}>
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

interface SelectItemProps extends Omit<AriaListBoxItemProps, "children"> {
  children?: ReactNode;
}

function SelectItem({ className, children, ...props }: SelectItemProps) {
  return (
    <AriaListBoxItem
      {...props}
      className={(state) =>
        cx(
          MENU_ITEM,
          (state.isFocused || state.isSelected) && MENU_ITEM_ACTIVE,
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
