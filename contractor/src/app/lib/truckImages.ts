import type { TruckBaseClass } from "./types";
import imgDababa from "../../assets/truck-dababa.webp";
import imgJumbo from "../../assets/truck-jumbo.webp";
import imgVan from "../../assets/truck-van.webp";
import imgTrailer from "../../assets/truck-trailer.webp";

/** Same big reference photos as the dashboard's Vehicles tab fleet-board cards. */
export const VEHICLE_TILE_IMAGES: Record<TruckBaseClass, string> = {
  Dababa: imgDababa,
  Jumbo: imgJumbo,
  "Suzuki Van": imgVan,
  Trailer: imgTrailer,
};
