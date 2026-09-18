import type { TruckBaseClass } from "./types";
import imgDababa from "../../assets/truck-dababa.png";
import imgJumbo from "../../assets/truck-jumbo.png";
import imgVan from "../../assets/truck-van.png";
import imgTrailer from "../../assets/truck-trailer.png";

/** One picture per truck class - the same four everywhere a truck is drawn. */
export const TRUCK_IMAGES: Record<TruckBaseClass, string> = {
  Dababa: imgDababa,
  Jumbo: imgJumbo,
  "Suzuki Van": imgVan,
  Trailer: imgTrailer,
};
