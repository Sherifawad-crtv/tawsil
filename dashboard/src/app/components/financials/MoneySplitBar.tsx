import { SegmentedBar } from "../boardui/SegmentedBar";
import { MONEY_COLORS } from "../../lib/financials";

/**
 * The identity the whole page rests on, drawn rather than written:
 * every pound a client is billed is either owed out to a contractor,
 * kept as earnings, or held for the tax authority.
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
  return (
    <SegmentedBar
      showValue={false}
      segments={[
        { key: "payables", label: "Contractor payables", value: payables, color: MONEY_COLORS.payables },
        { key: "earnings", label: "Company earnings", value: earnings, color: MONEY_COLORS.earnings },
        { key: "vat", label: "Taxes (VAT)", value: vat, color: MONEY_COLORS.vat },
      ]}
    />
  );
}
