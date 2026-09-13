/**
 * Shared visual recipe for BoardUI menu surfaces (their
 * components/base/dropdown/menu-styles.ts), on our tokens.
 *
 * Select and Dropdown keep their distinct react-aria semantics (single-value
 * listbox vs. action menu) while consuming the same panel, motion and row
 * treatments from here.
 */
export const MENU_POPOVER_SURFACE = [
  "max-w-[calc(100vw-32px)] overflow-y-auto",
  "rounded-2xl border border-border bg-white p-2 shadow-dropdown",
  "transition duration-150 ease-out",
  "data-[entering]:opacity-0 data-[entering]:scale-95 data-[entering]:blur-[2px]",
  "data-[exiting]:opacity-0 data-[exiting]:scale-95 data-[exiting]:blur-[2px]",
  "data-[placement=bottom]:origin-top-left data-[placement=top]:origin-bottom-left",
  "data-[placement=left]:origin-right data-[placement=right]:origin-left",
].join(" ");

export const MENU_POPOVER_WIDTH = "w-[266px]";

export const MENU_ITEMS_CONTAINER = "flex w-full flex-col gap-1 outline-none";

export const MENU_ITEM = [
  "flex w-full cursor-pointer items-center gap-2 rounded-2lg p-2 text-left",
  "text-navy outline-none transition-colors text-body-medium",
].join(" ");

export const MENU_ITEM_ACTIVE = "bg-grey-light";

export const MENU_ITEM_INTERACTIVE = "hover:bg-grey-light focus-visible:bg-grey-light";
