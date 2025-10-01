import { useState, useCallback } from 'react';
import { Brand } from '@models/Brand';

// Mock data
const MOCK_BRANDS: Brand[] = [
  { id: 'burger', name: 'MeatBar Burger', icon: '🍔' },
  { id: 'steakhouse', name: 'MeatBar Steakhouse', icon: '🥩' },
];

export const useBrands = () => {
  const [brands] = useState(MOCK_BRANDS);
  const [currentBrand, setCurrentBrand] = useState(MOCK_BRANDS[0]);

  const switchBrand = useCallback((brandId: string) => {
    const brand = brands.find(b => b.id === brandId);
    if (brand) {
      setCurrentBrand(brand);
    }
  }, [brands]);

  return {
    brands,
    currentBrand,
    switchBrand,
  };
};