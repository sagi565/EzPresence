import { useState, useCallback } from 'react';
import { Brand, ApiBrandDto, BrandCreateDto, convertApiBrandToBrand, generateBrandIcon } from '@models/Brand';
import { api } from '@utils/apiClient';

export interface CreateBrandData {
  name: string;
  slogan?: string;
  categories?: string[];
  logo?: File;
}

// Helper function to convert File to base64
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // Remove the data:image/xxx;base64, prefix to get just the base64 string
      const base64 = (reader.result as string).split(',')[1];
      resolve(base64);
    };
    reader.onerror = (error) => reject(error);
  });
};

export const usePostBrand = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBrand = useCallback(async (brandData: CreateBrandData): Promise<Brand> => {
    setLoading(true);
    setError(null);

    try {
      // Convert logo file to base64 if provided
      let logoBase64: string | null = null;
      
      if (brandData.logo) {
        logoBase64 = await fileToBase64(brandData.logo);
        console.log('📷 Logo converted to base64, size:', logoBase64.length);
      }

      // Prepare the request body with logo as base64 bytes
      const requestBody: BrandCreateDto = {
        name: brandData.name,
        logo: logoBase64,
        slogan: brandData.slogan || null,
        category: brandData.categories?.[0] || null,
        subcategory: null,
      };

      // POST /api/brands?setActive=true - Creates a new brand and sets it as active
      const brandUuid = await api.post<string>('/brands?setActive=true', requestBody);
      
      if (!brandUuid) {
        throw new Error('No brand UUID returned from API');
      }

      console.log('✅ Brand created with UUID:', brandUuid);

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