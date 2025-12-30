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

    try {
      const requestBody: UserCreateDto = convertUserProfileToCreateDto(data);

      // POST /api/users
      const response = await api.post<ApiUserProfileDto>('/users', requestBody);
      
      if (!response) throw new Error('No response returned from API');

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

  return { createUser, loading, error };
};