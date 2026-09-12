import imgPickup from "figma:asset/98be2a271b1c4c84914eeda4a3e9f2e5409c61e7.png";
import imgTrailer from "figma:asset/8b02eb9ed88c311922718ae698eb2ffa6c3174e0.png";
import imgVan from "figma:asset/d08db6dfa4e9aec1f5c875df64625f61b61888c5.png";
import imgJumbo from "figma:asset/23b0286dd8ed8ae37715cce9fd2f871bbec923ab.png";
import CheckRounded from "@mui/icons-material/CheckRounded";

const VEHICLES = [
  { id: "pickup", name: "Pickup", image: imgJumbo },
  { id: "trailer", name: "Trailer", image: imgTrailer },
  { id: "van", name: "Van", image: imgVan },
  { id: "jumbo", name: "Jumbo", image: imgPickup },
];

export { VEHICLES };

function VehicleCard({
  vehicle,
  isSelected,
  onSelect,
}: {
  vehicle: (typeof VEHICLES)[0];
  isSelected: boolean;
  onSelect: (id: string) => void;
}) {
  return (
    <button
      onClick={() => onSelect(vehicle.id)}
      className="bg-white h-[154px] relative rounded-[22px] shrink-0 w-[194px] active:scale-[0.96] transition-all duration-200 cursor-pointer overflow-hidden"
      style={{
        scrollSnapAlign: "start",
        border: isSelected ? "2.5px solid #1253FA" : "2.5px solid transparent",
        boxShadow: isSelected ? "0 4px 20px rgba(18,83,250,0.15)" : "0 1px 6px rgba(0,0,0,0.04)",
      }}
    >
      <div className="flex items-center gap-2 px-2 size-full">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-[100px] h-[100px] object-contain flex-shrink-0"
        />
        <p className="font-['Archivo_Black:Regular',sans-serif] leading-[normal] text-[#1a1a1a] text-[16px] text-left">
          {vehicle.name}
        </p>
      </div>

      {isSelected && (
        <div
          className="absolute top-2.5 right-2.5 w-5 h-5 rounded-full flex items-center justify-center z-10"
          style={{ backgroundColor: "#1253FA" }}
        >
          <CheckRounded sx={{ fontSize: 12, color: "white" }} />
        </div>
      )}

      {!isSelected && (
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none rounded-[22px]"
        />
      )}
    </button>
  );
}

export default function VehicleCarouselSelectable({
  selected,
  onSelect,
}: {
  selected: string;
  onSelect: (id: string) => void;
}) {
  return (
    <>
      {VEHICLES.map((v) => (
        <VehicleCard
          key={v.id}
          vehicle={v}
          isSelected={selected === v.id}
          onSelect={onSelect}
        />
      ))}
    </>
  );
}