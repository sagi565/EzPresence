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
    // The API only supports updating the *active* brand (PUT /brands/active) — there is
    // no per-brand update endpoint. So to edit a specific brand we must make it active
    // first, otherwise the changes (name, logo, etc.) land on whatever brand is currently
    // active and the brand being edited appears unchanged.
    if (currentBrand?.id !== brandUuid) {
      await api.post(`/users/set-active-brand?BrandUuid=${brandUuid}`);
    }

    // Body shape must match BrandUpdateDto / BrandUpdatePropsDto in swagger.json, whose
    // keys are camelCase. The dynamic `updatedProperties` patch is applied by key name,
    // so PascalCase keys are silently ignored (request "succeeds" but nothing changes).
    // Only include properties that were actually provided so we never clobber a field
    // with null (undefined keys are dropped by JSON.stringify).
    const updatedProperties: Record<string, unknown> = {};
    if (data.name !== undefined) updatedProperties.name = data.name;
    if (data.logoObject !== undefined) updatedProperties.logoObject = data.logoObject;
    if (data.slogan !== undefined) updatedProperties.slogan = data.slogan;
    if (data.category !== undefined) updatedProperties.category = data.category;
    if (data.subcategory !== undefined) updatedProperties.subcategory = data.subcategory;

    const updateBody = { updatedProperties };

    // Correct API call as per swagger.json for updating the active brand
    await api.put('/brands/active', updateBody);
    // The edited brand is now the active one, so always refresh the list and re-fetch
    // the active brand so the updated logo/name is reflected everywhere.
    await refreshBrands();
    await fetchActiveBrand();
  };

  const deleteBrand = async (brandUuid: string): Promise<void> => {
    // The user must always keep at least one brand.
    if (brands.length <= 1) {
      throw new Error('Cannot delete your only brand');
    }
    // The API only supports deleting the *active* brand (DELETE /brands/active).
    // To delete a specific brand, make it active first, then delete it.
    if (currentBrand?.id !== brandUuid) {
      await api.post(`/users/set-active-brand?BrandUuid=${brandUuid}`);
    }
    await api.delete('/brands/active');
    // The server soft-deletes the active brand and promotes another brand to active,
    // so always refresh the list and re-fetch the (new) active brand.
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
    editBrand,
    deleteBrand,
  };
};