import { useEffect, useRef } from "react";
import type { RefObject } from "react";

/**
 * Ported from BoardUI (utils/use-dismiss-on-outside-press.ts).
 *
 * react-aria's Popover couples "non-modal" with "not dismissable on outside
 * interaction" — `isNonModal` (which we set to avoid the modal scroll lock
 * putting `overflow: hidden` on <html> and yanking the sticky sidebar) also
 * disables its built-in outside-click-to-close. This restores just that.
 */
export function useDismissOnOutsidePress(
  isOpen: boolean,
  onDismiss: () => void,
  refs: RefObject<HTMLElement | null>[],
) {
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (refs.some((ref) => ref.current?.contains(target))) return;
      onDismiss();
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [isOpen, onDismiss, refs]);
}

/**
 * Companion fix for the same non-modal popovers: pressing the trigger while
 * open should close it, but react-aria fires onOpenChange(false) immediately
 * followed by onOpenChange(true) within the same press. This swallows the
 * spurious reopen.
 */
export function useTriggerToggle(isOpen: boolean, triggerRef: RefObject<HTMLElement | null>) {
  const suppressReopenRef = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!triggerRef.current?.contains(event.target as Node)) return;
      suppressReopenRef.current = true;
      // Only the very next open within this click may be swallowed.
      setTimeout(() => {
        suppressReopenRef.current = false;
      }, 400);
    };
    document.addEventListener("pointerdown", handlePointerDown, true);
    return () => document.removeEventListener("pointerdown", handlePointerDown, true);
  }, [isOpen, triggerRef]);

  return (next: boolean) => {
    if (next && suppressReopenRef.current) {
      suppressReopenRef.current = false;
      return false;
    }
    return true;
  };
}
