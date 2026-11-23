/** The intro walkthrough shows once, on first launch. Removing the account clears the flag so the next person sees it again. */
const KEY = "tawsil-client-intro-seen";

export function hasSeenIntro(): boolean {
  try {
    return localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    localStorage.setItem(KEY, "1");
  } catch {
    // Storage can be unavailable (private mode) - the intro just shows again next launch.
  }
}

export function resetIntro() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // Same as above - best effort.
  }
}
