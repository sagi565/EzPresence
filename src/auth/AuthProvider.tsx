import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
  getIdToken,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider, appleProvider } from "../lib/firebase";

type SessionUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
};

type AuthContextType = {
  user: SessionUser | null;
  loading: boolean;
  // Sign-in methods
  signInEmail: (email: string, password: string) => Promise<void>;
  signUpEmail: (email: string, password: string, displayName?: string) => Promise<void>;
  signInGoogle: () => Promise<void>;
  signInFacebook: () => Promise<void>;
  signInApple: () => Promise<void>;
  logout: () => Promise<void>;
  // Bridge to your backend
  refreshBackendSession: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On auth state changes, sync to backend
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setFirebaseUser(u);
      setLoading(false);
      if (u) {
        await syncWithBackend(u);
      } else {
        // Optionally tell backend to clear session (e.g., remove cookie)
        await fetch("/api/auth/logout", { method: "POST", credentials: "include" }).catch(() => {});
      }
    });
    return () => unsub();
  }, []);

  const sessionUser: SessionUser | null = useMemo(() => {
    if (!firebaseUser) return null;
    return {
      uid: firebaseUser.uid,
      email: firebaseUser.email,
      displayName: firebaseUser.displayName,
      photoURL: firebaseUser.photoURL,
    };
  }, [firebaseUser]);

  const signInEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpEmail = async (email: string, password: string, displayName?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) await updateProfile(user, { displayName });
    // Optional: require email verification
    try { await sendEmailVerification(user); } catch {}
  };

  const signInGoogle = async () => { await signInWithPopup(auth, googleProvider); };
  const signInFacebook = async () => { await signInWithPopup(auth, facebookProvider); };
  const signInApple = async () => { await signInWithPopup(auth, appleProvider); };

  const logout = async () => { await signOut(auth); };

  const refreshBackendSession = async () => {
    if (auth.currentUser) await syncWithBackend(auth.currentUser, { forceRefresh: true });
  };

  const syncWithBackend = async (user: User, opts?: { forceRefresh?: boolean }) => {
    const idToken = await getIdToken(user, !!opts?.forceRefresh);
    // Send the Firebase ID token to your backend. Backend verifies with Admin SDK and returns/sets your session.
    await fetch("/api/auth/firebase", {
      method: "POST",
      credentials: "include", // so server can set httpOnly cookie if desired
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    }).catch(() => {});
  };

  const value: AuthContextType = {
    user: sessionUser,
    loading,
    signInEmail,
    signUpEmail,
    signInGoogle,
    signInFacebook,
    signInApple,
    logout,
    refreshBackendSession,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
