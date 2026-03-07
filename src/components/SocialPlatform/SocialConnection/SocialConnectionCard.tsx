import React, { useState } from 'react';
import { SocialPlatform, PLATFORM_COLORS, PLATFORM_NAMES } from '@models/SocialAccount';
import { useConnectPlatform } from '@/hooks/platforms/useConnectPlatform';
import ConfirmDialog from '@/components/Scheduler/CreateModals/ConfirmDialog/ConfirmDialog';
import { 
  CardContainer, 
  GradientOverlay, 
  CardTopSection, 
  CardIconContainer, 
  Icon, 
  IconEmoji, 
  CardNameSection, 
  CardPlatformName, 
  CardConnectedBadge, 
  CardAccountName, 
  CardNotConnectedText, 
  CardActionButton, 
  Spinner, 
  CardAnimatedBorder 
} from './styles';

interface SocialConnectionCardProps {
  platform: SocialPlatform;
  brandId: string;
}

export const SocialConnectionCard: React.FC<SocialConnectionCardProps> = ({
  platform,
  brandId,
}) => {
  const { isConnected, account, loading, connect, disconnect } = useConnectPlatform(platform, brandId);
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showDisconnectConfirm, setShowDisconnectConfirm] = useState(false);

  const platformColors = PLATFORM_COLORS[platform];
  const platformName = PLATFORM_NAMES[platform];

  const handleAction = async () => {
    if (loading) return;

    if (isConnected) {
      setShowDisconnectConfirm(true);
      return;
    }

    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    try {
      await connect();
    } catch (error) {
      console.error(`Failed to connect ${platform}:`, error);
    }
  };

  const confirmDisconnect = async () => {
    setShowDisconnectConfirm(false);
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);

    try {
      await disconnect();
    } catch (error) {
      console.error(`Failed to disconnect ${platform}:`, error);
    }
  };

  const getIconPath = () => {
    return `/icons/social/${platform}.png`;
  };

  const getIconEmoji = () => {
    const emojis: Record<SocialPlatform, string> = {
      facebook: '📘',
      instagram: '📷',
      tiktok: '🎵',
      youtube: '▶️',
    };
    return emojis[platform];
  };

  const [iconError, setIconError] = useState(false);

  return (
    <CardContainer
      $isConnected={isConnected}
      $isHovered={isHovered}
      $isLoading={loading}
      $isAnimating={isAnimating}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <GradientOverlay
        $isConnected={isConnected}
        $platformGradient={platformColors.gradient}
      />

      <CardTopSection>
        <CardIconContainer
          $platformGradient={platformColors.gradient}
          $isHovered={isHovered}
          $isLoading={loading}
        >
          {!iconError ? (
            <Icon
              src={getIconPath()}
              alt={platformName}
              onError={() => setIconError(true)}
            />
          ) : (
            <IconEmoji>{getIconEmoji()}</IconEmoji>
          )}
        </CardIconContainer>

        <CardNameSection>
          <CardPlatformName>{platformName}</CardPlatformName>
          {isConnected && (
            <CardConnectedBadge>● Connected</CardConnectedBadge>
          )}
        </CardNameSection>
      </CardTopSection>

      {isConnected && account?.accountName ? (
        <CardAccountName>{account.accountName}</CardAccountName>
      ) : (
        <CardNotConnectedText>Not connected</CardNotConnectedText>
      )}

      <CardActionButton
        $isConnected={isConnected}
        $isHovered={isHovered}
        $isLoading={loading}
        $platformGradient={platformColors.gradient}
        onClick={handleAction}
        disabled={loading}
      >
        {loading ? (
          <Spinner />
        ) : isConnected ? (
          isHovered ? 'Disconnect' : 'Connected'
        ) : (
          'Connect'
        )}
      </CardActionButton>

      {isConnected && (
        <CardAnimatedBorder
          $platformGradient={platformColors.gradient}
        />
      )}

      <ConfirmDialog
        isOpen={showDisconnectConfirm}
        title="Disconnect Platform"
        message={`Are you sure you want to disconnect ${platformName}?`}
        confirmLabel="Disconnect"
        cancelLabel="Cancel"
        danger={true}
        onConfirm={confirmDisconnect}
        onCancel={() => setShowDisconnectConfirm(false)}
      />
    </CardContainer>
  );
};