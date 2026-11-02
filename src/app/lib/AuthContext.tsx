import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser, BusinessProfile, IndividualProfile } from "./authTypes";

const STORAGE_KEY = "tawsil-auth-user";
const GUEST_STORAGE_KEY = "tawsil-auth-guest";

function loadStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function persistUser(user: AuthUser | null) {
  try {
    if (user) localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode, quota) - the session still
    // works, it just won't survive a reload.
  }
}

function loadStoredGuest(): boolean {
  try {
    return localStorage.getItem(GUEST_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

function persistGuest(isGuest: boolean) {
  try {
    if (isGuest) localStorage.setItem(GUEST_STORAGE_KEY, "1");
    else localStorage.removeItem(GUEST_STORAGE_KEY);
  } catch {
    // Same as persistUser - best effort only.
  }
}

interface AuthContextValue {
  user: AuthUser | null;
  /** Browsing and booking without an account - cleared the moment they actually sign up. */
  isGuest: boolean;
  continueAsGuest: () => void;
  signUpIndividual: (data: Omit<IndividualProfile, "type" | "createdAt">) => void;
  signUpBusiness: (data: Omit<BusinessProfile, "type" | "createdAt">) => void;
  updateEmail: (email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser);
  const [isGuest, setIsGuest] = useState<boolean>(loadStoredGuest);

  const continueAsGuest = useCallback(() => {
    setIsGuest(true);
    persistGuest(true);
  }, []);

  const signUpIndividual = useCallback((data: Omit<IndividualProfile, "type" | "createdAt">) => {
    const next: IndividualProfile = { type: "individual", createdAt: new Date().toISOString(), ...data };
    setUser(next);
    persistUser(next);
    setIsGuest(false);
    persistGuest(false);
  }, []);

  const signUpBusiness = useCallback((data: Omit<BusinessProfile, "type" | "createdAt">) => {
    const next: BusinessProfile = { type: "business", createdAt: new Date().toISOString(), ...data };
    setUser(next);
    persistUser(next);
    setIsGuest(false);
    persistGuest(false);
  }, []);

  const updateEmail = useCallback((email: string) => {
    setUser((prev) => {
      if (!prev || prev.type !== "individual") return prev;
      const next: IndividualProfile = { ...prev, email };
      persistUser(next);
      return next;
    });
  }, []);

  const signOut = useCallback(() => {
    setUser(null);
    persistUser(null);
    setIsGuest(false);
    persistGuest(false);
  }, []);

  const value = useMemo(
    () => ({ user, isGuest, continueAsGuest, signUpIndividual, signUpBusiness, updateEmail, signOut }),
    [user, isGuest, continueAsGuest, signUpIndividual, signUpBusiness, updateEmail, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
