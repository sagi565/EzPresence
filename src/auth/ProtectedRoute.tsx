import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@auth/AuthProvider';
import { useBrands } from '@/hooks/brands/useBrands';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import LoadingScreen from '@/components/LoadingScreen';

type Props = { children: React.ReactElement };

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile();
  const {
    brands,
    currentBrand,
    loading: brandsLoading,
    hasBrands,
    switchBrand
  } = useBrands();

  const activationAttempted = React.useRef(false);
  const [isActivating, setIsActivating] = useState(false);
  const location = useLocation();

  const isProfileSetupPage = location.pathname === '/tell-us-who-you-are';
  const isBrandSetupPage = location.pathname === '/create-your-first-brand';

  console.log('🛡️ [ProtectedRoute] State:', {
    authLoading,
    profileLoading,
    brandsLoading,
    isActivating,
    hasUser: !!user,
    hasProfile: !!profile,
    hasBrands,
    currentBrandId: currentBrand?.id,
    path: location.pathname
  });

  // Auto-activate brand if User has brands but none selected
  useEffect(() => {
    if (user && hasBrands && !currentBrand && !brandsLoading && !isActivating && !activationAttempted.current) {
      if (brands.length > 0) {
        console.log('🔄 [ProtectedRoute] Found brands but none active. Auto-activating first brand...');
        setIsActivating(true);
        activationAttempted.current = true;

        switchBrand(brands[0].id)
          .then(() => {
            console.log('✅ [ProtectedRoute] Brand activated successfully.');
            setIsActivating(false);
          })
          .catch((err) => {
            console.error('❌ [ProtectedRoute] Failed to auto-activate brand:', err);
            setIsActivating(false);
          });
      }
    }
  }, [user, hasBrands, currentBrand, brandsLoading, isActivating, brands, switchBrand]);

  // 1. Auth Check (Priority 1)
  if (authLoading) return <LoadingScreen message="Verifying authentication..." />;

  // If no user, redirect immediately.
  if (!user) {
    console.log('🛑 [ProtectedRoute] No user. Redirecting to Login.');
    return <Navigate to="/login" replace />;
  }

  if (!user.emailVerified) {
    console.log('🛑 [ProtectedRoute] Email not verified. Redirecting to verify-email.');
    return <Navigate to="/verify-email" replace />;
  }

  // 2. Profile Loading Check
  if (profileLoading) return <LoadingScreen message="Loading user profile..." />;

  // 3. Profile Completion Check
  // Allow access to profile setup page if profile is incomplete
  if (!isProfileSetupPage) {
    if (!profile || !profile.isProfileComplete) {
      console.log('🛑 [ProtectedRoute] Profile incomplete. Redirecting to tell-us-who-you-are.');
      return <Navigate to="/tell-us-who-you-are" replace />;
    }
  }

  // 4. Brand Checks
  // Only show brand loading if NOT on brand setup page
  if (brandsLoading && !isBrandSetupPage) return <LoadingScreen message="Loading brands..." />;

  if (isActivating) return <LoadingScreen message="Activating your brand..." />;

  if (!isBrandSetupPage) {
    if (!hasBrands) {
      console.log('🛑 [ProtectedRoute] No brands. Redirecting to create-your-first-brand.');
      return <Navigate to="/create-your-first-brand" replace />;
    }

    if (hasBrands && !currentBrand && !isActivating) {
      return <LoadingScreen message="Selecting brand..." />;
    }
  }

  return children;
};

export default ProtectedRoute;