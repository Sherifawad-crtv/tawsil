/** "3000.0 EGP" - no thousands separator, one decimal, matches the existing build's price badges. */
export function formatEGP(amount: number) {
  return `${amount.toFixed(1)} EGP`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-US", { day: "numeric", month: "short", year: "numeric", hour: "numeric", minute: "2-digit" });
}

export function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export function isExpired(iso: string) {
  return new Date(iso).getTime() < Date.now();
}
