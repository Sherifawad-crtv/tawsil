import ApartmentRounded from "../icons/ApartmentRounded";
import PersonRounded from "../icons/PersonRounded";
import ChevronRightRounded from "../icons/ChevronRightRounded";
import ScreenShell from "./ScreenShell";
import { GhostButton } from "./StepChrome";
import type { AccountType } from "../../lib/authTypes";

function TypeCard({
  icon,
  title,
  subtitle,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-[22px] p-5 flex items-center gap-4 cursor-pointer active:scale-[0.98] transition-transform text-left"
      style={{ backgroundColor: "white", boxShadow: "0 2px 16px rgba(0,0,0,0.04)", border: "none" }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "rgba(18,83,250,0.08)" }}
      >
        {icon}
      </div>
      <div className="flex-1">
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "var(--type-title)", color: "#040033" }}>{title}</span>
        <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "var(--type-body-sm)", color: "#626A76", marginTop: "4px" }}>{subtitle}</p>
      </div>
      <ChevronRightRounded sx={{ fontSize: 22, color: "#626A76" }} />
    </button>
  );
}

export default function AccountTypeScreen({
  onChoose,
  onContinueAsGuest,
}: {
  onChoose: (type: AccountType) => void;
  /** Individual-only shortcut: browse and book without an account - they're asked to
   *  register later, right before their booking is confirmed (see TruckSelectorMap). */
  onContinueAsGuest: () => void;
}) {
  return (
    <ScreenShell>
      <div className="flex-1 flex flex-col justify-center" style={{ paddingBottom: "40px" }}>
        <div className="mb-8">
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "var(--type-display)", color: "#040033", lineHeight: "1.15" }}>
            Welcome to Tawsil
          </h1>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "var(--type-body-sm)", color: "#626A76", marginTop: "8px" }}>
            Tell us who's shipping, and we'll set you up.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <TypeCard
            icon={<ApartmentRounded sx={{ fontSize: 26, color: "#1253FA" }} />}
            title="I'm a Business"
            subtitle="Company account with tax details and invoicing"
            onClick={() => onChoose("business")}
          />
          <TypeCard
            icon={<PersonRounded sx={{ fontSize: 26, color: "#1253FA" }} />}
            title="I'm an Individual"
            subtitle="Quick signup with just your phone number"
            onClick={() => onChoose("individual")}
          />
        </div>

        <GhostButton label="Continue as Guest" onClick={onContinueAsGuest} />
      </div>
    </ScreenShell>
  );
}
