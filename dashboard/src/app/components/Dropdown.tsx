import { createContext, useContext, useRef, useState } from "react";
import type { ComponentProps, ReactNode, RefObject } from "react";
import {
  Button as AriaButton,
  Dialog as AriaDialog,
  DialogTrigger as AriaDialogTrigger,
  Popover as AriaPopover,
} from "react-aria-components";
import { cx } from "../lib/cx";
import { useDismissOnOutsidePress, useTriggerToggle } from "../lib/useDismissOnOutsidePress";
import {
  MENU_ITEM,
  MENU_ITEM_ACTIVE,
  MENU_ITEM_INTERACTIVE,
  MENU_POPOVER_SURFACE,
  MENU_POPOVER_WIDTH,
} from "./menuStyles";

/**
 * BoardUI's base/dropdown — their popover-menu recipe as composable
 * primitives on react-aria's DialogTrigger/Popover. Unlike Select (which
 * picks a value into a trigger), Dropdown is a free-form menu surface.
 */

interface DropdownContextValue {
  triggerRef: RefObject<HTMLButtonElement>;
  popoverRef: RefObject<HTMLElement>;
}

const DropdownContext = createContext<DropdownContextValue | null>(null);

/**
 * The popover is `isNonModal`: react-aria's modal scroll lock puts
 * `overflow: hidden` on <html>, which yanks our sticky sidebar whenever a menu
 * opens. Non-modal skips the lock, but react-aria hard-couples outside-press
 * dismissal to modality — so open state lives here and dismissal is restored
 * via useDismissOnOutsidePress, the same fix as Select and the date pickers.
 */
export function Dropdown({
  isOpen: controlledOpen,
  onOpenChange,
  children,
}: {
  isOpen?: boolean;
  onOpenChange?: (isOpen: boolean) => void;
  children: ReactNode;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);

  const isOpen = controlledOpen ?? uncontrolledOpen;
  const setOpen = (next: boolean) => {
    setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  useDismissOnOutsidePress(isOpen, () => setOpen(false), [triggerRef, popoverRef]);
  const allowOpenChange = useTriggerToggle(isOpen, triggerRef);

  return (
    <DropdownContext.Provider value={{ triggerRef, popoverRef }}>
      <AriaDialogTrigger isOpen={isOpen} onOpenChange={(o) => allowOpenChange(o) && setOpen(o)}>
        {children}
      </AriaDialogTrigger>
    </DropdownContext.Provider>
  );
}

/** The element that opens the menu. Style it entirely via className. */
export function DropdownTrigger({ className, ...props }: ComponentProps<typeof AriaButton>) {
  const context = useContext(DropdownContext);
  return (
    <AriaButton
      ref={context?.triggerRef}
      {...props}
      className={cx("cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-blue", className as string)}
    />
  );
}

export function DropdownPopover({
  "aria-label": ariaLabel,
  placement = "bottom end",
  offset = 4,
  className,
  dialogClassName,
  children,
}: Pick<ComponentProps<typeof AriaPopover>, "placement" | "offset"> & {
  "aria-label": string;
  className?: string;
  dialogClassName?: string;
  children: ReactNode;
}) {
  const context = useContext(DropdownContext);
  return (
    <AriaPopover
      ref={context?.popoverRef}
      isNonModal
      placement={placement}
      offset={offset}
      className={cx(MENU_POPOVER_WIDTH, MENU_POPOVER_SURFACE, className)}
    >
      <AriaDialog aria-label={ariaLabel} className={cx("flex flex-col gap-1 outline-none", dialogClassName)}>
        {children}
      </AriaDialog>
    </AriaPopover>
  );
}

export function DropdownGroup({ label, className, children }: { label?: string; className?: string; children: ReactNode }) {
  return (
    <div className={cx("flex w-full flex-col gap-1.5", label && "pt-1", className)}>
      {label && <span className="pl-2 text-body-medium text-muted">{label}</span>}
      <div className="flex w-full flex-col gap-1">{children}</div>
    </div>
  );
}

/** A menu row. Content is free-form, laid out in a gap-2 flex row. */
export function DropdownItem({
  selected,
  onSelect,
  className,
  children,
}: {
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className={cx(MENU_ITEM, selected ? MENU_ITEM_ACTIVE : MENU_ITEM_INTERACTIVE, className)}
      style={{ fontFamily: "var(--font-sub)" }}
    >
      {children}
    </button>
  );
}

/** Full-bleed 1px divider between groups (bleeds through the panel's padding). */
export function DropdownDivider({ className }: { className?: string }) {
  return <div className={cx("-mx-2 my-1.5 h-px shrink-0 bg-border", className)} />;
}
