import { useState, useEffect, useCallback } from 'react';
import { ConnectedPlatform, ApiPlatformAccountDto, convertApiPlatformToConnected, getAllPlatformsWithStatus } from '@/models/Platform';
import { api } from '@/utils/apiClient';

export const useConnectedPlatforms = (brandIdOrUninitializedUuid?: string | null, isUninitialized: boolean = false) => {
    const [platforms, setPlatforms] = useState<ConnectedPlatform[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlatforms = useCallback(async (showLoading: boolean = true) => {
        if (isUninitialized && brandIdOrUninitializedUuid === null) {
            if (showLoading) setLoading(false);
            return;
        }

        if (showLoading) setLoading(true);
        setError(null);

        try {
            const params = new URLSearchParams();
            if (brandIdOrUninitializedUuid && isUninitialized) {
                params.append('uninitializedBrandUuid', brandIdOrUninitializedUuid);
            }

            const queryString = params.toString();
            const url = queryString ? `/platforms?${queryString}` : '/platforms';

            const data = await api.get<ApiPlatformAccountDto[]>(url);

            const connectedPlatforms = data
                .map(convertApiPlatformToConnected)
                .filter((p): p is ConnectedPlatform => p !== null);

            setPlatforms(getAllPlatformsWithStatus(connectedPlatforms));
        } catch (err: any) {
            console.error('Error fetching connected platforms:', err);
            setError(err instanceof Error ? err.message : 'Unknown error');
            setPlatforms(getAllPlatformsWithStatus([]));
        } finally {
            setLoading(false);
        }
    }, [brandIdOrUninitializedUuid, isUninitialized]);

    useEffect(() => {
        fetchPlatforms(true);
    }, [fetchPlatforms]);

    return { platforms, loading, error, refetch: () => fetchPlatforms(false) };
};
