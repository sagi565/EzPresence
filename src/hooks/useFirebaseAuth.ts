import { useState, useEffect, useCallback } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updateProfile,
  sendEmailVerification,
} from 'firebase/auth';
import { auth, googleProvider, facebookProvider, appleProvider } from '@lib/firebase';
import { api } from '@utils/apiClient';

type SessionUser = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
};

export const useFirebaseAuth = () => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔵 Auth state changed:', user?.email || 'logged out');
      
      setFirebaseUser(user);
      setSyncError(null);
      
      if (user) {
        setSessionUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        });
        
      } else {
        setSessionUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Sign in with email/password
  const signInEmail = useCallback(async (email: string, password: string) => {
    setSyncError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setSyncError(error.message);
      throw error;
    }
  }, []);

  // Sign up with email/password
  const signUpEmail = useCallback(async (email: string, password: string, displayName?: string) => {
    setSyncError(null);
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      if (displayName) {
        await updateProfile(user, { displayName });
      }
      await sendEmailVerification(user);
    } catch (error: any) {
      setSyncError(error.message);
      throw error;
    }
  }, []);

  // Sign in with Google
  const signInGoogle = useCallback(async () => {
    setSyncError(null);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error: any) {
      setSyncError(error.message);
      throw error;
    }
  }, []);

  // Sign in with Facebook
  const signInFacebook = useCallback(async () => {
    setSyncError(null);
    try {
      await signInWithPopup(auth, facebookProvider);
    } catch (error: any) {
      setSyncError(error.message);
      throw error;
    }
  }, []);

  // Sign in with Apple
  const signInApple = useCallback(async () => {
    setSyncError(null);
    try {
      await signInWithPopup(auth, appleProvider);
    } catch (error: any) {
      setSyncError(error.message);
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setSyncError(null);
    try {
      await signOut(auth);
    } catch (error: any) {
      setSyncError(error.message);
      throw error;
    }
  }, []);

  // Resend verification email
  const resendVerificationEmail = useCallback(async () => {
    setSyncError(null);
    try {
      if (auth.currentUser) {
        await sendEmailVerification(auth.currentUser);
      }
    } catch (error: any) {
      setSyncError(error.message);
      throw error;
    }
  }, []);

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (auth.currentUser) {
      await auth.currentUser.reload();
      const user = auth.currentUser;
      setFirebaseUser({ ...user });
      setSessionUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      });
    }
  }, []);

  // Force refresh backend session
  const refreshBackendSession = useCallback(async () => {
    if (auth.currentUser) {
      try {
        const idToken = await auth.currentUser.getIdToken(true); // Force refresh
        await api.post('/auth/login', { idToken });
        console.log('✅ Backend session refreshed');
      } catch (error) {
        console.error('❌ Failed to refresh backend session:', error);
      }
    }
  }, []);

  return {
    user: sessionUser,
    loading,
    syncError,
    signInEmail,
    signUpEmail,
    signInGoogle,
    signInFacebook,
    signInApple,
    logout,
    resendVerificationEmail,
    refreshUser,
    refreshBackendSession,
  };
};