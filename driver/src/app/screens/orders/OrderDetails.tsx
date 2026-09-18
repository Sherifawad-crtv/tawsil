import { useNavigate, useParams } from "react-router";
import AccessTimeRounded from "@mui/icons-material/AccessTimeRounded";
import PinDropRounded from "@mui/icons-material/PinDropRounded";
import TaskAltRounded from "@mui/icons-material/TaskAltRounded";
import RouteRounded from "@mui/icons-material/RouteRounded";
import LocalShippingOutlined from "@mui/icons-material/LocalShippingOutlined";
import ThermostatRounded from "@mui/icons-material/ThermostatRounded";
import ScaleRounded from "@mui/icons-material/ScaleRounded";
import StraightenRounded from "@mui/icons-material/StraightenRounded";
import PhotoCameraRounded from "@mui/icons-material/PhotoCameraRounded";
import CheckCircleRounded from "@mui/icons-material/CheckCircleRounded";
import AddAPhotoRounded from "@mui/icons-material/AddAPhotoRounded";
import DirectionsCarRounded from "@mui/icons-material/DirectionsCarRounded";
import ScreenHeader from "../../components/ScreenHeader";
import MapSnippet from "../../components/MapSnippet";
import StatusBadge, { STATUS_STYLE } from "../../components/StatusBadge";
import StatusStepper from "../../components/StatusStepper";
import CollapsibleSection from "../../components/CollapsibleSection";
import { InfoRow, PersonCard } from "../../components/InfoRow";
import { useDataStore } from "../../lib/store";
import { byId } from "../../lib/selectors";
import { formatDateTime } from "../../lib/format";
import { truckTypeLabel } from "../../lib/constants";

