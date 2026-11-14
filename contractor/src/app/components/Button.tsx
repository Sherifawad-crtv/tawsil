import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "destructive" | "ghost";

/**
 * Same buttons as the client app: blue primary CTA with a glow (grey when
 * disabled), red destructive, soft secondary, and a text-only ghost action.
 */
export function Button({
  variant = "primary",
  children,
  disabled,
  ...props
}: { variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  if (variant === "ghost") {
    return (
      <button
        {...props}
        disabled={disabled}
        className="w-full text-center cursor-pointer active:opacity-70 transition-opacity"
        style={{ border: "none", background: "none", padding: "10px", fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "13px", color: "#6B7280" }}
      >
        {children}
      </button>
    );
  }

  const styles: Record<Exclude<Variant, "ghost">, { bg: string; fg: string; shadow: string }> = {
    primary: { bg: disabled ? "#D8D9D4" : "#1253FA", fg: "white", shadow: disabled ? "none" : "0 4px 20px rgba(18,83,250,0.3)" },
    destructive: { bg: "#DC2626", fg: "white", shadow: "none" },
    secondary: { bg: "#F5F5F3", fg: "#040033", shadow: "none" },
  };
  const s = styles[variant];
  return (
    <button
      {...props}
      disabled={disabled}
      className="w-full rounded-2xl flex items-center justify-center gap-2 cursor-pointer active:scale-[0.97] disabled:cursor-not-allowed"
      style={{
        backgroundColor: s.bg,
        boxShadow: s.shadow,
        padding: "16px",
        border: "none",
        transition: "background-color 0.4s ease, box-shadow 0.4s ease, transform 0.2s ease",
      }}
    >
      <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "15px", color: s.fg, letterSpacing: "0.02em" }}>{children}</span>
    </button>
  );
}
