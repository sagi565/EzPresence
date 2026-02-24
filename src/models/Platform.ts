export type SocialPlatform = 'instagram' | 'facebook' | 'youtube' | 'tiktok';

export interface ConnectedPlatform {
    platform: SocialPlatform;
    username: string;
    displayName?: string;
    profilePicture?: string;
    isConnected: boolean;
    accountId?: string;
}

export interface ApiPlatformAccountDetails {
    accountId?: string | number | null;
    displayName?: string | null;
    username?: string | null;
    thumbnailUrl?: string | null;
}

export type ApiPlatformAccountDto = Record<string, ApiPlatformAccountDetails>;

// Helper to convert API response to ConnectedPlatform
export const convertApiPlatformToConnected = (
    apiPlatform: ApiPlatformAccountDto
): ConnectedPlatform | null => {
    // The object typically has one key, e.g. "INSTAGRAM"
    const keys = Object.keys(apiPlatform);
    if (keys.length === 0) return null;

    const platformKey = keys[0];
    const details = apiPlatform[platformKey];

    // Normalize platform key to lower case to match SocialPlatform type
    const platform = platformKey.toLowerCase() as SocialPlatform;

    if (!['instagram', 'facebook', 'youtube', 'tiktok'].includes(platform)) {
        return null;
    }

    if (!details || !details.username) return null;

    return {
        platform,
        username: details.username,
        displayName: details.displayName || details.username,
        profilePicture: details.thumbnailUrl || undefined,
        isConnected: true,
        accountId: details.accountId?.toString() || undefined,
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
