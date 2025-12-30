import React, { createContext, useContext } from "react";
import { useFirebaseAuth } from "@/hooks/auth/useFirebaseAuth";

type SessionUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
};

type AuthContextType = {
  user: SessionUser | null;
  loading: boolean;
  syncError: string | null;
  // Sign-in methods
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signInFacebook: () => Promise<void>;
  signInApple: () => Promise<void>;
  logout: () => Promise<void>;
  // Email verification methods
  resendVerificationEmail: () => Promise<void>;
  refreshUser: () => Promise<void>;
  // Bridge to your backend
  refreshBackendSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  // Use the custom hook that properly handles API calls through the proxy
  const auth = useFirebaseAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};