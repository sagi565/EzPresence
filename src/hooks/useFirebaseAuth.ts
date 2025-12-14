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
import { auth, googleProvider, facebookProvider } from '@lib/firebase';
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

  // Listen to Firebase auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔵 Auth state changed:', user?.email || 'logged out');
      
      setFirebaseUser(user);
      
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
    await signInWithEmailAndPassword(auth, email, password);
  }, []);

  // Sign up with email/password
  const signUpEmail = useCallback(async (email: string, password: string, displayName?: string) => {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (displayName) {
      await updateProfile(user, { displayName });
    }
    await sendEmailVerification(user);
  }, []);

  // Sign in with Google
  const signInGoogle = useCallback(async () => {
    await signInWithPopup(auth, googleProvider);
  }, []);

  // Sign in with Facebook
  const signInFacebook = useCallback(async () => {
    await signInWithPopup(auth, facebookProvider);
  }, []);

  // Logout
  const logout = useCallback(async () => {
    await signOut(auth);
  }, []);

  // Resend verification email
  const resendVerificationEmail = useCallback(async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
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
    signInEmail,
    signUpEmail,
    signInGoogle,
    signInFacebook,
    logout,
    resendVerificationEmail,
    refreshUser,
    refreshBackendSession,
  };
};