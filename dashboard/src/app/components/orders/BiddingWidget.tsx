import { SledgehammerIcon } from "@solar-icons/react/linear";
import EmptyState from "../EmptyState";
import { formatEGP, formatDateTime } from "../../lib/format";
import type { BiddingInfo } from "../../lib/types";

export default function BiddingWidget({ bidding }: { bidding?: BiddingInfo }) {
  return (
    <div className="rounded-2xl bg-tile p-4">
      <div className="flex items-center gap-2 mb-4">
        <SledgehammerIcon size={16} className="text-muted" />
        <h3 className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-sub)" }}>Bidding</h3>
      </div>

      {!bidding ? (
        <EmptyState icon={SledgehammerIcon} title="No bids yet" note="Bids from contractor drivers will appear here once live bidding opens." />
      ) : (
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <div className="text-caption-1-regular text-muted uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>Total Bids</div>
              <div className="text-title-3-medium text-navy mt-0.5" style={{ fontFamily: "var(--font-heading)" }}>{bidding.totalBids}</div>
            </div>
            <div>
              <div className="text-caption-1-regular text-muted uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>Deadline</div>
              <div className="text-caption-1-regular text-navy mt-1.5">{formatDateTime(bidding.deadline)}</div>
            </div>
            <div>
              <div className="text-caption-1-regular text-muted uppercase tracking-wide" style={{ fontFamily: "var(--font-mono)" }}>Winning Bid</div>
              <div className="text-title-3-medium text-blue mt-0.5" style={{ fontFamily: "var(--font-heading)" }}>
                {bidding.winningBid ? formatEGP(bidding.winningBid) : "—"}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {bidding.bids.map((bid) => (
              <div key={bid.id} className="flex items-center justify-between px-3.5 py-1.5 rounded-2lg bg-grey-light">
                <div>
                  <div className="text-body-medium text-navy">{bid.driverName}</div>
                  <div className="text-caption-1-regular text-muted" style={{ fontFamily: "var(--font-mono)" }}>{formatDateTime(bid.submittedAt)}</div>
                </div>
                <div className="text-body-semibold text-navy" style={{ fontFamily: "var(--font-mono)" }}>{formatEGP(bid.amountEGP)}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
