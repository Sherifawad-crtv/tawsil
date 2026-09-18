import { Button } from "./Button";

export default function ConfirmSheet({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onCancel}>
      <div className="absolute inset-0" style={{ backgroundColor: "rgba(4,0,51,0.4)" }} />
      <div
        className="relative w-full max-w-lg rounded-t-[28px] p-5 flex flex-col gap-4"
        style={{ backgroundColor: "white", paddingBottom: "max(calc(env(safe-area-inset-bottom, 16px) + 16px), 32px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center">
          <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: "#D8D9D4" }} />
        </div>
        <div className="text-center">
          <p style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "17px", color: "#040033" }}>{title}</p>
          <p className="mt-1.5" style={{ fontFamily: "'Archivo', sans-serif", fontSize: "13px", color: "#9CA3AF" }}>{body}</p>
        </div>
        <div className="flex flex-col gap-2.5">
          <Button variant="destructive" onClick={onConfirm}>{confirmLabel}</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
