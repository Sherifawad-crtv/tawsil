export type AccountType = "individual" | "business";

export interface IndividualProfile {
  type: "individual";
  phone: string;
  name: string;
  /** Absent until the user adds it later - see the add-email prompt before first booking. */
  email?: string;
  createdAt: string;
}

export interface BusinessProfile {
  type: "business";
  businessName: string;
  phone: string;
  email: string;
  taxNumber: string;
  registrationNumber: string;
  /** File names only - nothing is actually uploaded anywhere in this mock app. */
  taxNumberFileName?: string;
  registrationFileName?: string;
  createdAt: string;
}

export type AuthUser = IndividualProfile | BusinessProfile;

export function displayName(user: AuthUser): string {
  return user.type === "business" ? user.businessName : user.name;
}

export function initialsOf(user: AuthUser): string {
  const name = displayName(user);
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