export default function OrderDetails() {
  const navigate = useNavigate();
  const { orderId } = useParams();
  const { orders, profile, captureFile } = useDataStore();
  const order = byId(orders, orderId);

  if (!order) {
    return (
      <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
        <ScreenHeader title="Order Details" onBack={() => navigate(-1)} />
        <p className="text-center px-6" style={{ fontFamily: "'Archivo', sans-serif", color: "#9CA3AF" }}>Order not found.</p>
      </div>
    );
  }

  const hero = STATUS_STYLE[order.status];

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: "#F5F5F3" }}>
      <ScreenHeader title="Order Details" onBack={() => navigate(-1)} />
      <MapSnippet />

      <div className="relative -mt-5 rounded-t-[28px] pt-2" style={{ backgroundColor: "#F5F5F3" }}>
        <div className="flex justify-center py-2">
          <div className="w-10 h-1.5 rounded-full" style={{ backgroundColor: "#D8D9D4" }} />
        </div>

        <div className="w-full max-w-lg mx-auto px-4 pb-10 flex flex-col gap-4">
          {/* 1. Status hero - no reorder action here, that's a Contractor concern, not a driver one. */}
          <div className="rounded-[20px] p-4 flex items-center gap-2.5" style={{ backgroundColor: hero.bg }}>
            <hero.icon sx={{ fontSize: 20, color: hero.fg, flexShrink: 0 }} />
            <div className="min-w-0">
              <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "13px", color: hero.fg }}>{order.status}</p>
              <p className="truncate" style={{ fontFamily: "'Courier Prime', monospace", fontSize: "12px", color: hero.fg, opacity: 0.85 }}>#{order.id}</p>
            </div>
          </div>

          {/* 2. Status stepper */}
          <div className="rounded-[20px] bg-white p-4" style={{ border: "1px solid #E8E8E5" }}>
            <StatusStepper status={order.status} />
          </div>

          {/* 3. Order Information */}
          <Section title="Order Information">
            <InfoRow icon={<AccessTimeRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Pickup Time" value={formatDateTime(order.pickupAt)} />
            <InfoRow icon={<PinDropRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Waypoints" value={`${order.waypoints.length} stop${order.waypoints.length === 1 ? "" : "s"}`} />
            <InfoRow icon={<TaskAltRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="POD Required" value={order.podRequired ? "Yes" : "No"} />
          </Section>

          {/* 4. People Involved - Client + the driver's own Contractor (reference, not a self-card). */}
          <Section title="People Involved">
            <div className="flex flex-col gap-2.5">
              <PersonCard title="Client" name={order.clientName} subtitle={order.clientPhone} avatarColor="#16803C" />
              <PersonCard title="Contractor" name={profile.contractorName} avatarColor="#040033" />
            </div>
          </Section>

          {/* 5. Trip Details - no price: the spec never shows a driver a trip's commercial value. */}
          <CollapsibleSection icon={<RouteRounded sx={{ fontSize: 16, color: "#1253FA" }} />} title="Trip Details">
            <InfoRow icon={<RouteRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Trip Type" value={order.tripType} />
            <InfoRow icon={<LocalShippingOutlined sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Truck Type" value={truckTypeLabel(order)} />
            <InfoRow icon={<DirectionsCarRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Truck Plate" value={order.truckPlate} />
            {order.truckTempC !== undefined && (
              <InfoRow icon={<ThermostatRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Truck Temperature" value={`${order.truckTempC}°C`} />
            )}
            {order.weightKg !== undefined && <InfoRow icon={<ScaleRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Weight" value={`${order.weightKg} kg`} />}
            {order.hours !== undefined && <InfoRow icon={<AccessTimeRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Hours" value={`${order.hours}h`} />}
            {order.km !== undefined && <InfoRow icon={<StraightenRounded sx={{ fontSize: 15, color: "#9CA3AF" }} />} label="Distance" value={`${order.km} km`} />}
          </CollapsibleSection>

          {/* 6. Trip files & images - actionable here: submitting these is the Driver app's job (Contractor's Order Details is read-only for exactly this reason). */}
          <CollapsibleSection icon={<PhotoCameraRounded sx={{ fontSize: 16, color: "#1253FA" }} />} title="Trip Files & Images">
            <FileRow label="Truck's odometer before start" available={!!order.files.odometerBeforeUrl} onCapture={() => captureFile(order.id, "odometerBeforeUrl")} />
            <FileRow label="Truck's odometer at end" available={!!order.files.odometerAfterUrl} onCapture={() => captureFile(order.id, "odometerAfterUrl")} />
            <FileRow label="Additional images" available={order.files.additionalImages.length > 0} onCapture={() => captureFile(order.id, "additionalImage")} />
          </CollapsibleSection>

          {/* 7. Route Waypoints */}
          {order.waypoints.length > 0 && (
            <Section title="Route Waypoints">
              <div className="flex flex-col gap-2.5">
                {order.waypoints.map((wp, i) => (
                  <div key={wp.id} className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ backgroundColor: i === 0 ? "#EAF0FE" : "#FDECEC" }}>
                      <PinDropRounded sx={{ fontSize: 13, color: i === 0 ? "#1253FA" : "#DC2626" }} />
                    </div>
                    <div className="min-w-0">
                      <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 600, fontSize: "12.5px", color: "#040033" }}>{wp.label}</p>
                      <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11.5px", color: "#6B7280" }}>{wp.address}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          )}

          {/* 8. Timeline */}
          <Section title="Timeline">
            <div className="flex flex-col">
              {order.statusHistory.map((h, i) => (
                <div key={h.id} className="flex gap-3">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className="w-2 h-2 rounded-full mt-1.5" style={{ backgroundColor: "#1253FA" }} />
                    {i < order.statusHistory.length - 1 && <div className="w-px flex-1" style={{ backgroundColor: "#E8E8E5" }} />}
                  </div>
                  <div className="pb-3.5 min-w-0">
                    <p style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "12.5px", color: "#040033" }}>{h.toStatus}</p>
                    <p style={{ fontFamily: "'Courier Prime', monospace", fontSize: "11px", color: "#9CA3AF" }}>{formatDateTime(h.timestamp)}</p>
                    {h.note && <p className="mt-0.5" style={{ fontFamily: "'Archivo', sans-serif", fontSize: "11.5px", color: "#6B7280" }}>{h.note}</p>}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] bg-white p-4" style={{ border: "1px solid #E8E8E5" }}>
      <h3 className="mb-1" style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "14px", color: "#040033" }}>{title}</h3>
      {children}
    </div>
  );
}

function FileRow({ label, available, onCapture }: { label: string; available: boolean; onCapture: () => void }) {
  return (
    <div className="flex items-center justify-between py-2" style={{ minHeight: "44px" }}>
      <span style={{ fontFamily: "'Archivo', sans-serif", fontSize: "13px", color: "#6B7280" }}>{label}</span>
      {available ? (
        <span className="flex items-center gap-1" style={{ color: "#16803C" }}>
          <CheckCircleRounded sx={{ fontSize: 16 }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "11.5px" }}>Available</span>
        </span>
      ) : (
        <button
          onClick={onCapture}
          className="flex items-center gap-1.5 rounded-full pl-2.5 pr-3 py-1.5 cursor-pointer active:scale-95 transition-transform"
          style={{ backgroundColor: "#EAF0FE" }}
        >
          <AddAPhotoRounded sx={{ fontSize: 14, color: "#1253FA" }} />
          <span style={{ fontFamily: "'Archivo', sans-serif", fontWeight: 700, fontSize: "11.5px", color: "#1253FA" }}>Capture</span>
        </button>
      )}
    </div>
  );
}
