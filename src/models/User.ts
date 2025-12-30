export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  country?: string;
  gender?: Gender;
  isProfileComplete: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type Gender = 'male' | 'female' | 'other';

// Matches API response for GET /api/users/me
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

// Matches POST /api/users request body
export interface UserCreateDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  country?: string | null;
  gender?: string | null;
}

// Matches PUT /api/users request body
export interface UserUpdateDto {
  firstName?: string | null;
  lastName?: string | null;
  birthDate?: string | null;
  country?: string | null;
  gender?: string | null;
}

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

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

export const convertUserProfileToCreateDto = (data: {
  firstName: string;
  lastName: string;
  birthDate: string;
  country?: string;
  gender?: Gender;
}): UserCreateDto => ({
  firstName: data.firstName,
  lastName: data.lastName,
  birthDate: data.birthDate,
  country: data.country || null,
  gender: data.gender || null,
});

export const convertUserProfileToUpdateDto = (data: Partial<{
  firstName: string;
  lastName: string;
  birthDate: string;
  country?: string;
  gender?: Gender;
}>): UserUpdateDto => ({
  firstName: data.firstName || null,
  lastName: data.lastName || null,
  birthDate: data.birthDate || null,
  country: data.country || null,
  gender: data.gender || null,
});

export const validateBirthDate = (birthDate: string): { isValid: boolean; error?: string } => {
  if (!birthDate) return { isValid: false, error: 'Birth date is required' };
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  if (age < 13) return { isValid: false, error: 'You must be at least 13 years old' };
  if (age > 120) return { isValid: false, error: 'Please enter a valid birth date' };
  return { isValid: true };
};