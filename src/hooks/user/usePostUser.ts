import { useState, useCallback } from 'react';
import { 
  UserProfile, 
  ApiUserProfileDto,
  UserCreateDto,
  convertApiUserProfileToUserProfile,
  convertUserProfileToCreateDto,
  Gender
} from '@models/User';
import { api } from '@utils/apiClient';
import { auth } from '@lib/firebase'; // Import auth to access currentUser

export interface CreateUserData {
  firstName: string;
  lastName: string;
  birthDate: string;
  country?: string;
  gender?: Gender;
}

export const usePostUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (data: CreateUserData): Promise<UserProfile> => {
    setLoading(true);
    setError(null);

    // Get current user and validate email existence
    const currentUser = auth.currentUser;
    if (!currentUser || !currentUser.email) {
      const errorMsg = 'User email is missing. Please try logging in again.';
      setError(errorMsg);
      throw new Error(errorMsg);
    }

    try {
      // Pass the email to the converter
      const requestBody: UserCreateDto = convertUserProfileToCreateDto(data, currentUser.email);

      // POST /api/users
      const response = await api.post<ApiUserProfileDto>('/users', requestBody);
      
      if (!response) {
        throw new Error('No response returned from API');
      }

      console.log('✅ User created successfully');

      return convertApiUserProfileToUserProfile(response);
      
    } catch (err: any) {
      console.error('Failed to create user:', err);
      const errorMessage = err.message || 'Failed to create user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createUser,
    loading,
    error,
  };
};