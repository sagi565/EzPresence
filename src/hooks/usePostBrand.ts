import { useState, useCallback } from 'react';
import { Brand } from '@models/Brand';
import { api } from '@utils/apiClient';

export interface CreateBrandData {
  name: string;
  description?: string;
  slogan?: string;
  categories?: string[];
  logo?: File;
}

// API Response matches BrandDto from OpenAPI spec
interface ApiBrand {
  uuid: string;
  name: string;
  icon: string;
  tenantId?: number;
  description?: string;
  slogan?: string;
  categories?: string[];
  logoUrl?: string;
}

// Convert API brand to internal Brand format
const convertApiBrand = (apiBrand: ApiBrand): Brand => ({
  id: apiBrand.uuid,
  name: apiBrand.name,
  icon: apiBrand.icon,
  description: apiBrand.description,
  slogan: apiBrand.slogan,
  categories: apiBrand.categories,
  logoUrl: apiBrand.logoUrl,
});

// Generate random emoji for brand icon
const getRandomEmoji = (): string => {
  const emojis = ['🍔', '🥩', '🍕', '🍣', '🍜', '🍱', '🍰', '☕', '🍷', '🎨', '🎭', '🎪', '🎬', '🎮', '🎯', '🚀', '💡', '⭐', '🌟', '💎'];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

export const usePostBrand = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createBrand = useCallback(async (brandData: CreateBrandData): Promise<Brand> => {
    setLoading(true);
    setError(null);

    try {
      // Mock API call - replace with actual API endpoint
      // In production, you would upload the logo file first and get the URL
      
      let logoUrl: string | undefined;
      if (brandData.logo) {
        // Mock logo upload - in production, upload to cloud storage
        // const formData = new FormData();
        // formData.append('file', brandData.logo);
        // logoUrl = await api.post('/upload/logo', formData);
        logoUrl = URL.createObjectURL(brandData.logo); // Mock URL
      }

      const apiData = {
        name: brandData.name,
        icon: getRandomEmoji(),
        description: brandData.description,
        slogan: brandData.slogan,
        categories: brandData.categories,
        logoUrl,
      };

      // POST /api/brands
      const response = await api.post<ApiBrand>('/brands', apiData);
      
      const newBrand = convertApiBrand(response);
      return newBrand;
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