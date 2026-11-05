import mapSilhouette from "../../../assets/map-backdrop.svg";

/**
 * A pale street-map silhouette - districts, main avenues, a river and parks,
 * no route, pins or labels - used as the backdrop of the welcome screen.
 * Generated artwork, not real map data.
 */
export default function MapBackdrop() {
  return <img src={mapSilhouette} alt="" className="w-full h-full object-cover" draggable={false} />;
}
