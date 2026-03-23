import { useBrandContext } from '../../context/BrandContext';
import { api } from '@utils/apiClient';
import { BrandInitializeDto } from '@models/Brand';

const extractUuid = (data: any): string | null => {
  if (!data) return null;
  if (typeof data === 'string') return data;
  if (typeof data === 'object') {
    return data.uuid || data.BrandUuid || data.brandUuid || data.id || null;
  }
  return null;
};

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
      // Returns UUID string directly or an object containing it
      const response = await api.get<any>('/brands/uninitialized', { silentStatuses: [404] });
      return extractUuid(response);
    } catch (err: any) {
      if (err.status === 404) {
        return null; // No uninitialized brand found
      }
      console.warn('⚠️ [useBrands] Failed to get uninitialized brand (likely not created yet):', err);
      // We don't throw here to allow the initialization flow to continue to 'create' stage
      return null;
    }
  };

  const createUninitializedBrand = async (): Promise<string> => {
    try {
      // POST /brands with empty body to create uninitialized brand
      // silentStatuses: [409] to prevent global error reporting when handling strict-mode dual calls
      const response = await api.post<any>('/brands', {}, { silentStatuses: [409] });
      const uuid = extractUuid(response);
      if (!uuid) {
        throw new Error('Failed to create uninitialized brand: No UUID returned');
      }
      await refreshBrands();
      return uuid;
    } catch (err: any) {
      if (err.status === 409 || err.response?.status === 409) {
        console.warn('⚠️ [useBrands] 409 Conflict: Brand already exists. Fetching it...');
        const existingId = await getUninitializedBrand();
        if (existingId) return existingId;
      }
      throw err;
    }
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

  const editBrand = async (brandUuid: string, data: Partial<BrandInitializeDto>): Promise<void> => {
    // Map to the structure expected by the backend (PascalCase properties inside updatedProperties)
    const updateBody = {
      updatedProperties: {
         Name: data.name,
         LogoObject: data.logoObject,
         Slogan: data.slogan,
         Category: data.category,
         Subcategory: data.subcategory
      }
    };
    
    // Correct API call as per swagger.json for updating the active brand
    await api.put('/brands/active', updateBody);
    await refreshBrands();
    if (currentBrand?.id === brandUuid) {
        await fetchActiveBrand();
    }
  };

  const deleteBrand = async (brandUuid: string): Promise<void> => {
    // Correct API call as per swagger.json for deleting the active brand
    await api.delete('/brands/active');
    await refreshBrands();
    if (currentBrand?.id === brandUuid) {
        await fetchActiveBrand();
    }
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
    editBrand,
    deleteBrand,
  };
};