import React from 'react';
import { SocialPlatform } from '@models/SocialAccount';
import { CompactSocialButton } from './SocialConnection/CompactSocialButton';
import { ConnectedPlatform } from '@/models/Platform';
import { SocialSection, SocialHeader, SocialTitle, SocialSubtitle, SocialGrid, SkeletonCardWrapper, SkeletonCircle, SkeletonTextWrapper, SkeletonTextBar } from './styles';

const SkeletonCard: React.FC = () => (
    <SkeletonCardWrapper>
        <SkeletonCircle />
        <SkeletonTextWrapper>
            <SkeletonTextBar />
        </SkeletonTextWrapper>
    </SkeletonCardWrapper>
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
    const platforms: SocialPlatform[] = ['instagram', 'facebook', 'tiktok', 'youtube'];

    const effectiveBrandId = isUninitializedBrand ? uninitializedBrandId : brandId;

    return (
        <SocialSection>
            <SocialHeader>
                <SocialTitle>{title}</SocialTitle>
                <SocialSubtitle>{subtitle}</SocialSubtitle>
            </SocialHeader>

            <SocialGrid>
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
            </SocialGrid>
        </SocialSection>
    );
};
