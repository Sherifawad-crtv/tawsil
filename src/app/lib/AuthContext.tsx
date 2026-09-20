import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { AuthUser, BusinessProfile, IndividualProfile } from "./authTypes";

const STORAGE_KEY = "tawsil-auth-user";

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

interface AuthContextValue {
  user: AuthUser | null;
  signUpIndividual: (data: Omit<IndividualProfile, "type" | "createdAt">) => void;
  signUpBusiness: (data: Omit<BusinessProfile, "type" | "createdAt">) => void;
  updateEmail: (email: string) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(loadStoredUser);

  const signUpIndividual = useCallback((data: Omit<IndividualProfile, "type" | "createdAt">) => {
    const next: IndividualProfile = { type: "individual", createdAt: new Date().toISOString(), ...data };
    setUser(next);
    persistUser(next);
  }, []);

  const signUpBusiness = useCallback((data: Omit<BusinessProfile, "type" | "createdAt">) => {
    const next: BusinessProfile = { type: "business", createdAt: new Date().toISOString(), ...data };
    setUser(next);
    persistUser(next);
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
  }, []);

  const value = useMemo(
    () => ({ user, signUpIndividual, signUpBusiness, updateEmail, signOut }),
    [user, signUpIndividual, signUpBusiness, updateEmail, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
