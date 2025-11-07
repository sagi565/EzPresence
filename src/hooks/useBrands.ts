import { useState, useCallback, useEffect } from 'react';
import { Brand } from '@models/Brand';
import { api } from '@utils/apiClient';

// API Response matches BrandDto from OpenAPI spec
interface ApiBrand {
  uuid: string;
  name: string;
  icon: string;
  tenantId?: number;
}

// Convert API brand to internal Brand format
const convertApiBrand = (apiBrand: ApiBrand): Brand => ({
  id: apiBrand.uuid,
  name: apiBrand.name,
  icon: apiBrand.icon,
});

export const useBrands = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [currentBrand, setCurrentBrand] = useState<Brand | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // GET /api/brands
        const response = await api.get<ApiBrand[]>('/brands');
        
        const convertedBrands = response.map(convertApiBrand);
        setBrands(convertedBrands);
        
        // Set first brand as current if available
        if (convertedBrands.length > 0 && !currentBrand) {
          setCurrentBrand(convertedBrands[0]);
        }
      } catch (err: any) {
        console.error('Failed to fetch brands:', err);
        setError(err.message || 'Failed to load brands');
        
        // Fallback to mock data on error
        const fallbackBrands: Brand[] = [
          { id: 'burger', name: 'MeatBar Burger', icon: '🍔' },
          { id: 'steakhouse', name: 'MeatBar Steakhouse', icon: '🥩' },
        ];
        setBrands(fallbackBrands);
        setCurrentBrand(fallbackBrands[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  const switchBrand = useCallback((brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    if (brand) {
      setCurrentBrand(brand);
    }
  }, [brands]);

  const refetchBrands = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get<ApiBrand[]>('/brands');
      const convertedBrands = response.map(convertApiBrand);
      setBrands(convertedBrands);
    } catch (err: any) {
      console.error('Failed to refetch brands:', err);
      setError(err.message || 'Failed to reload brands');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    brands,
    currentBrand,
    switchBrand,
    loading,
    error,
    refetchBrands,
  };
};