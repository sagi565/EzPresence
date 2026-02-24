//
export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  country?: string;
  gender?: Gender;
  // isProfileComplete removed
  createdAt?: string;
  updatedAt?: string;
}

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say';

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

// Updated: Added email field
export interface UserCreateDto {
  firstName: string;
  lastName: string;
  birthDate: string;
  country?: string | null;
  gender?: string | null;
  email: string;
}

export interface UserUpdateDto {
  UpdatedProperties: Record<string, any>;
}

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
  { value: 'prefer_not_to_say', label: 'Prefer not to say' },
];

export const convertApiUserProfileToUserProfile = (apiProfile: ApiUserProfileDto): UserProfile => ({
  id: apiProfile.uuid,
  firstName: apiProfile.firstName || '',
  lastName: apiProfile.lastName || '',
  birthDate: apiProfile.birthDate || '',
  country: apiProfile.country || undefined,
  gender: (apiProfile.gender?.toLowerCase() as Gender) || undefined,
  createdAt: apiProfile.createdAt || undefined,
  updatedAt: apiProfile.updatedAt || undefined,
});

// Updated: Now accepts email as a second argument
export const convertUserProfileToCreateDto = (
  data: {
    firstName: string;
    lastName: string;
    birthDate: string;
    country?: string;
    gender?: Gender;
  },
  email: string
): UserCreateDto => ({
  firstName: data.firstName,
  lastName: data.lastName,
  birthDate: data.birthDate,
  country: data.country || null,
  gender: data.gender || null,
  email: email,
});

export const convertUserProfileToUpdateDto = (data: Partial<{
  firstName: string;
  lastName: string;
  birthDate: string;
  country?: string;
  gender?: Gender;
}>): UserUpdateDto => {
  const props: Record<string, any> = {};

  if (data.firstName !== undefined) props['FirstName'] = data.firstName;
  if (data.lastName !== undefined) props['LastName'] = data.lastName;
  if (data.birthDate !== undefined) props['Birthdate'] = data.birthDate;
  if (data.country !== undefined) props['Country'] = data.country;
  if (data.gender !== undefined) props['Gender'] = data.gender;

  return {
    UpdatedProperties: props
  };
};

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