import { resetIntro } from "./introSeen";

/** Keys the app keeps on the device besides the intro flag. */
const DEVICE_KEYS: string[] = [];

/**
 * Ends the session: forgets what this app saved on the device and reloads from the start,
 * which also drops everything held in memory. There is no sign-in screen, so the person
 * lands back on the intro, as on a first launch.
 */
export function logOut() {
  resetIntro();
  try {
    DEVICE_KEYS.forEach((k) => localStorage.removeItem(k));
  } catch {
    // Storage can be unavailable - the reload below still resets the in-memory state.
  }
  window.location.replace("/");
}
