import { MONEY_COLORS } from "../../lib/financials";
import { formatAmount } from "../../lib/format";

/**
 * The identity the whole page rests on, drawn rather than written:
 * every pound a client is billed is either owed out to a contractor,
 * kept as earnings, or held for the tax authority.
 *
 * Same bar idiom as StatusBreakdownBar so it reads as part of this
 * dashboard and not as a chart borrowed from somewhere else.
 */
export default function MoneySplitBar({
  payables,
  earnings,
  vat,
}: {
  payables: number;
  earnings: number;
  vat: number;
}) {
  const total = Math.max(1, payables + earnings + vat);
  const parts = [
    { key: "payables", label: "Contractor payables", value: payables, color: MONEY_COLORS.payables },
    { key: "earnings", label: "Company earnings", value: earnings, color: MONEY_COLORS.earnings },
    { key: "vat", label: "Taxes (VAT)", value: vat, color: MONEY_COLORS.vat },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-grey-light">
        {parts.map(
          (p) =>
            p.value > 0 && (
              <div
                key={p.key}
                style={{ width: `${(p.value / total) * 100}%`, backgroundColor: p.color }}
                title={`${p.label}: ${formatAmount(p.value)}`}
              />
            )
        )}
      </div>

      <div className="flex flex-col gap-2">
        {parts.map((p) => (
          <div key={p.key} className="flex items-center gap-1.5 text-caption-1-regular text-navy min-w-0">
            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: p.color }} />
            <span className="truncate flex-1" style={{ fontFamily: "var(--font-sub)" }}>
              {p.label}
            </span>
            <span className="text-muted flex-shrink-0" style={{ fontFamily: "var(--font-mono)" }}>
              {Math.round((p.value / total) * 100)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
