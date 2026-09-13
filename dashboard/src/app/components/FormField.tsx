import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes, ReactNode } from "react";

const labelClass = "block text-body-2-semibold text-navy mb-1.5";
const controlClass =
  "w-full h-9 px-3 rounded-2lg bg-grey-light text-body-regular text-navy placeholder:text-muted ring-2 ring-inset ring-transparent transition-[background-color,box-shadow] duration-150 ease focus:outline-none focus:ring-blue focus:bg-white";

function FieldLabel({ label, required, badge }: { label: string; required?: boolean; badge?: string }) {
  return (
    <label className={labelClass} style={{ fontFamily: "var(--font-sub)" }}>
      {label}
      {required && <span className="text-status-cancelled"> *</span>}
      {badge && (
        <span
          className="ml-2 px-1.5 py-0.5 rounded-md text-caption-2-semibold text-royal bg-[#EEEAFB] uppercase tracking-wide"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {badge}
        </span>
      )}
    </label>
  );
}

export function TextField({
  label,
  required,
  badge,
  ...rest
}: { label: string; required?: boolean; badge?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <FieldLabel label={label} required={required} badge={badge} />
      <input {...rest} className={controlClass} style={{ fontFamily: "var(--font-sub)" }} />
    </div>
  );
}

export function TextareaField({
  label,
  required,
  badge,
  ...rest
}: { label: string; required?: boolean; badge?: string } & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <div>
      <FieldLabel label={label} required={required} badge={badge} />
      <textarea {...rest} className={`${controlClass} h-auto min-h-[88px] py-2.5 resize-y`} style={{ fontFamily: "var(--font-sub)" }} />
    </div>
  );
}

export function SelectField({
  label,
  required,
  badge,
  children,
  ...rest
}: { label: string; required?: boolean; badge?: string; children: ReactNode } & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <FieldLabel label={label} required={required} badge={badge} />
      <select {...rest} className={`${controlClass} cursor-pointer`} style={{ fontFamily: "var(--font-sub)" }}>
        {children}
      </select>
    </div>
  );
}
