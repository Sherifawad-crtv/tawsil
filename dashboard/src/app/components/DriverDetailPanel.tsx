import { Star, Phone, Mail, IdCard, Ban, CheckCircle2 } from "lucide-react";
import { useDataStore } from "../lib/store";
import { getActiveOrderCountForDriver } from "../lib/selectors";
import { formatDate } from "../lib/format";
import type { Driver } from "../lib/types";

export default function DriverDetailPanel({ driver, onClose }: { driver: Driver; onClose: () => void }) {
  const { orders, toggleDriverActive } = useDataStore();
  const activeOrders = getActiveOrderCountForDriver(orders, driver.id);

  return (
    <div className="rounded-[var(--radius-control)] border border-border bg-grey-light/40 p-4 mt-2">
      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-muted uppercase tracking-wide mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Contact</div>
          <div className="flex items-center gap-1.5 text-sm text-navy mb-1"><Mail size={13} className="text-muted" /> {driver.email}</div>
          <div className="flex items-center gap-1.5 text-sm text-navy"><Phone size={13} className="text-muted" /> {driver.phone}</div>
        </div>
        <div>
          <div className="text-xs text-muted uppercase tracking-wide mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>License Info</div>
          <div className="flex items-center gap-1.5 text-sm text-navy mb-1"><IdCard size={13} className="text-muted" /> {driver.licenseNumber}</div>
          <div className="text-sm text-muted">Expires {formatDate(driver.licenseExpiry)}</div>
        </div>
        <div>
          <div className="text-xs text-muted uppercase tracking-wide mb-1.5" style={{ fontFamily: "var(--font-mono)" }}>Statistics</div>
          <div className="flex items-center gap-1.5 text-sm text-navy mb-1"><Star size={13} className="text-status-pending" /> {driver.rating.toFixed(2)} rating</div>
          <div className="text-sm text-muted">{driver.totalTrips.toLocaleString()} trips · {activeOrders} active order(s)</div>
        </div>
      </div>
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
        <button onClick={onClose} className="text-xs font-semibold text-muted hover:text-navy cursor-pointer" style={{ fontFamily: "var(--font-sub)" }}>
          Close
        </button>
        <button
          onClick={() => toggleDriverActive(driver.id)}
          className={`flex items-center gap-1.5 px-3.5 py-2 rounded-[var(--radius-control)] text-xs font-semibold cursor-pointer ${
            driver.active ? "text-status-cancelled hover:bg-[#FDECEC]" : "text-status-completed hover:bg-[#E7F6EC]"
          }`}
          style={{ fontFamily: "var(--font-sub)" }}
        >
          {driver.active ? <><Ban size={13} /> Deactivate</> : <><CheckCircle2 size={13} /> Reactivate</>}
        </button>
      </div>
    </div>
  );
}
