import { useState, useEffect, useCallback } from 'react';
import { 
  UserProfile, 
  ApiUserProfileDto, 
  convertApiUserProfileToUserProfile 
} from '@models/User';
import { api } from '@utils/apiClient';
import { auth } from '@lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useUserProfile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Fetch user profile from API
  const fetchProfile = useCallback(async () => {
    // Double check auth status
    if (!auth.currentUser) {
      setProfile(null);
      setLoading(false);
      return null;
    }

    try {
      setLoading(true);
      setError(null);
      setNotFound(false);
      
      const response = await api.get<ApiUserProfileDto>('/users/me');
      
      if (response) {
        const convertedProfile = convertApiUserProfileToUserProfile(response);
        setProfile(convertedProfile);
        return convertedProfile;
      }
      
      setProfile(null);
      return null;
    } catch (err: any) {
      console.error('Failed to fetch user profile:', err);
      
      if (err.status === 404) {
        setProfile(null);
        setNotFound(true);
        return null;
      }
      
      setError(err.message || 'Failed to load profile');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for Auth Changes to trigger fetch
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchProfile();
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [fetchProfile]);

  const hasProfile = useCallback((): boolean => {
    return profile !== null;
  }, [profile]);

  return {
    profile,
    loading,
    error,
    notFound,
    refetchProfile: fetchProfile,
    hasProfile,
  };
};
