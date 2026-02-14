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

  const updateUser = useCallback(async (data: UpdateUserData): Promise<UserProfile | void> => {
    setLoading(true);
    setError(null);

    try {
      const requestBody: UserUpdateDto = convertUserProfileToUpdateDto(data);

      // PUT /api/users
      // API returns 204 No Content on success, which apiClient converts to null
      const response = await api.put<ApiUserProfileDto | null>('/users', requestBody);

      console.log('✅ User updated successfully');

      if (response) {
        return convertApiUserProfileToUserProfile(response);
      }
      // If 204 (null), just return void

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