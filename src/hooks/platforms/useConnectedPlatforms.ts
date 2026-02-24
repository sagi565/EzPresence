import { useState, useEffect, useCallback } from 'react';
import { ConnectedPlatform, ApiPlatformAccountDto, convertApiPlatformToConnected, getAllPlatformsWithStatus } from '@/models/Platform';
import { api } from '@/utils/apiClient';

export const useConnectedPlatforms = (brandIdOrUninitializedUuid?: string | null, isUninitialized: boolean = false) => {
    const [platforms, setPlatforms] = useState<ConnectedPlatform[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPlatforms = useCallback(async () => {
        // Skip fetch if we're explicitly waiting for an ID (only if uninitialized context)
        if (isUninitialized && brandIdOrUninitializedUuid === null) {
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Use api utility to fetch platforms
            let url = '/platforms';
            const params = new URLSearchParams();

            if (brandIdOrUninitializedUuid) {
                if (isUninitialized) {
                    params.append('uninitializedBrandUuid', brandIdOrUninitializedUuid);
                }
                // Do NOT append brandId - backend infers it
            }

            const queryString = params.toString();
            if (queryString) {
                url += `?${queryString}`;
            }

            const data = await api.get<ApiPlatformAccountDto[]>(url);

            // Convert API response to ConnectedPlatform[]
            const connectedPlatforms = data
                .map(convertApiPlatformToConnected)
                .filter((p): p is ConnectedPlatform => p !== null);

            // Get all platforms with connection status
            const allPlatforms = getAllPlatformsWithStatus(connectedPlatforms);

            setPlatforms(allPlatforms);
        } catch (err: any) {
            console.error('Error fetching connected platforms:', err);

            // Check for 500 error and fall back to individual platform fetching
            if (err?.status === 500) {
                console.warn('⚠️ [useConnectedPlatforms] 500 Error detected. Falling back to individual platform fetching.');
                try {
                    const platformsToFetch = ['instagram', 'facebook', 'youtube', 'tiktok'];
                    const fallbackPromises = platformsToFetch.map(async (platform) => {
                        try {
                            // Construct fallback URL for specific platform
                            let fallbackUrl = '/platforms';
                            const fallbackParams = new URLSearchParams();
                            if (brandIdOrUninitializedUuid) {
                                if (isUninitialized) {
                                    fallbackParams.append('uninitializedBrandUuid', brandIdOrUninitializedUuid);
                                }
                                // Do NOT append brandId - backend infers it
                            }
                            fallbackParams.append('platform', platform);

                            const fallbackQueryString = fallbackParams.toString();
                            if (fallbackQueryString) {
                                fallbackUrl += `?${fallbackQueryString}`;
                            }

                            const data = await api.get<ApiPlatformAccountDto[]>(fallbackUrl);
                            return data || []; // Return empty array if null (204 No Content)
                        } catch (innerErr) {
                            console.warn(`⚠️ [useConnectedPlatforms] 500 Fallback: Failed to fetch ${platform}`, innerErr);
                            return []; // Return empty array for this platform on failure
                        }
                    });

                    const results = await Promise.all(fallbackPromises);

                    // Flatten results and convert
                    const allFallbackData = results.flat();
                    const connectedPlatforms = allFallbackData
                        .map(convertApiPlatformToConnected)
                        .filter((p): p is ConnectedPlatform => p !== null);

                    const allPlatforms = getAllPlatformsWithStatus(connectedPlatforms);
                    setPlatforms(allPlatforms);
                    // Clear error since fallback succeeded (partially or fully)
                    setError(null);
                    return;

                } catch (fallbackErr) {
                    console.error('❌ [useConnectedPlatforms] Critical: Fallback also failed', fallbackErr);
                    // If fallback fails, show original error
                }
            }

            setError(err instanceof Error ? err.message : 'Unknown error');
            // Return empty platforms on error
            setPlatforms(getAllPlatformsWithStatus([]));
        } finally {
            setLoading(false);
        }
    }, [brandIdOrUninitializedUuid, isUninitialized]);

    useEffect(() => {
        fetchPlatforms();
    }, [fetchPlatforms]);

    return { platforms, loading, error, refetch: fetchPlatforms };
};
