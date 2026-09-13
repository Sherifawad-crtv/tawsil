import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import type { Icon as SolarIcon } from "@solar-icons/react/lib/types";
import { cx } from "../lib/cx";

/**
 * BoardUI's Button recipe (variant x size matrix), our colors/fonts.
 *   Sizing: medium h-9 rounded-2lg, small h-8 rounded-lg, xs h-6 rounded-sm.
 */

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "medium" | "small" | "xs";

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  iconOnly?: boolean;
  leadingIcon?: SolarIcon;
  trailingIcon?: SolarIcon;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

const sizeStyles: Record<ButtonSize, string> = {
  medium: "h-9 rounded-2lg px-3 gap-1.5 text-body-medium",
  small: "h-8 rounded-lg px-2.5 gap-1.5 text-body-medium",
  xs: "h-6 rounded-sm px-2 gap-1 text-caption-1-semibold",
};

const iconOnlySize: Record<ButtonSize, string> = {
  medium: "w-9 px-0",
  small: "w-8 px-0",
  xs: "w-6 px-0",
};

const iconSize: Record<ButtonSize, number> = { medium: 18, small: 16, xs: 13 };

const variantStyles: Record<ButtonVariant, string> = {
  primary: "bg-blue text-white shadow-xs hover:brightness-110 active:brightness-95 disabled:opacity-40",
  danger: "bg-status-cancelled text-white shadow-xs hover:brightness-110 active:brightness-95 disabled:opacity-40",
  secondary:
    "bg-white text-navy border border-border shadow-xs hover:bg-grey-light hover:border-grey active:bg-grey-light disabled:opacity-40",
  ghost: "bg-blue-soft text-blue hover:brightness-95 active:brightness-90 disabled:opacity-40",
};

export function Button({
  variant = "primary",
  size = "medium",
  iconOnly = false,
  leadingIcon: Leading,
  trailingIcon: Trailing,
  children,
  className,
  type = "button",
  ref,
  ...props
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      style={{ fontFamily: "var(--font-sub)" }}
      className={cx(
        "inline-flex items-center justify-center whitespace-nowrap font-semibold cursor-pointer select-none transition-[filter,background-color,border-color] duration-150 ease outline-none",
        "disabled:cursor-not-allowed",
        sizeStyles[size],
        iconOnly && iconOnlySize[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {Leading && <Leading size={iconSize[size]} className="flex-shrink-0" />}
      {!iconOnly && children}
      {!iconOnly && Trailing && <Trailing size={iconSize[size]} className="flex-shrink-0" />}
    </button>
  );
}
