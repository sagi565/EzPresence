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

// Sync user with backend - creates user if not exists
async function syncUserWithBackend(): Promise<void> {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.log('⚠️ [Auth] No user to sync');
      return;
    }

    console.log('🔄 [Auth] Syncing user with backend...');
    
    // Call the backend to sync/create the user
    // The backend should handle this with the Firebase token
    // If your backend auto-creates users on first authenticated request,
    // you can just make any authenticated request here
    
    // Option 1: If you have a dedicated sync endpoint
    // await api.post('/auth/sync', {
    //   email: user.email,
    //   displayName: user.displayName,
    //   photoURL: user.photoURL,
    // });
    
    // Option 2: If your backend auto-creates users on first request
    // Just try to get brands - the backend will create the user if needed
    try {
      await api.get('/brands');
      console.log('✅ [Auth] User synced with backend');
    } catch (err: any) {
      // If it's a 404 or empty result, that's fine - user exists but has no brands
      if (err.status === 404 || err.status === 0) {
        console.log('✅ [Auth] User synced (no brands yet)');
      } else {
        throw err;
      }
    }
  } catch (error) {
    console.error('❌ [Auth] Failed to sync user with backend:', error);
    // Don't throw - we don't want to block the auth flow
  }
}

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
        
        // Sync user with backend after auth state change
        // Only sync if email is verified (or for social logins which are auto-verified)
        if (user.emailVerified) {
          await syncUserWithBackend();
        }
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
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Sync with backend after successful login
      if (result.user.emailVerified) {
        await syncUserWithBackend();
      }
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
      
      // Note: User will be synced with backend after email verification
      console.log('📧 [Auth] Verification email sent, user will be synced after verification');
    } catch (error: any) {
      setSyncError(error.message);
      throw error;
    }
  }, []);

  // Sign in with Google
  const signInGoogle = useCallback(async () => {
    setSyncError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      
      // Google users are automatically verified, sync immediately
      await syncUserWithBackend();
    } catch (error: any) {
      setSyncError(error.message);
      throw error;
    }
  }, []);

  // Sign in with Facebook
  const signInFacebook = useCallback(async () => {
    setSyncError(null);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      
      // Facebook users are automatically verified, sync immediately
      await syncUserWithBackend();
    } catch (error: any) {
      setSyncError(error.message);
      throw error;
    }
  }, []);

  // Sign in with Apple
  const signInApple = useCallback(async () => {
    setSyncError(null);
    try {
      const result = await signInWithPopup(auth, appleProvider);
      
      // Apple users are automatically verified, sync immediately
      await syncUserWithBackend();
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
      
      // If user just verified their email, sync with backend
      if (user.emailVerified) {
        await syncUserWithBackend();
      }
    }
  }, []);

  // Force refresh backend session
  const refreshBackendSession = useCallback(async () => {
    if (auth.currentUser) {
      await syncUserWithBackend();
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