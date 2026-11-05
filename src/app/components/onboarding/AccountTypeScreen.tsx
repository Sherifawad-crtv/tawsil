import ChevronRightRounded from "../icons/ChevronRightRounded";
import ScreenShell from "./ScreenShell";
import MapBackdrop from "./MapBackdrop";
import businessArt from "../../../assets/welcome-business.webp";
import individualArt from "../../../assets/welcome-individual.webp";
import { GhostButton } from "./StepChrome";
import type { AccountType } from "../../lib/authTypes";

/** The illustrations sit on white; multiply lets the card colour show through. */
function Art({ src }: { src: string }) {
  return <img src={src} alt="" draggable={false} className="max-w-full max-h-full object-contain" style={{ mixBlendMode: "multiply" }} />;
}

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
      <div className="w-16 h-16 flex items-center justify-center flex-shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <span style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "16px", color: "#040033" }}>{title}</span>
        <p className="whitespace-nowrap overflow-hidden text-ellipsis" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: "#626A76", marginTop: "4px" }}>{subtitle}</p>
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
    <ScreenShell background={<MapBackdrop />} fixedHeight>
      <div className="flex-1 flex flex-col justify-center" style={{ paddingBottom: "40px" }}>
        <div className="mb-8">
          <h1 style={{ fontFamily: "'Archivo Black', sans-serif", fontSize: "30px", color: "#040033", lineHeight: "1.15" }}>
            Welcome to Tawsil
          </h1>
          <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "13px", color: "#626A76", marginTop: "8px" }}>
            Tell us who's shipping, and we'll set you up.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <TypeCard
            icon={<Art src={businessArt} />}
            title="I'm a Business"
            subtitle="Tax details & invoicing"
            onClick={() => onChoose("business")}
          />
          <TypeCard
            icon={<Art src={individualArt} />}
            title="I'm an Individual"
            subtitle="Just your phone number"
            onClick={() => onChoose("individual")}
          />
        </div>

        <GhostButton label="Continue as Guest" onClick={onContinueAsGuest} />
      </div>
    </ScreenShell>
  );
}
