export type SocialPlatform = 'instagram' | 'facebook' | 'youtube' | 'tiktok';

export interface ConnectedPlatform {
    platform: SocialPlatform;
    username: string;
    displayName?: string;
    profilePicture?: string;
    isConnected: boolean;
    accountId?: string;
}

export interface ApiPlatformAccountDto {
    platform?: string | null;
    username?: string | null;
    displayName?: string | null;
    profilePicture?: string | null;
    accountId?: string | null;
}

// Helper to convert API response to ConnectedPlatform
export const convertApiPlatformToConnected = (
    apiPlatform: ApiPlatformAccountDto
): ConnectedPlatform | null => {
    if (!apiPlatform.platform || !apiPlatform.username) return null;

    const platform = apiPlatform.platform.toLowerCase() as SocialPlatform;
    if (!['instagram', 'facebook', 'youtube', 'tiktok'].includes(platform)) {
        return null;
    }

    return {
        platform,
        username: apiPlatform.username,
        displayName: apiPlatform.displayName || apiPlatform.username,
        profilePicture: apiPlatform.profilePicture || undefined,
        isConnected: true,
        accountId: apiPlatform.accountId || undefined,
    };
};

// Get platform icon path
export const getPlatformIconPath = (platform: SocialPlatform): string => {
    return `/icons/social/${platform}.png`;
};

// Get platform display name
export const getPlatformDisplayName = (platform: SocialPlatform): string => {
    const names: Record<SocialPlatform, string> = {
        instagram: 'Instagram',
        facebook: 'Facebook',
        youtube: 'YouTube',
        tiktok: 'TikTok',
    };
    return names[platform];
};

// Get all platforms with connection status
export const getAllPlatformsWithStatus = (
    connectedPlatforms: ConnectedPlatform[]
): ConnectedPlatform[] => {
    const allPlatforms: SocialPlatform[] = ['instagram', 'facebook', 'youtube', 'tiktok'];

    return allPlatforms.map((platform) => {
        const connected = connectedPlatforms.find((p) => p.platform === platform);
        if (connected) return connected;

        return {
            platform,
            username: '',
            isConnected: false,
        };
    });
};
