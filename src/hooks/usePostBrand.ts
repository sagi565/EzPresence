import { useState, useCallback } from 'react';
import { Brand, ApiBrandDto, BrandCreateDto, convertApiBrandToBrand, generateBrandIcon } from '@models/Brand';
import { api } from '@utils/apiClient';

export interface CreateBrandData {
  name: string;
  slogan?: string;
  categories?: string[];
  logo?: File;
}

export const usePostBrand = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBrand = useCallback(async (brandData: CreateBrandData): Promise<Brand> => {
    setLoading(true);
    setError(null);

    try {
      // TODO: If logo file is provided, upload it first and get the URL
      // For now, we'll skip logo upload as the API endpoint for file upload isn't in the spec
      let logoUrl: string | null = null;
      
      // If you have a file upload endpoint, uncomment and implement:
      // if (brandData.logo) {
      //   const formData = new FormData();
      //   formData.append('file', brandData.logo);
      //   const uploadResponse = await api.post<{ url: string }>('/upload/logo', formData);
      //   logoUrl = uploadResponse.url;
      // }

      // Prepare the request body according to BrandCreateDto schema
      const requestBody: BrandCreateDto = {
        name: brandData.name,
        logoUrl: logoUrl,
        slogan: brandData.slogan || null, // Use description as slogan if slogan not provided
        category: brandData.categories?.[0] || null, // API expects single category, not array
        subcategory: null, // Could be extended later
      };

      // POST /api/brands - Creates a new brand and returns its UUID
      const brandUuid = await api.post<string>('/brands', requestBody);
      
      if (!brandUuid) {
        throw new Error('No brand UUID returned from API');
      }

      console.log('✅ Brand created with UUID:', brandUuid);

      // Set this new brand as the active brand
      // POST /api/users/set-active-brand?BrandUuid={uuid}
      await api.post(`/users/set-active-brand?BrandUuid=${brandUuid}`);
      
      console.log('✅ Brand set as active');

      // Try to fetch the created brand details
      try {
        // GET /api/brands/{id}
        const createdBrand = await api.get<ApiBrandDto>(`/brands/${brandUuid}`);
        
        if (createdBrand) {
          return convertApiBrandToBrand(createdBrand);
        }
      } catch (fetchError) {
        console.warn('Could not fetch created brand, using local data');
      }

      // If we can't fetch the brand, return a constructed version
      return {
        id: brandUuid,
        name: brandData.name,
        icon: generateBrandIcon(brandData.categories?.[0], brandData.name),
        slogan: brandData.slogan,
        category: brandData.categories?.[0],
        categories: brandData.categories,
        logoUrl: logoUrl || undefined,
        isActive: true,
      };
      
    } catch (err: any) {
      console.error('Failed to create brand:', err);
      const errorMessage = err.message || 'Failed to create brand';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createBrand,
    loading,
    error,
  };
};