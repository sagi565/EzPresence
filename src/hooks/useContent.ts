import { useState, useEffect } from 'react';
import { Content } from '@models/Content';

const MOCK_CONTENT_BURGER: Content[] = [
  { id: 'burger-special', title: 'Weekend Burger Special', thumbnail: '🍔', favorite: true, origin: 'presence' },
  { id: 'happy-hour', title: 'Happy Hour Deals', thumbnail: '🍺', favorite: true, origin: 'external' },
  { id: 'new-menu', title: 'New Menu Items', thumbnail: '📋', favorite: false, origin: 'presence' },
  { id: 'delivery-promo', title: 'Free Delivery', thumbnail: '🚚', favorite: false, origin: 'external' },
  { id: 'veggie-options', title: 'Veggie Burger Options', thumbnail: '🥗', favorite: false, origin: 'presence' },
  { id: 'dessert-special', title: 'Sweet Treats', thumbnail: '🍰', favorite: false, origin: 'external' },
  { id: 'family-meal', title: 'Family Pack Deal', thumbnail: '👨‍👩‍👧‍👦', favorite: true, origin: 'presence' },
  { id: 'fresh-ingredients', title: 'Farm Fresh Daily', thumbnail: '🥬', favorite: false, origin: 'presence' },
];

const MOCK_CONTENT_STEAKHOUSE: Content[] = [
  { id: 'prime-cuts', title: 'Prime Steak Cuts', thumbnail: '🥩', favorite: true, origin: 'presence' },
  { id: 'wine-pairing', title: 'Wine Pairings', thumbnail: '🍷', favorite: true, origin: 'external' },
  { id: 'chef-special', title: 'Chef Special Menu', thumbnail: '👨‍🍳', favorite: false, origin: 'presence' },
  { id: 'date-night', title: 'Date Night Package', thumbnail: '💕', favorite: true, origin: 'external' },
  { id: 'private-dining', title: 'Private Dining', thumbnail: '🏛️', favorite: false, origin: 'presence' },
  { id: 'seasonal-menu', title: 'Seasonal Selections', thumbnail: '🍂', favorite: false, origin: 'external' },
  { id: 'wagyu-special', title: 'Wagyu Premium', thumbnail: '⭐', favorite: true, origin: 'presence' },
];

const BRAND_CONTENT: Record<string, Content[]> = {
  burger: MOCK_CONTENT_BURGER,
  steakhouse: MOCK_CONTENT_STEAKHOUSE,
};

// Shuffle array helper
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export const useContent = (brandId: string) => {
  const [content, setContent] = useState<Content[]>([]);

  useEffect(() => {
    // Shuffle content on mount and when brand changes
    const brandContent = BRAND_CONTENT[brandId] || [];
    const shuffledContent = shuffleArray(brandContent);
    setContent(shuffledContent);
  }, [brandId]);

  return { content };
};
