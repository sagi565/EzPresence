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
import { auth } from '@lib/firebase';

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
      console.log('📡 [useUpdateUser] Starting update call with data:', data);

      const user = auth.currentUser;
      console.log('📡 [useUpdateUser] Current Firebase user:', user ? user.uid : 'No user');
      const email = user?.email || undefined;
      console.log('📡 [useUpdateUser] Email from Firebase user:', email);

      const requestBody: UserUpdateDto = convertUserProfileToUpdateDto(data, email);
      console.log('📡 [useUpdateUser] Request body prepared:', JSON.stringify(requestBody, null, 2));

      // PUT /api/users
      console.log('📡 [useUpdateUser] Executing PUT /api/users...');
      const response = await api.put<ApiUserProfileDto | null>('/users', requestBody);

      console.log('✅ [useUpdateUser] User updated successfully. Response:', response);

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