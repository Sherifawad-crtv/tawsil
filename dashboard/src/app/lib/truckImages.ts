import type { TruckBaseClass } from "./types";
import imgDababa from "../../assets/truck-dababa.webp";
import imgJumbo from "../../assets/truck-jumbo.webp";
import imgVan from "../../assets/truck-van.webp";
import imgTrailer from "../../assets/truck-trailer.webp";

/** One picture per truck class - the same four everywhere a truck is drawn. */
export const TRUCK_IMAGES: Record<TruckBaseClass, string> = {
  Dababa: imgDababa,
  Jumbo: imgJumbo,
  "Suzuki Van": imgVan,
  Trailer: imgTrailer,
};
