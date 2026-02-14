import { useState, useEffect } from 'react';
import { ConnectedPlatform, ApiPlatformAccountDto, convertApiPlatformToConnected, getAllPlatformsWithStatus } from '@/models/Platform';
import { api } from '@/utils/apiClient';

export const useConnectedPlatforms = (brandId: string) => {
    const [platforms, setPlatforms] = useState<ConnectedPlatform[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!brandId) {
            setLoading(false);
            return;
        }

        const fetchPlatforms = async () => {
            setLoading(true);
            setError(null);

            try {
                // Use api utility to fetch platforms
                const data = await api.get<ApiPlatformAccountDto[]>('/platforms');

                // Convert API response to ConnectedPlatform[]
                const connectedPlatforms = data
                    .map(convertApiPlatformToConnected)
                    .filter((p): p is ConnectedPlatform => p !== null);

                // Get all platforms with connection status
                const allPlatforms = getAllPlatformsWithStatus(connectedPlatforms);

                setPlatforms(allPlatforms);
            } catch (err) {
                console.error('Error fetching connected platforms:', err);
                setError(err instanceof Error ? err.message : 'Unknown error');
                // Return empty platforms on error
                setPlatforms(getAllPlatformsWithStatus([]));
            } finally {
                setLoading(false);
            }
        };

        fetchPlatforms();
    }, [brandId]);

    return { platforms, loading, error };
};
