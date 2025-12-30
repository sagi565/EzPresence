import { useState, useCallback, useEffect } from 'react';
import { 
  UserProfile, 
  ApiUserProfileDto, 
  convertApiUserProfileToUserProfile 
} from '@models/User';
import { api } from '@utils/apiClient';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user profile from API
  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // GET /api/users/profile - Retrieves the current user's profile
      const response = await api.get<ApiUserProfileDto>('/users/profile');
      
      if (response) {
        const convertedProfile = convertApiUserProfileToUserProfile(response);
        setProfile(convertedProfile);
        return convertedProfile;
      }
      
      setProfile(null);
      return null;
    } catch (err: any) {
      console.error('Failed to fetch user profile:', err);
      
      // If 404, user profile doesn't exist yet
      if (err.status === 404) {
        setProfile(null);
        return null;
      }
      
      setError(err.message || 'Failed to load profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Check if profile is complete
  const isProfileComplete = useCallback((): boolean => {
    if (!profile) return false;
    return profile.isProfileComplete;
  }, [profile]);

  // Check if profile exists (even if incomplete)
  const hasProfile = useCallback((): boolean => {
    return profile !== null;
  }, [profile]);

  return {
    profile,
    loading,
    error,
    refetchProfile: fetchProfile,
    isProfileComplete,
    hasProfile,
  };
};