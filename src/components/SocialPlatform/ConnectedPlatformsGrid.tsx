import React from 'react';
import { SocialPlatform } from '@models/SocialAccount';
import { CompactSocialButton } from './SocialConnection/CompactSocialButton';
import { ConnectedPlatform } from '@/models/Platform';
import { theme } from '@theme/theme';

interface ConnectedPlatformsGridProps {
    connectedPlatforms: ConnectedPlatform[];
    onConnectionChange: () => void;
    isUninitializedBrand?: boolean;
    uninitializedBrandId?: string;
    brandId?: string;
    title?: string;
    subtitle?: string;
}

const styles = {
    socialSection: {
        padding: '28px 32px',
        marginTop: '16px',
        background: 'rgba(155, 93, 229, 0.03)',
        borderRadius: '16px',
        border: '2px solid',
        borderColor: 'rgba(155, 93, 229, 0.15)',
    },
    socialHeader: {
        marginBottom: '20px',
    },
    socialTitle: {
        fontSize: '20px',
        fontWeight: 700,
        fontFamily: 'Figtree, ui-sans-serif, system-ui, sans-serif',
        fontStyle: 'italic',
        color: theme.colors.text,
        margin: '0 0 6px 0',
    },
    socialSubtitle: {
        fontSize: '14px',
        color: theme.colors.muted,
        margin: 0,
    },
    socialGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
    },
};

export const ConnectedPlatformsGrid: React.FC<ConnectedPlatformsGridProps> = ({
    connectedPlatforms,
    onConnectionChange,
    isUninitializedBrand = false,
    uninitializedBrandId = '',
    brandId = '',
    title = 'Connect Social Medias',
    subtitle = 'Link your social accounts to grow your presence',
}) => {
    const platforms: SocialPlatform[] = ['instagram', 'facebook', 'tiktok', 'youtube'];

    // Identify which ID to use
    // If isUninitializedBrand is true, we must pass the uninitializedBrandId as the 'brandId' to CompactSocialButton if the button expects it,
    // OR we pass it as 'brandId' and let the button handle it.
    // CompactSocialButton signature: (platform, brandId, isUninitialized)
    // useConnectPlatform signature: (platform, brandId, isUninitialized)

    // So we pass uninitializedBrandId as brandId if isUninitializedBrand is true.
    const effectiveBrandId = isUninitializedBrand ? uninitializedBrandId : brandId;

    return (
        <div style={styles.socialSection}>
            <div style={styles.socialHeader}>
                <h2 style={styles.socialTitle}>{title}</h2>
                <p style={styles.socialSubtitle}>{subtitle}</p>
            </div>

            <div style={styles.socialGrid}>
                {platforms.map((platform) => (
                    <CompactSocialButton
                        key={platform}
                        platform={platform}
                        brandId={effectiveBrandId}
                        isUninitialized={isUninitializedBrand}
                        connectedPlatform={connectedPlatforms.find(p => p.platform === platform && p.isConnected)}
                        onConnectionChange={onConnectionChange}
                    />
                ))}
            </div>
        </div>
    );
};
