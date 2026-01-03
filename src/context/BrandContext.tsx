import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Brand, ApiBrandDto, convertApiBrandToBrand } from '@models/Brand';
import { api } from '@utils/apiClient';
import { auth } from '@lib/firebase';

interface BrandContextType {
  brands: Brand[];
  currentBrand: Brand | null;
  switchBrand: (brandId: string) => Promise<void>;
  loading: boolean;
  error: string | null;
  refreshBrands: () => Promise<void>;
  fetchActiveBrand: () => Promise<Brand | null>;
}

const BrandContext = createContext<BrandContextType | undefined>(undefined);

export const BrandProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBrands = useCallback(async () => {
    if (!auth.currentUser) {
      setLoading(false);
      setBrands([]);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get<ApiBrandDto[]>('/brands');
      
      if (Array.isArray(response)) {
        const activeBrands = response
          .filter(b => !b.softDeleteUntil || new Date(b.softDeleteUntil) > new Date())
          .map(convertApiBrandToBrand);
        
        setBrands(activeBrands);

        // Update current brand if needed
        if (activeBrands.length > 0) {
          setCurrentBrand(prev => {
            // Keep current if still valid
            if (prev && activeBrands.find(b => b.id === prev.id)) return prev;
            // Otherwise default to Active or First
            return activeBrands.find(b => b.isActive) || activeBrands[0];
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to fetch brands', err);
      if (err.status !== 404) setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) fetchBrands();
      else {
        setBrands([]);
        setCurrentBrand(null);
      }
    });
    return () => unsubscribe();
  }, [fetchBrands]);

  const switchBrand = useCallback(async (brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    if (!brand) return;

    // Optimistic Update
    setCurrentBrand(brand);

    try {
      await api.post(`/users/set-active-brand?BrandUuid=${brandId}`);
    } catch (err) {
      console.error('Failed to sync active brand', err);
    }
  }, [brands]);

  const fetchActiveBrand = useCallback(async () => {
    if (!auth.currentUser) return null;
    try {
      const response = await api.get<ApiBrandDto>('/brands/active');
      if (response) {
        const activeBrand = convertApiBrandToBrand(response);
        setCurrentBrand(activeBrand);
        return activeBrand;
      }
      return null;
    } catch (err) {
      return null;
    }
  }, []);

  return (
    <BrandContext.Provider value={{ 
      brands, 
      currentBrand, 
      switchBrand, 
      loading, 
      error,
      refreshBrands: fetchBrands,
      fetchActiveBrand
    }}>
      {children}
    </BrandContext.Provider>
  );
};

export const useBrandContext = () => {
  const context = useContext(BrandContext);
  if (!context) throw new Error('useBrandContext must be used within BrandProvider');
  return context;
};