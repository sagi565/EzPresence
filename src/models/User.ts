// Internal User Profile type used in the UI
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO date string (YYYY-MM-DD)
  country?: string;
  gender?: Gender;
  isProfileComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

// API Response - matches UserProfileDto from OpenAPI spec
export interface ApiUserProfileDto {
  uuid: string;
  firebaseUserId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  birthDate?: string | null;
  country?: string | null;
  gender?: string | null;
  isProfileComplete?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

// API Request - matches UserProfileCreateDto from OpenAPI spec
export interface UserProfileCreateDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  country?: string | null;
  gender?: string | null;
}

// API Request - matches UserProfileUpdateDto from OpenAPI spec
export interface UserProfileUpdateDto {
  firstName?: string | null;
  lastName?: string | null;
  birthDate?: string | null;
  country?: string | null;
  gender?: string | null;
}

// Gender options for UI
export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

// Convert API user profile to internal format
export const convertApiUserProfileToUserProfile = (apiProfile: ApiUserProfileDto): UserProfile => ({
  id: apiProfile.uuid,
  firstName: apiProfile.firstName || '',
  lastName: apiProfile.lastName || '',
  birthDate: apiProfile.birthDate || '',
  country: apiProfile.country || undefined,
  gender: (apiProfile.gender?.toLowerCase() as Gender) || undefined,
  isProfileComplete: apiProfile.isProfileComplete || false,
  createdAt: apiProfile.createdAt || undefined,
  updatedAt: apiProfile.updatedAt || undefined,
});

// Convert internal profile to API create format
export const convertUserProfileToApiCreate = (profile: {
  firstName: string;
  lastName: string;
  birthDate: string;
  country?: string;
  gender?: Gender;
}): UserProfileCreateDto => ({
  firstName: profile.firstName,
  lastName: profile.lastName,
  birthDate: profile.birthDate,
  country: profile.country || null,
  gender: profile.gender || null,
});

// Format birth date for display (e.g., "January 15, 1990")
export const formatBirthDate = (dateString: string): string => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Calculate age from birth date
export const calculateAge = (birthDate: string): number => {
  if (!birthDate) return 0;
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

// Validate birth date (must be at least 13 years old)
export const validateBirthDate = (birthDate: string): { isValid: boolean; error?: string } => {
  if (!birthDate) {
    return { isValid: false, error: 'Birth date is required' };
  }
  
  const age = calculateAge(birthDate);
  
  if (age < 13) {
    return { isValid: false, error: 'You must be at least 13 years old' };
  }
  
  if (age > 120) {
    return { isValid: false, error: 'Please enter a valid birth date' };
  }
  
  return { isValid: true };
};