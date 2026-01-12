// Matches BrandDto from OpenAPI spec
export interface Brand {
  id: string;           // uuid from API
  name: string;
  icon: string;         // Generated client-side based on category
  logo?: string;        // logo as base64 bytes from API
  slogan?: string;      // slogan from API
  category?: string;    // category from API (single value)
  subcategory?: string; // subcategory from API
  isActive?: boolean;   // isActive from API
  createdAt?: string;   // createdAt from API

  // Legacy fields for backward compatibility
  description?: string; // Maps to slogan
  categories?: string[]; // Maps to [category] if exists
}

// API Response - matches BrandDto from OpenAPI spec exactly
export interface ApiBrandDto {
  uuid: string;
  firebaseUserId?: string | null;
  name?: string | null;
  logo?: string | null;          // base64 encoded logo bytes
  slogan?: string | null;
  category?: string | null;
  subcategory?: string | null;
  creditAddonPlanId?: number | null;
  remainingCredits?: number | null;
  isActive?: boolean | null;
  softDeleteUntil?: string | null;
  createdAt: string;
}

// API Request - matches BrandCreateDto from OpenAPI spec
export interface BrandCreateDto {
  name?: string | null;
  logo?: string | null;          // base64 encoded logo bytes
  slogan?: string | null;
  category?: string | null;
  subcategory?: string | null;
}

// API Request - matches BrandInitializeDto from OpenAPI spec
export interface BrandInitializeDto {
  name?: string | null;
  logo?: string | null;          // base64 encoded logo bytes
  slogan?: string | null;
  category?: string | null;
  subcategory?: string | null;
}

// API Request - matches BrandUpdateDto from OpenAPI spec
export interface BrandUpdateDto {
  name?: string | null;
  logo?: string | null;          // base64 encoded logo bytes
  slogan?: string | null;
  category?: string | null;
  subcategory?: string | null;
}

// Category icons mapping
export const CATEGORY_ICONS: Record<string, string> = {
  'Restaurant': '🍽️',
  'Cafe': '☕',
  'Retail': '🛍️',
  'Fashion': '👗',
  'Beauty': '💄',
  'Fitness': '💪',
  'Healthcare': '🏥',
  'Technology': '💻',
  'Education': '📚',
  'Entertainment': '🎬',
  'Real Estate': '🏠',
  'Travel': '✈️',
  'Finance': '💰',
  'Consulting': '📊',
  'Marketing': '📢',
  'Photography': '📷',
  'Art & Design': '🎨',
  'Food & Beverage': '🍔',
  'Automotive': '🚗',
  'Home Services': '🔧',
};

// Helper function to generate icon from category or name
export const generateBrandIcon = (category?: string | null, name?: string | null): string => {
  if (category && CATEGORY_ICONS[category]) {
    return CATEGORY_ICONS[category];
  }

  // Fallback: try to match by name keywords
  const nameLower = (name || '').toLowerCase();
  if (nameLower.includes('burger') || nameLower.includes('food')) return '🍔';
  if (nameLower.includes('coffee') || nameLower.includes('cafe')) return '☕';
  if (nameLower.includes('pizza')) return '🍕';
  if (nameLower.includes('steak') || nameLower.includes('meat')) return '🥩';
  if (nameLower.includes('tech')) return '💻';
  if (nameLower.includes('fashion') || nameLower.includes('cloth')) return '👗';

  return '🏢'; // Default icon
};

// Helper function to convert base64 to data URL for displaying
export const getLogoDataUrl = (base64Logo?: string | null): string | undefined => {
  if (!base64Logo) return undefined;
  // If it already has the data URL prefix, return as is
  if (base64Logo.startsWith('data:')) return base64Logo;
  // Otherwise, add the prefix (assuming it's a PNG, but could be adjusted)
  return `data:image/png;base64,${base64Logo}`;
};

// Convert API brand to internal Brand format
export const convertApiBrandToBrand = (apiBrand: ApiBrandDto): Brand => ({
  id: apiBrand.uuid,
  name: apiBrand.name || 'Unnamed Brand',
  icon: generateBrandIcon(apiBrand.category, apiBrand.name),
  logo: apiBrand.logo || undefined,
  slogan: apiBrand.slogan || undefined,
  category: apiBrand.category || undefined,
  subcategory: apiBrand.subcategory || undefined,
  isActive: apiBrand.isActive || false,
  createdAt: apiBrand.createdAt,
  // Legacy compatibility
  description: apiBrand.slogan || undefined,
  categories: apiBrand.category ? [apiBrand.category] : undefined,
});