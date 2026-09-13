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
          className={`px-2.5 py-2 text-body-medium whitespace-nowrap cursor-pointer border-b-2 transition-colors ${
            active === tab ? "border-blue text-blue" : "border-transparent text-navy hover:text-blue"
          }`}
          style={{ fontFamily: "var(--font-sub)" }}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
