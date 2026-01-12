//
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@auth/AuthProvider';
import { useBrands } from '@/hooks/brands/useBrands';
import { useUserProfile } from '@/hooks/user/useUserProfile';

type Props = { children: React.ReactElement };

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading, notFound: profileNotFound } = useUserProfile();
  const {
    brands,
    currentBrand,
    loading: brandsLoading,
    hasBrands,
    setActiveBrand
  } = useBrands();

  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [isActivatingBrand, setIsActivatingBrand] = useState(false);

  const isLoading =
    authLoading ||
    (user && profileLoading) ||
    (user && profile && brandsLoading) ||
    isActivatingBrand;

  useEffect(() => {
    // 1. Wait for Auth
    if (authLoading) return;

    if (!user) {
      setRedirectPath('/login');
      return;
    }

    if (!user.emailVerified) {
      setRedirectPath('/verify-email');
      return;
    }

    // 2. Wait for Profile
    if (profileLoading) return;

    if (!profile) {
      if (profileNotFound) {
        setRedirectPath('/tell-us-who-you-are');
      }
      return;
    }

    // 3. Wait for Brands
    if (brandsLoading) return;

    // 4. Brand Logic
    // Case A: valid active brand exists - Allowed
    if (currentBrand) {
      setRedirectPath(null);
      return;
    }

    // Case B: No active brand, but we have brands in the list
    if (hasBrands && brands.length > 0) {
      // Pick the first one and set it as active
      if (!isActivatingBrand) {
        setIsActivatingBrand(true);
        console.log('🔄 [ProtectedRoute] Found brands but no active brand. Setting active...');
        const candidateId = brands[0].id; // or find(b => b.isActive) but if currentBrand is null, none is likely active/selected

        setActiveBrand(candidateId)
          .then(() => {
            console.log('✅ [ProtectedRoute] Active brand set successfully');
            // Context update should trigger re-render and fall into Case A
            setIsActivatingBrand(false);
          })
          .catch(err => {
            console.error('❌ [ProtectedRoute] Failed to set active brand:', err);
            // Verify if we should redirect or just let it spin/fail
            setIsActivatingBrand(false);
            // Maybe redirect to create brand as fallback? Or show error?
            // For now, let's assume retry or manual selection is needed? 
            // Logic says: "redirects to website" (which implies success).
          });
      }
      return;
    }

    // Case C: No brands at all - Redirect to Create First Brand
    if (!hasBrands) {
      console.log('⚠️ [ProtectedRoute] No brands found. Redirecting to create-first-brand');
      setRedirectPath('/create-your-first-brand');
      return;
    }

    // Default: Clear redirect if we passed all checks
    setRedirectPath(null);

  }, [
    authLoading,
    profileLoading,
    brandsLoading,
    user,
    profile,
    hasBrands,
    profileNotFound,
    currentBrand,
    brands,
    isActivatingBrand,
    setActiveBrand
  ]);

  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
        gap: '20px',
        background: 'linear-gradient(135deg, #f9fafb 0%, rgba(155, 93, 229, 0.03) 50%, #f9fafb 100%)',
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid rgba(155, 93, 229, 0.2)',
          borderTopColor: '#9b5de5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: '#6b7280', fontSize: '16px', fontWeight: 500 }}>
          Loading...
        </p>
      </div>
    );
  }

  if (redirectPath) {
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute;