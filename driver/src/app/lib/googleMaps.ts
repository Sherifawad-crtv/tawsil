/**
 * Loads the Google Maps JavaScript API once, using the key from
 * VITE_GOOGLE_MAPS_API_KEY (set it in .env.local, never in source). With no key,
 * or if Google rejects it (billing off, API not enabled, wrong referrer), the
 * app keeps showing the static map instead.
 */
const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string | undefined;

export const hasMapsKey = Boolean(KEY);

let loading: Promise<typeof google.maps> | null = null;
let rejected = false;
const rejectionListeners = new Set<() => void>();

/** Google calls this after the map is created when the key or project is refused. */
if (typeof window !== "undefined") {
  (window as unknown as { gm_authFailure: () => void }).gm_authFailure = () => {
    rejected = true;
    rejectionListeners.forEach((fn) => fn());
  };
}

export function mapsRejected() {
  return rejected;
}

export function onMapsRejected(fn: () => void) {
  rejectionListeners.add(fn);
  return () => {
    rejectionListeners.delete(fn);
  };
}

export function loadGoogleMaps(): Promise<typeof google.maps> {
  if (!KEY) return Promise.reject(new Error("No Google Maps key"));
  if (window.google?.maps?.Map) return Promise.resolve(window.google.maps);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const w = window as unknown as Record<string, unknown>;
      w.__googleMapsReady = () => {
        Promise.all([google.maps.importLibrary("maps"), google.maps.importLibrary("geocoding")])
          .then(() => resolve(window.google.maps))
          .catch(reject);
      };
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(KEY)}&callback=__googleMapsReady&loading=async&v=weekly`;
      script.async = true;
      script.onerror = () => {
        loading = null;
        reject(new Error("Google Maps failed to load"));
      };
      document.head.appendChild(script);
    });
  }
  return loading;
}
