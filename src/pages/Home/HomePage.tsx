import React from 'react';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { useConnectedPlatforms } from '@/hooks/platforms/useConnectedPlatforms';
import { useBrands } from '@/hooks/brands/useBrands';
import { ConnectedPlatformsGrid } from '@components/SocialPlatform/ConnectedPlatformsGrid';
import SocialsBackground from '@components/Background/SocialsBackground';
import GlobalNav from '@components/GlobalBar/Navigation/GlobalNav';
import { theme } from '@theme/theme';

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column' as const,
        position: 'relative' as const,
        overflow: 'hidden',
    },
    content: {
        maxWidth: '1000px',
        width: '100%',
        margin: '0 auto',
        padding: '40px',
        position: 'relative' as const,
        zIndex: 1,
    },
    greetingSection: {
        marginBottom: '40px',
        textAlign: 'left' as const,
    },
    greeting: {
        fontSize: '48px',
        fontWeight: 800,
        color: theme.colors.text,
        marginBottom: '8px',
        letterSpacing: '-1px',
        fontFamily: 'Figtree, ui-sans-serif, system-ui, sans-serif',
    },
    nameHighlight: {
        background: theme.gradients.innovator,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
    },
    subtitle: {
        fontSize: '18px',
        color: theme.colors.muted,
    },
    gridContainer: {
        background: 'white',
        borderRadius: '24px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(0, 0, 0, 0.05)',
    }
};

const HomePage: React.FC = () => {
    const { profile } = useUserProfile();
    const { platforms: connectedPlatforms, refetch: refetchPlatforms } = useConnectedPlatforms();
    const { brands, currentBrand, switchBrand } = useBrands();

    // Get user's first name
    const firstName = profile?.firstName || 'Creator';

    return (
        <div style={styles.container}>
            <GlobalNav brands={brands} currentBrand={currentBrand} onBrandChange={switchBrand} />
            <SocialsBackground />

            <div style={styles.content}>
                <div style={styles.greetingSection}>
                    <h1 style={styles.greeting}>
                        Hello, <span style={styles.nameHighlight}>{firstName}</span>
                    </h1>
                    <p style={styles.subtitle}>
                        Manage your social presence and grow your brand.
                    </p>
                </div>

                <div style={styles.gridContainer}>
                    <ConnectedPlatformsGrid
                        connectedPlatforms={connectedPlatforms}
                        onConnectionChange={refetchPlatforms}
                        isUninitializedBrand={false}
                        brandId="" // Passing empty string as user requested not to pass uninitializedBrandUuid
                        title="Your Platforms"
                        subtitle="Connect your social media accounts to get started"
                    />
                </div>
            </div>
        </div>
    );
};

export default HomePage;
