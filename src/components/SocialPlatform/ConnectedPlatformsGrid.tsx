import React, { useEffect } from 'react';
import { SocialPlatform } from '@models/SocialAccount';
import { CompactSocialButton } from './SocialConnection/CompactSocialButton';
import { ConnectedPlatform } from '@/models/Platform';
import { theme } from '@theme/theme';

// Inject shimmer keyframe once
const injectShimmerStyles = () => {
    const id = 'cpg-shimmer-styles';
    if (document.getElementById(id)) return;
    const el = document.createElement('style');
    el.id = id;
    el.textContent = `
        @keyframes cpgShimmer {
            0%   { background-position: -400px 0; }
            100% { background-position:  400px 0; }
        }
    `;
    document.head.appendChild(el);
};

const shimmerBase: React.CSSProperties = {
    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
    backgroundSize: '800px 100%',
    animation: 'cpgShimmer 1.4s ease-in-out infinite',
    borderRadius: '8px',
};

const SkeletonCard: React.FC = () => (
    <div
        style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: '12px',
            padding: '14px 20px',
            borderRadius: '12px',
            border: '2px solid rgba(0,0,0,0.06)',
            background: 'white',
            width: '100%',
            boxSizing: 'border-box',
        }}
    >
        {/* Circle icon */}
        <div
            style={{
                ...shimmerBase,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                flexShrink: 0,
            }}
        />
        {/* Text bar */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ ...shimmerBase, height: '13px', width: '70%', borderRadius: '6px' }} />
        </div>
    </div>
);

interface ConnectedPlatformsGridProps {
    connectedPlatforms: ConnectedPlatform[];
    onConnectionChange: () => void;
    isUninitializedBrand?: boolean;
    uninitializedBrandId?: string;
    brandId?: string;
    title?: string;
    subtitle?: string;
    isLoading?: boolean;
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
    isLoading = false,
}) => {
    useEffect(() => { injectShimmerStyles(); }, []);

    const platforms: SocialPlatform[] = ['instagram', 'facebook', 'tiktok', 'youtube'];

    const effectiveBrandId = isUninitializedBrand ? uninitializedBrandId : brandId;

    return (
        <div style={styles.socialSection}>
            <div style={styles.socialHeader}>
                <h2 style={styles.socialTitle}>{title}</h2>
                <p style={styles.socialSubtitle}>{subtitle}</p>
            </div>

            <div style={styles.socialGrid}>
                {isLoading
                    ? platforms.map((p) => <SkeletonCard key={p} />)
                    : platforms.map((platform) => (
                        <CompactSocialButton
                            key={platform}
                            platform={platform}
                            brandId={effectiveBrandId}
                            isUninitialized={isUninitializedBrand}
                            connectedPlatform={connectedPlatforms.find(p => p.platform === platform && p.isConnected)}
                            onConnectionChange={onConnectionChange}
                        />
                    ))
                }
            </div>
        </div>
    );
};
