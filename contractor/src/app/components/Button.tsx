import type { ButtonHTMLAttributes } from "react";

type Variant = "filled" | "outline" | "destructive";

export function Button({
  variant = "filled",
  className,
  children,
  ...props
}: { variant?: Variant } & ButtonHTMLAttributes<HTMLButtonElement>) {
  const styles: Record<Variant, React.CSSProperties> = {
    filled: { backgroundColor: "#040033", color: "white", border: "none" },
    outline: { backgroundColor: "transparent", color: "#040033", border: "1.5px solid #E8E8E5" },
    destructive: { backgroundColor: "#FDECEC", color: "#DC2626", border: "none" },
  };
  return (
    <button
      {...props}
      className={`w-full h-13 rounded-2xl cursor-pointer active:scale-[0.98] transition-transform disabled:opacity-40 disabled:active:scale-100 ${className ?? ""}`}
      style={{
        ...styles[variant],
        height: "52px",
        fontFamily: "'Archivo', sans-serif",
        fontWeight: 700,
        fontSize: "15px",
      }}
    >
      {children}
    </button>
  );
}
