import React from 'react';
import { useUserProfile } from '@/hooks/user/useUserProfile';
import { useConnectedPlatforms } from '@/hooks/platforms/useConnectedPlatforms';
import { useBrands } from '@/hooks/brands/useBrands';
import { ConnectedPlatformsGrid } from '@components/SocialPlatform/ConnectedPlatformsGrid';
import SocialsBackground from '@components/Background/SocialsBackground';
import GlobalNav from '@components/GlobalBar/Navigation/GlobalNav';
import { Container, Content, GreetingSection, Greeting, NameHighlight, Subtitle, GridContainer } from './styles';

const HomePage: React.FC = () => {
    const { profile } = useUserProfile();
    const { platforms: connectedPlatforms, loading: platformsLoading, refetch: refetchPlatforms } = useConnectedPlatforms();
    const { brands, currentBrand, switchBrand } = useBrands();

    // Get user's first name
    const firstName = profile?.firstName || 'Creator';

    return (
        <Container>
            <GlobalNav brands={brands} currentBrand={currentBrand} onBrandChange={switchBrand} />
            <SocialsBackground />

            <Content>
                <GreetingSection>
                    <Greeting>
                        Hello, <NameHighlight>{firstName}</NameHighlight>
                    </Greeting>
                    <Subtitle>
                        Staying present on social media has never been this easy.
                    </Subtitle>
                </GreetingSection>

                <GridContainer>
                    <ConnectedPlatformsGrid
                        connectedPlatforms={connectedPlatforms}
                        onConnectionChange={refetchPlatforms}
                        isUninitializedBrand={false}
                        brandId=""
                        title="Your Platforms"
                        subtitle="Connect your social media accounts to get started"
                        isLoading={platformsLoading}
                    />
                </GridContainer>
            </Content>
        </Container>
    );
};

export default HomePage;
