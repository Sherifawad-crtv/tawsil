export default function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: string[];
  active: string;
  onChange: (tab: string) => void;
}) {
  return (
    <div className="flex items-center gap-1 border-b border-border overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => onChange(tab)}
          className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap cursor-pointer border-b-2 transition-colors ${
            active === tab ? "border-blue text-blue" : "border-transparent text-muted hover:text-navy"
          }`}
          style={{ fontFamily: "var(--font-sub)" }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
