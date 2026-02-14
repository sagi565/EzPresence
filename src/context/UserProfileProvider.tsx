import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
    UserProfile,
    ApiUserProfileDto,
    convertApiUserProfileToUserProfile
} from '@models/User';
import { api } from '@utils/apiClient';
import { useAuth } from '@auth/AuthProvider';

interface UserProfileContextType {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    notFound: boolean;
    refetchProfile: () => Promise<UserProfile | null>;
    isProfileComplete: () => boolean;
    hasProfile: () => boolean;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

export const UserProfileProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const { user } = useAuth();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [notFound, setNotFound] = useState(false);

    const fetchProfile = useCallback(async () => {
        if (!user) {
            setProfile(null);
            setLoading(false);
            return null;
        }

        try {
            // Don't set loading to true if we already have a profile (background refresh)
            // purely to avoid flickering, but for now let's keep it simple or maybe check if !profile
            if (!profile) setLoading(true);

            setError(null);
            setNotFound(false);

            const response = await api.get<ApiUserProfileDto>('/users/me');

            if (response) {
                const convertedProfile = convertApiUserProfileToUserProfile(response);
                setProfile(convertedProfile);
                setLoading(false);
                return convertedProfile;
            }

            setProfile(null);
            return null;
        } catch (err: any) {
            console.error('Failed to fetch user profile:', err);

            if (err.status === 404) {
                setProfile(null);
                setNotFound(true);
                setLoading(false);
                return null;
            }

            setError(err.message || 'Failed to load profile');
            setLoading(false);
            return null;
        } finally {
            setLoading(false);
        }
    }, [user]);

    // Initial fetch when user changes
    useEffect(() => {
        if (user) {
            fetchProfile();
        } else {
            setProfile(null);
            setLoading(false);
        }
    }, [user, fetchProfile]);

    const isProfileComplete = useCallback((): boolean => {
        if (!profile) return false;
        return profile.isProfileComplete;
    }, [profile]);

    const hasProfile = useCallback((): boolean => {
        return profile !== null;
    }, [profile]);

    const value = {
        profile,
        loading,
        error,
        notFound,
        refetchProfile: fetchProfile,
        isProfileComplete,
        hasProfile
    };

    return (
        <UserProfileContext.Provider value={value}>
            {children}
        </UserProfileContext.Provider>
    );
};

export const useUserProfileContext = () => {
    const context = useContext(UserProfileContext);
    if (context === undefined) {
        throw new Error('useUserProfileContext must be used within a UserProfileProvider');
    }
    return context;
};
