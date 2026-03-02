import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, ApiUserProfileDto, convertApiUserProfileToUserProfile } from '@models/User';
import { api } from '@utils/apiClient';
import { auth } from '@lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

interface UserContextType {
    profile: UserProfile | null;
    loading: boolean;
    error: string | null;
    notFound: boolean;
    refetchProfile: () => Promise<UserProfile | null>;
    hasProfile: () => boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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

            const response = await api.get<ApiUserProfileDto>('/users/me', { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } });

            if (response) {
                const convertedProfile = convertApiUserProfileToUserProfile(response);
                setProfile(convertedProfile);
                return convertedProfile;
            }

            setProfile(null);
            return null;
        } catch (err: any) {
            console.error('Failed to fetch user profile:', err);

            if (err.status === 404 || err.response?.status === 404) {
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

    return (
        <UserContext.Provider value={{
            profile,
            loading,
            error,
            notFound,
            refetchProfile: fetchProfile,
            hasProfile
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};
