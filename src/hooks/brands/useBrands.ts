import { useState, useCallback, useEffect } from 'react';
import { Brand, ApiBrandDto, convertApiBrandToBrand } from '@models/Brand';
import { api } from '@utils/apiClient';
import { auth } from '@lib/firebase';

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands from API
  const fetchBrands = useCallback(async () => {
    // Don't fetch if no authenticated user
    if (!auth.currentUser) {
      console.log('⚠️ [useBrands] No authenticated user, skipping fetch');
      setLoading(false);
      setBrands([]);
      return [];
    }

    try {
      setLoading(true);
      setError(null);
      
      // GET /api/brands
      const response = await api.get<ApiBrandDto[]>('/brands');
      
      if (!response || !Array.isArray(response)) {
        setBrands([]);
        return [];
      }
      
      const convertedBrands = response.map(convertApiBrandToBrand);
      setBrands(convertedBrands);
      
      // Find and set the active brand, or use the first one
      const activeBrand = convertedBrands.find(b => b.isActive) || convertedBrands[0];
      if (activeBrand) {
        setCurrentBrand(activeBrand);
      }
      
      return convertedBrands;
    } catch (err: any) {
      console.error('Failed to fetch brands:', err);
      setError(err.message || 'Failed to load brands');
      setBrands([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch brands only when there's an authenticated user
  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('✅ [useBrands] User authenticated, fetching brands');
        fetchBrands();
      } else {
        console.log('⚠️ [useBrands] No user, clearing brands');
        setBrands([]);
        setCurrentBrand(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchBrands]);

  // Switch to a different brand
  const switchBrand = useCallback(async (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    if (brand) {
      try {
        // Set active brand in API
        await api.post(`/users/set-active-brand?BrandUuid=${brandId}`);
        setCurrentBrand(brand);
      } catch (err) {
        console.error('Failed to set active brand:', err);
        // Still update locally even if API fails
        setCurrentBrand(brand);
      }
    }
  }, [brands]);

  // Get active brand from API
  const fetchActiveBrand = useCallback(async () => {
    if (!auth.currentUser) {
      return null;
    }
    
    try {
      const response = await api.get<ApiBrandDto>('/brands/active');
      if (response) {
        const activeBrand = convertApiBrandToBrand(response);
        setCurrentBrand(activeBrand);
        return activeBrand;
      }
      return null;
    } catch (err: any) {
      console.error('Failed to fetch active brand:', err);
      return null;
    }
  }, []);

  return {
    brands,
    currentBrand,
    switchBrand,
    loading,
    error,
    refetchBrands: fetchBrands,
    fetchActiveBrand,
    hasBrands: brands.length > 0,
  };
};