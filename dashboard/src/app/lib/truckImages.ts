import type { TruckBaseClass } from "./types";
import imgDababa from "../../assets/truck-dababa.png";
import imgJumbo from "../../assets/truck-jumbo.png";
import imgVan from "../../assets/truck-van.png";
import imgTrailer from "../../assets/truck-trailer.png";
import imgDababaTile from "../../assets/truck-dababa.webp";
import imgJumboTile from "../../assets/truck-jumbo.webp";
import imgVanTile from "../../assets/truck-van.webp";
import imgTrailerTile from "../../assets/truck-trailer.webp";

/** One picture per truck class - used everywhere a truck is drawn except the Vehicles tab. */
export const TRUCK_IMAGES: Record<TruckBaseClass, string> = {
  Dababa: imgDababa,
  Jumbo: imgJumbo,
  "Suzuki Van": imgVan,
  Trailer: imgTrailer,
};

/** Bigger reference photos, used only by the Vehicles tab's fleet-board cards. */
export const VEHICLE_TILE_IMAGES: Record<TruckBaseClass, string> = {
  Dababa: imgDababaTile,
  Jumbo: imgJumboTile,
  "Suzuki Van": imgVanTile,
  Trailer: imgTrailerTile,
};
