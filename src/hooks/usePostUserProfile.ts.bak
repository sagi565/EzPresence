import { useState, useCallback } from 'react';
import { 
  UserProfile, 
  ApiUserProfileDto,
  UserProfileCreateDto,
  convertApiUserProfileToUserProfile,
  convertUserProfileToApiCreate,
  Gender
} from '@models/User';
import { api } from '@utils/apiClient';

export interface CreateUserProfileData {
  firstName: string;
  lastName: string;
  birthDate: string;
  country?: string;
  gender?: Gender;
}

export const usePostUserProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createProfile = useCallback(async (profileData: CreateUserProfileData): Promise<UserProfile> => {
    setLoading(true);
    setError(null);

    try {
      // Prepare the request body according to UserProfileCreateDto schema
      const requestBody: UserProfileCreateDto = convertUserProfileToApiCreate(profileData);

      // POST /api/users/profile - Creates/updates the user profile
      const response = await api.post<ApiUserProfileDto>('/users/profile', requestBody);
      
      if (!response) {
        throw new Error('No response returned from API');
      }

      console.log('✅ User profile created successfully');

      return convertApiUserProfileToUserProfile(response);
      
    } catch (err: any) {
      console.error('Failed to create user profile:', err);
      const errorMessage = err.message || 'Failed to create profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<CreateUserProfileData>): Promise<UserProfile> => {
    setLoading(true);
    setError(null);

    try {
      // PUT /api/users/profile - Updates the user profile
      const response = await api.put<ApiUserProfileDto>('/users/profile', profileData);
      
      if (!response) {
        throw new Error('No response returned from API');
      }

      console.log('✅ User profile updated successfully');

      return convertApiUserProfileToUserProfile(response);
      
    } catch (err: any) {
      console.error('Failed to update user profile:', err);
      const errorMessage = err.message || 'Failed to update profile';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    createProfile,
    updateProfile,
    loading,
    error,
  };
};