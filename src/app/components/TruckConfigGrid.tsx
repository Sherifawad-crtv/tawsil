import AcUnitOutlined from "@mui/icons-material/AcUnitOutlined";
import AcUnitRounded from "@mui/icons-material/AcUnitRounded";
import ThermostatOutlined from "@mui/icons-material/ThermostatOutlined";
import ThermostatRounded from "@mui/icons-material/ThermostatRounded";
import ViewInArOutlined from "@mui/icons-material/ViewInArOutlined";
import ViewInArRounded from "@mui/icons-material/ViewInArRounded";
import Inventory2Outlined from "@mui/icons-material/Inventory2Outlined";
import Inventory2Rounded from "@mui/icons-material/Inventory2Rounded";
import CheckRounded from "@mui/icons-material/CheckRounded";

const CONFIGS = [
  { id: "frozen", name: "Frozen", description: "Below -18°C", outline: AcUnitOutlined, filled: AcUnitRounded },
  { id: "chilled", name: "Chilled", description: "0°C to 5°C", outline: ThermostatOutlined, filled: ThermostatRounded },
  { id: "open", name: "Open", description: "Flatbed cargo", outline: ViewInArOutlined, filled: ViewInArRounded },
  { id: "closed", name: "Closed", description: "Sealed box", outline: Inventory2Outlined, filled: Inventory2Rounded },
];

export default function TruckConfigGrid({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {CONFIGS.map((config) => {
        const isSelected = selected === config.id;
        const ConfigIcon = isSelected ? config.filled : config.outline;
        return (
          <button
            key={config.id}
            onClick={() => onSelect(config.id)}
            className="relative flex flex-col items-center justify-center rounded-[18px] cursor-pointer active:scale-[0.96] transition-all duration-200"
            style={{
              backgroundColor: "white",
              padding: "20px 12px",
              border: isSelected ? "2.5px solid #1253FA" : "2.5px solid transparent",
              boxShadow: isSelected
                ? "0 4px 20px rgba(18,83,250,0.15)"
                : "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            {/* Selection checkmark */}
            {isSelected && (
              <div
                className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: "#1253FA" }}
              >
                <CheckRounded sx={{ fontSize: 12, color: "white" }} />
              </div>
            )}

            {/* Icon */}
            <div
              className="flex items-center justify-center rounded-2xl mb-3"
              style={{
                width: "64px",
                height: "64px",
                backgroundColor: isSelected ? "rgba(18,83,250,0.08)" : "#F5F5F3",
                transition: "background-color 0.2s",
              }}
            >
              <ConfigIcon sx={{ fontSize: 32, color: "#040033" }} />
            </div>

            {/* Label */}
            <span
              style={{
                fontFamily: "'Archivo Black', sans-serif",
                fontSize: "15px",
                color: "#040033",
              }}
            >
              {config.name}
            </span>

            {/* Description */}
            <span
              className="mt-0.5"
              style={{
                fontFamily: "'Courier Prime', monospace",
                fontSize: "11px",
                color: "#9CA3AF",
              }}
            >
              {config.description}
            </span>

            {/* Subtle border for unselected */}
            {!isSelected && (
              <div
                aria-hidden="true"
                className="absolute inset-0 pointer-events-none rounded-[18px]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
