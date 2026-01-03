import { useBrandContext } from '../../context/BrandContext';

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

  return {
    brands,
    currentBrand,
    switchBrand,
    loading,
    error,
    // Alias context method to match old hook API
    refetchBrands: refreshBrands, 
    fetchActiveBrand,
    hasBrands: brands.length > 0,
  };
};