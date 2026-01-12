import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useBrands } from './useBrands';
import { useAuth } from '@auth/AuthProvider';

export const useBrandAuthRedirect = (isProtectedPage: boolean = false) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, loading: authLoading } = useAuth();
    const {
        brands,
        fetchActiveBrand,
        refetchBrands,
        setActiveBrand,
        loading: brandsLoading,
        currentBrand
    } = useBrands();

    const [checkingStatus, setCheckingStatus] = useState(true);

    useEffect(() => {
        const checkBrandStatus = async () => {
            if (authLoading) return;

            if (!user) {
                setCheckingStatus(false);
                return;
            }

            setCheckingStatus(true);

            try {
                // 1. Check if we already have an active brand in context or fetch it
                let activeBrand = currentBrand;
                if (!activeBrand) {
                    activeBrand = await fetchActiveBrand();
                }

                // If Active Brand Exists
                if (activeBrand) {
                    if (!isProtectedPage) {
                        // If we are on Create Brand Page (not protected), redirect to Scheduler
                        console.log('✅ [BrandAuth] Active brand found, redirecting to scheduler');
                        navigate('/scheduler', { replace: true });
                    } else {
                        // Protected page, and we have active brand: OK
                        setCheckingStatus(false);
                    }
                    return;
                }

                // If No Active Brand
                console.log('⚠️ [BrandAuth] No active brand found. Checking brands list...');

                // 2. Check Brands List (get only initialized brands)
                // We need to fetch fresh list to be sure
                await refetchBrands();
                // Since refetchBrands updates context, we need to access 'brands' from context, 
                // but 'brands' in closure might be stale. 
                // Ideally refetchBrands should return the data, but it returns void.
                // We will assume the context 'brands' will be updated in next render, OR we assume we can't fully trust closure here.
                // HOWEVER, since we're in an async function, we can't easily wait for React state update.
                // We should rely on the side-effect or duplicate the fetch for logic safety if context doesn't return it.
                // But let's assume valid flow:

                // Actually, let's look at the implementation of refetchBrands in BrandContext.
                // It sets state. We can't see the new state immediately in this closure. 
                // BUT, we can trust the API.

                // Let's rely on the brands check in standard ProtectedRoute flow, 
                // OR better: call helper that returns the data.
                // For now, let's assume we can loop.

                // Wait, 'brands' from useBrands() will update. This effect will re-run if we depend on [brands].
                // But we want to avoid infinite loops.

                // Alternative: Use a separate check mechanism.
                // Let's modify the flow to be linear: 

            } catch (err) {
                console.error('❌ [BrandAuth] Error checking brand status:', err);
            } finally {
                // We might set checkingStatus(false) if we didn't redirect
                // But if we are waiting for a redirect/state update, we might keep it true?
                // Let's rely on dependencies.
            }
        };

        // We can't easily put async logic that depends on state updates inside one effect without conditions.
        // Instead, let's look at how ProtectedRoute does it: it acts on state changes.

        // For this hook, let's simplify. It will be used in CreateBrandPage.
        // ProtectedRoute logic is already somewhat complex, we will refine it there.
        // This hook is primarily for CreateBrandPage to "Auto Redirect" if conditions are met.

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, authLoading]); // We largely depend on mount or specific triggers
};
