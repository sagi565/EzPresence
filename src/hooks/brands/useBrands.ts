import { useBrandContext } from '../../context/BrandContext';
import { api } from '@utils/apiClient';
import { BrandInitializeDto } from '@models/Brand';

export const useBrands = () => {
  const {
    brands,
    currentBrand,
    switchBrand,
    loading,
    error,
    refreshBrands,
    fetchActiveBrand
  } = useBrandContext();

  // New API Methods

  const getUninitializedBrand = async (): Promise<string | null> => {
    try {
      // Returns UUID string directly
      return await api.get<string>('/brands/uninitialized');
    } catch (err: any) {
      if (err.status === 404) {
        return null; // No uninitialized brand found
      }
      throw err;
    }
  };

  const createUninitializedBrand = async (): Promise<string> => {
    // POST /brands with empty body to create uninitialized brand
    return await api.post<string>('/brands', {});
  };

  const initializeBrand = async (brandUuid: string, data: BrandInitializeDto): Promise<void> => {
    // PUT /brands/{uuid}/initialize
    await api.put(`/brands/${brandUuid}/initialize`, data);
    // After initialization, the server sets it as active, so we should refresh our local state
    await refreshBrands();
    await fetchActiveBrand();
  };

  const setActiveBrand = async (brandUuid: string): Promise<void> => {
    await api.post(`/users/set-active-brand?BrandUuid=${brandUuid}`);
    await refreshBrands();
    await fetchActiveBrand();
  };

  return {
    brands,
    currentBrand,
    switchBrand,
    loading,
    error,
    refetchBrands: refreshBrands,
    fetchActiveBrand,
    hasBrands: brands.length > 0,
    getUninitializedBrand,
    createUninitializedBrand,
    initializeBrand,
    setActiveBrand,
  };
};