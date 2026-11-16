import type { ButtonHTMLAttributes, ReactNode } from "react";

/** White 40px rounded-square button, as used for the back and action buttons in the client app's headers. */
export default function IconButton({
  label,
  children,
  ...props
}: { label: string; children: ReactNode } & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  return (
    <button
      {...props}
      aria-label={label}
      className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer active:scale-90 transition-transform flex-shrink-0"
      style={{ backgroundColor: "white", border: "none" }}
    >
      {children}
    </button>
  );
}
