import { useState, useCallback } from 'react';
import { 
  UserProfile, 
  ApiUserProfileDto,
  UserUpdateDto,
  convertApiUserProfileToUserProfile,
  convertUserProfileToUpdateDto,
  Gender
} from '@models/User';
import { api } from '@utils/apiClient';

export interface UpdateUserData {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  country?: string;
  gender?: Gender;
}

export const useUpdateUser = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = useCallback(async (data: UpdateUserData): Promise<UserProfile> => {
    setLoading(true);
    setError(null);

    try {
      const requestBody: UserUpdateDto = convertUserProfileToUpdateDto(data);

      // PUT /api/users
      const response = await api.put<ApiUserProfileDto>('/users', requestBody);
      
      if (!response) throw new Error('No response returned from API');

      console.log('✅ User updated successfully');
      return convertApiUserProfileToUserProfile(response);
      
    } catch (err: any) {
      console.error('Failed to update user:', err);
      const errorMessage = err.message || 'Failed to update user';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateUser, loading, error };
};