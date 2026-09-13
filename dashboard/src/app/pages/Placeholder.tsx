export default function Placeholder({ title, section }: { title: string; section: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 gap-3">
      <h1 className="text-2xl text-navy" style={{ fontFamily: "var(--font-heading)" }}>
        {title}
      </h1>
      <p className="text-sm text-muted max-w-sm" style={{ fontFamily: "var(--font-mono)" }}>
        Not built yet — this is {section} in the build order.
      </p>
    </div>
  );
}
